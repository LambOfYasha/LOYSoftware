import { dropBlob, getBlob, putBlob } from "./blobs";
import type { Entry, Rule } from "./engine";
import { SAMPLE_IDS, SAMPLES } from "./samples";

const SETTINGS_KEY = "yashafiness-settings";
const DB_NAME = "yashafiness";
const STORE = "imports";

export type SampleOverride = {
  id: string;
  folder?: string;
  name?: string;
  hidden?: boolean;
};

export type Settings = {
  rules?: Rule[];
  autoApply?: boolean;
  extraFolders?: string[];
  overrides?: SampleOverride[];
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Could not open library storage"));
  });
}

export function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Settings;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function overridesFrom(entries: Entry[]): SampleOverride[] {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const list: SampleOverride[] = [];
  for (const sample of SAMPLES) {
    const current = byId.get(sample.id);
    if (!current) {
      list.push({ id: sample.id, hidden: true });
      continue;
    }
    if (current.folder !== sample.folder || current.name !== sample.name) {
      list.push({ id: sample.id, folder: current.folder, name: current.name });
    }
  }
  return list;
}

export function applySavedSamples(overrides: SampleOverride[] | undefined): Entry[] {
  const map = new Map((overrides ?? []).map((item) => [item.id, item]));
  return SAMPLES.flatMap((sample) => {
    const override = map.get(sample.id);
    if (override?.hidden) return [];
    return [
      {
        ...sample,
        folder: override?.folder ?? sample.folder,
        name: override?.name ?? sample.name,
      },
    ];
  });
}

type StoredImport = {
  entry: Entry;
  blob: Blob;
};

export async function readImports(): Promise<Entry[]> {
  const db = await openDb();
  const rows = await new Promise<StoredImport[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve((req.result as StoredImport[]) ?? []);
    req.onerror = () => reject(req.error ?? new Error("Could not read imports"));
  });
  db.close();
  return rows.map((row) => {
    if (row.entry.href?.startsWith("blob:")) URL.revokeObjectURL(row.entry.href);
    putBlob(row.entry.id, row.blob);
    const href = URL.createObjectURL(row.blob);
    return { ...row.entry, href, origin: "import" as const };
  });
}

export async function writeImports(entries: Entry[]) {
  const imports = entries.filter((entry) => entry.origin === "import" && !SAMPLE_IDS.has(entry.id));
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    store.clear();
    for (const entry of imports) {
      const blob = getBlob(entry.id);
      if (!blob) continue;
      const stored: StoredImport = {
        blob,
        entry: { ...entry, href: undefined },
      };
      store.put(stored, entry.id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not save imports"));
  });
  db.close();
}

export function forgetBlob(id: string) {
  dropBlob(id);
}
