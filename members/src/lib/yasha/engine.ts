export type Kind = "image" | "document" | "audio" | "video" | "archive" | "other";

export type Entry = {
  id: string;
  name: string;
  size: number;
  mime: string;
  ext: string;
  kind: Kind;
  folder: string;
  addedAt: number;
  modifiedAt: number;
  width?: number;
  height?: number;
  href?: string;
  text?: string;
  origin: "sample" | "import";
};

export type MatchField = "ext" | "name" | "kind" | "size";
export type MatchOp = "is" | "contains" | "gt" | "lt";

export type Rule = {
  id: string;
  name: string;
  enabled: boolean;
  field: MatchField;
  op: MatchOp;
  value: string;
  folder: string;
};

const IMAGE = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif", "bmp", "svg", "heic", "tif", "tiff"]);
const DOC = new Set([
  "pdf",
  "txt",
  "md",
  "doc",
  "docx",
  "rtf",
  "csv",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "json",
  "html",
  "htm",
]);
const AUDIO = new Set(["mp3", "wav", "flac", "aac", "ogg", "m4a"]);
const VIDEO = new Set(["mp4", "mov", "webm", "mkv", "avi"]);
const ARCHIVE = new Set(["zip", "tar", "gz", "tgz", "7z", "rar"]);

export function extOf(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  const i = base.lastIndexOf(".");
  if (i <= 0) return "";
  return base.slice(i + 1).toLowerCase();
}

export function kindOf(ext: string, mime = ""): Kind {
  const e = ext.toLowerCase();
  if (IMAGE.has(e) || mime.startsWith("image/")) return "image";
  if (AUDIO.has(e) || mime.startsWith("audio/")) return "audio";
  if (VIDEO.has(e) || mime.startsWith("video/")) return "video";
  if (ARCHIVE.has(e)) return "archive";
  if (DOC.has(e) || mime.startsWith("text/") || mime === "application/pdf" || mime === "application/json") {
    return "document";
  }
  return "other";
}

export function matches(entry: Entry, rule: Rule): boolean {
  if (!rule.enabled) return false;
  if (rule.field === "ext") {
    const v = rule.value.toLowerCase().replace(/^\./, "");
    if (!v) return false;
    if (rule.op === "is") return entry.ext === v;
    if (rule.op === "contains") return entry.ext.includes(v);
    return false;
  }
  if (rule.field === "name") {
    const n = entry.name.toLowerCase();
    const v = rule.value.toLowerCase();
    if (!v) return false;
    if (rule.op === "is") return n === v;
    if (rule.op === "contains") return n.includes(v);
    return false;
  }
  if (rule.field === "kind") {
    return rule.op === "is" && entry.kind === rule.value;
  }
  if (rule.field === "size") {
    const n = Number(rule.value);
    if (!Number.isFinite(n)) return false;
    if (rule.op === "gt") return entry.size > n;
    if (rule.op === "lt") return entry.size < n;
    return false;
  }
  return false;
}

export function applyRules(entries: Entry[], rules: Rule[]): { entries: Entry[]; moved: number } {
  let moved = 0;
  const next = entries.map((entry) => {
    const rule = rules.find((item) => matches(entry, item));
    if (!rule || entry.folder === rule.folder) return entry;
    moved += 1;
    return { ...entry, folder: rule.folder };
  });
  return { entries: next, moved };
}

function stemOf(entry: Entry): string {
  if (!entry.ext) return entry.name;
  const suffix = `.${entry.ext}`;
  return entry.name.toLowerCase().endsWith(suffix) ? entry.name.slice(0, -suffix.length) : entry.name;
}

export function applyRename(entries: Entry[], ids: Set<string>, pattern: string): Entry[] {
  const selected = entries.filter((entry) => ids.has(entry.id));
  const indexById = new Map(selected.map((entry, index) => [entry.id, index + 1]));
  const renamed = entries.map((entry) => {
    if (!ids.has(entry.id)) return entry;
    const date = new Date(entry.modifiedAt);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const index = String(indexById.get(entry.id) ?? 1).padStart(2, "0");
    let base = pattern
      .replaceAll("{stem}", stemOf(entry))
      .replaceAll("{ext}", entry.ext)
      .replaceAll("{index}", index)
      .replaceAll("{date}", `${y}-${m}-${d}`)
      .replaceAll("{folder}", entry.folder)
      .replaceAll("{kind}", entry.kind);
    if (entry.ext && !base.toLowerCase().endsWith(`.${entry.ext}`)) base = `${base}.${entry.ext}`;
    base = base.replace(/[\\/:*?"<>|]/g, "-").trim() || entry.name;
    return { ...entry, name: base };
  });
  const seen = new Map<string, number>();
  return renamed.map((entry) => {
    const key = `${entry.folder}/${entry.name.toLowerCase()}`;
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    if (count === 0) return entry;
    const stem = stemOf(entry);
    const name = entry.ext ? `${stem}-${count}.${entry.ext}` : `${stem}-${count}`;
    return { ...entry, name };
  });
}

export function duplicateGroups(entries: Entry[]): Entry[][] {
  const map = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = `${entry.name.toLowerCase()}::${entry.size}`;
    const group = map.get(key) ?? [];
    group.push(entry);
    map.set(key, group);
  }
  return [...map.values()].filter((group) => group.length > 1);
}

export function parkDuplicates(entries: Entry[]): { entries: Entry[]; parked: number } {
  const groups = duplicateGroups(entries);
  const park = new Set<string>();
  for (const group of groups) {
    const sorted = [...group].sort((a, b) => a.addedAt - b.addedAt);
    for (const extra of sorted.slice(1)) park.add(extra.id);
  }
  if (park.size === 0) return { entries, parked: 0 };
  return {
    parked: park.size,
    entries: entries.map((entry) => (park.has(entry.id) ? { ...entry, folder: "Duplicates" } : entry)),
  };
}

export const DEFAULT_RULES: Rule[] = [
  { id: "rule-image", name: "Pictures by kind", enabled: true, field: "kind", op: "is", value: "image", folder: "Images" },
  {
    id: "rule-doc",
    name: "Documents by kind",
    enabled: true,
    field: "kind",
    op: "is",
    value: "document",
    folder: "Documents",
  },
  { id: "rule-audio", name: "Audio by kind", enabled: true, field: "kind", op: "is", value: "audio", folder: "Audio" },
  { id: "rule-video", name: "Video by kind", enabled: true, field: "kind", op: "is", value: "video", folder: "Video" },
  {
    id: "rule-archive",
    name: "Archives by kind",
    enabled: true,
    field: "kind",
    op: "is",
    value: "archive",
    folder: "Archives",
  },
  {
    id: "rule-invoice",
    name: "Invoices to Finance",
    enabled: false,
    field: "name",
    op: "contains",
    value: "invoice",
    folder: "Finance",
  },
];

export function viewableImage(entry: Entry): boolean {
  return entry.kind === "image" && !["heic", "tif", "tiff"].includes(entry.ext);
}
