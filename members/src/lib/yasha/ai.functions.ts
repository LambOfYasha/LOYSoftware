import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type AiMove = { id: string; folder: string };
export type AiRename = { id: string; name: string };

export type AiSuggestion = {
  summary: string;
  moves: AiMove[];
  renames: AiRename[];
};

type InventoryItem = {
  id: string;
  name: string;
  ext: string;
  kind: string;
  size: number;
  folder: string;
};

const KINDS = new Set(["image", "document", "audio", "video", "archive", "other"]);

function cleanFolder(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const folder = value.replace(/[\\/:*?"<>|]/g, " ").replace(/\s+/g, " ").trim();
  if (!folder || folder.length > 40) return null;
  return folder;
}

function cleanName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.replace(/[\\/:*?"<>|]/g, "-").trim();
  if (!name || name.length > 120 || name === "." || name === "..") return null;
  return name;
}

function asInventory(input: unknown): InventoryItem[] {
  if (!input || typeof input !== "object" || !Array.isArray((input as { files?: unknown }).files)) {
    throw new Error("Send a file list.");
  }
  const files = (input as { files: unknown[] }).files;
  if (files.length === 0) throw new Error("Add files before asking.");
  if (files.length > 60) throw new Error("Ask about 60 files at a time.");
  return files.map((item) => {
    if (!item || typeof item !== "object") throw new Error("A file record was incomplete.");
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id.slice(0, 80) : "";
    const name = typeof row.name === "string" ? row.name.slice(0, 80) : "";
    const ext = typeof row.ext === "string" ? row.ext.slice(0, 12).toLowerCase() : "";
    const kind = typeof row.kind === "string" && KINDS.has(row.kind) ? row.kind : "other";
    const folder = typeof row.folder === "string" ? row.folder.slice(0, 40) : "Inbox";
    const size = typeof row.size === "number" && Number.isFinite(row.size) ? Math.max(0, Math.round(row.size)) : 0;
    if (!id || !name) throw new Error("A file record was incomplete.");
    return { id, name, ext, kind, size, folder };
  });
}

function parseSuggestion(text: string, allowed: Set<string>): AiSuggestion {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI did not return a plan.");
  const parsed = JSON.parse(text.slice(start, end + 1)) as {
    summary?: unknown;
    moves?: unknown;
    renames?: unknown;
  };
  const moves: AiMove[] = [];
  const renames: AiRename[] = [];
  if (Array.isArray(parsed.moves)) {
    for (const move of parsed.moves) {
      if (!move || typeof move !== "object") continue;
      const row = move as { id?: unknown; folder?: unknown };
      if (typeof row.id !== "string" || !allowed.has(row.id)) continue;
      const folder = cleanFolder(row.folder);
      if (!folder) continue;
      moves.push({ id: row.id, folder });
    }
  }
  if (Array.isArray(parsed.renames)) {
    for (const rename of parsed.renames) {
      if (!rename || typeof rename !== "object") continue;
      const row = rename as { id?: unknown; name?: unknown };
      if (typeof row.id !== "string" || !allowed.has(row.id)) continue;
      const name = cleanName(row.name);
      if (!name) continue;
      renames.push({ id: row.id, name });
    }
  }
  const summary =
    typeof parsed.summary === "string" && parsed.summary.trim()
      ? parsed.summary.trim().slice(0, 280)
      : "Suggested a folder plan from file names and kinds.";
  return { summary, moves, renames };
}

export const suggestOrganization = createServerFn({ method: "POST" })
  .validator((input: unknown) => asInventory(input))
  .middleware([authMiddleware])
  .handler(async ({ data }): Promise<{ ok: true; suggestion: AiSuggestion } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "AI is not available in this environment. Rules still run locally." };
    const allowed = new Set(data.map((item) => item.id));
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 700,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "You organize a personal file library. Reply with JSON only, no markdown. Shape: {\"summary\":string,\"moves\":[{\"id\":string,\"folder\":string}],\"renames\":[{\"id\":string,\"name\":string}]}. Use only given ids. Folder names are short Title Case, at most 8 folders. Keep extensions on renames. Do not invent files.",
            },
            {
              role: "user",
              content: JSON.stringify(data),
            },
          ],
        }),
        signal: AbortSignal.timeout(50_000),
      });
      if (!res.ok) return { ok: false, error: `AI request failed (${res.status}).` };
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = body.choices?.[0]?.message?.content ?? "";
      return { ok: true, suggestion: parseSuggestion(text, allowed) };
    } catch (error) {
      if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
        return { ok: false, error: "AI took too long. Try again." };
      }
      const message = error instanceof Error ? error.message : "AI request failed.";
      return { ok: false, error: message };
    }
  });
