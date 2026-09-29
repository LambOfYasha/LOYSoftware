import { safeSegment } from "@/lib/utils";
import { getBlob } from "./blobs";
import type { Entry } from "./engine";

async function sourceBlob(entry: Entry): Promise<Blob | null> {
  const stored = getBlob(entry.id);
  if (stored) return stored;
  if (entry.text != null) return new Blob([entry.text], { type: entry.mime || "text/plain" });
  if (!entry.href) return null;
  const res = await fetch(entry.href);
  if (!res.ok) return null;
  return res.blob();
}

export async function writeCopies(entries: Entry[]): Promise<string> {
  const picker = (
    window as Window & {
      showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
    }
  ).showDirectoryPicker;
  if (!picker) {
    return "This browser cannot write folders. Chromium on Ubuntu can. A hosted gallery page still downloads from Share.";
  }
  const root = await picker();
  let count = 0;
  for (const entry of entries) {
    const blob = await sourceBlob(entry);
    if (!blob) continue;
    const dir = await root.getDirectoryHandle(safeSegment(entry.folder), { create: true });
    const file = await dir.getFileHandle(safeSegment(entry.name), { create: true });
    const writable = await file.createWritable();
    await writable.write(blob);
    await writable.close();
    count += 1;
  }
  return `Wrote ${count} copies into the folder you picked. Originals stayed put.`;
}
