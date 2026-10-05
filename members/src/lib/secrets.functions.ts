import { chmodSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { assertSameSiteRequest } from "@/lib/auth/isolation.server";
import { SECRET_FIELDS, SECRET_KEYS, type SecretStatus } from "@/lib/secrets";

export const SECRETS_FILE = ".secrets.local.json";
const MAX_LENGTH = 2000;

export type SecretSource = "host" | "pasted" | "missing";

export type { SecretStatus };

function projectRoot(): string {
  return process.cwd();
}

function secretsPath(): string {
  return join(projectRoot(), SECRETS_FILE);
}

export function pasteAllowed(hostHeader: string | null): boolean {
  const raw = hostHeader ?? "";
  const host = (raw.startsWith("[") ? raw.slice(1, raw.indexOf("]")) : raw.split(":")[0]).toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return true;
  return host.endsWith(".grok-sandbox.com");
}

function readPasted(): Record<string, string> {
  try {
    const parsed = JSON.parse(readFileSync(secretsPath(), "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!SECRET_KEYS.has(key) || typeof value !== "string") continue;
      const trimmed = value.trim();
      if (trimmed) out[key] = trimmed;
    }
    return out;
  } catch {
    return {};
  }
}

/** Host environment wins. The local file is used only when the host did not set the key. */
export function readSecret(key: string): string | undefined {
  if (!SECRET_KEYS.has(key)) return undefined;
  const fromEnv = process.env[key]?.trim();
  if (fromEnv) return fromEnv;
  return readPasted()[key];
}

function hint(value: string): string | null {
  if (value.length < 8) return null;
  return value.slice(-4);
}

function statusList(): SecretStatus[] {
  const pasted = readPasted();
  return SECRET_FIELDS.map((field) => {
    const fromEnv = process.env[field.key]?.trim();
    if (fromEnv) {
      return { ...field, source: "host", hint: null };
    }
    const saved = pasted[field.key];
    if (saved) {
      return { ...field, source: "pasted", hint: hint(saved) };
    }
    return { ...field, source: "missing", hint: null };
  }).map((row) => row);
}

function assertPasteAllowed(): void {
  assertSameSiteRequest();
  const request = getRequest();
  if (!request || !pasteAllowed(request.headers.get("host"))) {
    throw new Error("Keys can only be saved on this machine or in the private preview.");
  }
}

function writePasted(next: Record<string, string>): void {
  const path = secretsPath();
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 });
  chmodSync(tmp, 0o600);
  renameSync(tmp, path);
  chmodSync(path, 0o600);
}

export const secretStatus = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const allowed = request ? pasteAllowed(request.headers.get("host")) : false;
  return { pasteAllowed: allowed, fields: statusList() };
});

export const saveSecrets = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new Error("Send a key list.");
    }
    const values = (input as { values?: unknown }).values;
    if (!values || typeof values !== "object" || Array.isArray(values)) {
      throw new Error("Send a key list.");
    }
    const clean: Record<string, string> = {};
    for (const [key, value] of Object.entries(values)) {
      if (!SECRET_KEYS.has(key)) throw new Error("That key is not used by this app.");
      if (typeof value !== "string") throw new Error("A key was not text.");
      const trimmed = value.trim();
      if (trimmed.length > MAX_LENGTH) throw new Error("That key is too long.");
      if (/[\u0000\r\n]/.test(trimmed)) throw new Error("A key cannot contain a line break.");
      clean[key] = trimmed;
    }
    return clean;
  })
  .handler(async ({ data }) => {
    assertPasteAllowed();
    const next = readPasted();
    let restart = false;
    for (const [key, value] of Object.entries(data)) {
      if (process.env[key]?.trim()) continue;
      const field = SECRET_FIELDS.find((item) => item.key === key);
      if (!value) {
        delete next[key];
        continue;
      }
      next[key] = value;
      if (field?.when === "restart") restart = true;
    }
    writePasted(next);
    const request = getRequest();
    return {
      pasteAllowed: request ? pasteAllowed(request.headers.get("host")) : false,
      fields: statusList(),
      restart,
    };
  });
