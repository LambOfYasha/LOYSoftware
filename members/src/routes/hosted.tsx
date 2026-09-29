import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { recallSlides, type HostSlide } from "@/lib/yasha/share";
import { Viewer } from "@/components/yasha/Viewer";
import type { Entry } from "@/lib/yasha/engine";

export const Route = createFileRoute("/hosted")({ component: HostedGallery });

function HostedGallery() {
  const [slides, setSlides] = useState<HostSlide[] | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    setSlides(recallSlides());
    setReady(true);
  }, []);

  const entries: Entry[] = (slides ?? []).map((slide, index) => ({
    id: `host-${index}`,
    name: slide.name,
    size: 0,
    mime: "image/jpeg",
    ext: "jpg",
    kind: "image",
    folder: "Gallery",
    addedAt: index,
    modifiedAt: index,
    href: slide.src,
    origin: "sample",
  }));

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-5 md:px-8">
        <div>
          <p className="font-display text-3xl">
            Yasha<span className="italic text-brass">Finess</span>
          </p>
          <h1 className="text-sm text-muted">Hosted gallery</h1>
        </div>
        <Link to="/" className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm">
          Back to library
        </Link>
      </header>
      {!ready ? (
        <p className="px-4 py-8 text-muted md:px-8">Opening the gallery.</p>
      ) : entries.length === 0 ? (
        <p className="max-w-md px-4 py-8 text-muted md:px-8">
          No gallery is staged in this tab. From the library, choose Share, then preview or download a host page.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 px-4 py-5 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button type="button" onClick={() => setOpen(entry.id)} className="w-full overflow-hidden rounded-xl border border-line bg-surface text-left">
                <img src={entry.href} alt={entry.name} className="aspect-photo w-full object-cover" />
                <span className="block truncate px-3 py-3">{entry.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open ? <Viewer entries={entries} currentId={open} onClose={() => setOpen(null)} onOpen={setOpen} /> : null}
    </main>
  );
}
