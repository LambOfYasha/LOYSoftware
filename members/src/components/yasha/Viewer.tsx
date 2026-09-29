import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { viewableImage, type Entry } from "@/lib/yasha/engine";

export function Viewer({
  entries,
  currentId,
  onClose,
  onOpen,
}: {
  entries: Entry[];
  currentId: string;
  onClose: () => void;
  onOpen: (id: string) => void;
}) {
  const index = Math.max(0, entries.findIndex((entry) => entry.id === currentId));
  const entry = entries[index];
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setScale(1);
    setRotation(0);
  }, [currentId]);

  useEffect(() => {
    if (!playing || entries.length < 2) return;
    const timer = window.setInterval(() => {
      const next = entries[(index + 1) % entries.length];
      if (next) onOpen(next.id);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [playing, index, entries, onOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        const next = entries[(index + 1) % entries.length];
        if (next) onOpen(next.id);
      }
      if (event.key === "ArrowLeft") {
        const next = entries[(index - 1 + entries.length) % entries.length];
        if (next) onOpen(next.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entries, index, onClose, onOpen]);

  if (!entry) return null;
  const image = viewableImage(entry) && entry.href;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-bg/95 text-fg"
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${entry.name}`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        <p className="min-w-0 flex-1 truncate font-medium">{entry.name}</p>
        <p className="text-sm text-muted tabular-nums">
          {entry.width && entry.height ? `${entry.width}×${entry.height} · ` : ""}
          {formatBytes(entry.size)}
        </p>
        <button type="button" className={ghost} onClick={() => setScale((value) => Math.max(0.5, value - 0.25))}>
          <ZoomOut className="size-4" />
          <span className="sr-only">Zoom out</span>
        </button>
        <button type="button" className={ghost} onClick={() => setScale((value) => Math.min(3, value + 0.25))}>
          <ZoomIn className="size-4" />
          <span className="sr-only">Zoom in</span>
        </button>
        <button type="button" className={ghost} onClick={() => setRotation((value) => (value + 90) % 360)}>
          <RotateCw className="size-4" />
          <span className="sr-only">Rotate view</span>
        </button>
        <button type="button" className={ghost} onClick={() => setPlaying((value) => !value)} disabled={entries.length < 2}>
          {playing ? "Stop" : "Play"}
        </button>
        <button type="button" className={ghost} onClick={onClose}>
          <X className="size-4" />
          Close
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2">
        <button type="button" className={ghost} aria-label="Previous" onClick={() => onOpen(entries[(index - 1 + entries.length) % entries.length]!.id)}>
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-auto">
          {image ? (
            <img
              src={entry.href}
              alt={entry.name}
              className="max-h-[70vh] max-w-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
            />
          ) : entry.text ? (
            <pre className="max-h-[70vh] max-w-3xl overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-surface p-5 text-sm">
              {entry.text}
            </pre>
          ) : (
            <p className="text-muted">No preview for this file type. It still sorts with the library.</p>
          )}
        </div>
        <button type="button" className={ghost} aria-label="Next" onClick={() => onOpen(entries[(index + 1) % entries.length]!.id)}>
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-line px-3 py-2">
        {entries.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item.id)}
            className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border ${item.id === entry.id ? "border-brass" : "border-line"}`}
            aria-label={item.name}
          >
            {viewableImage(item) && item.href ? (
              <img src={item.href} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center bg-raised px-1 text-center text-xs text-muted">
                {item.ext || item.kind}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

const ghost =
  "inline-flex min-h-11 items-center justify-center gap-1 rounded-full border border-line bg-surface px-3 text-sm text-fg";
