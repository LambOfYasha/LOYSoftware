import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { Entry } from "@/lib/yasha/engine";
import { viewableImage } from "@/lib/yasha/engine";
import { galleryHtml, rememberSlides, slidesFrom } from "@/lib/yasha/share";

export function SharePanel({
  entries,
  onClose,
  onNotice,
}: {
  entries: Entry[];
  onClose: () => void;
  onNotice: (notice: string) => void;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const images = entries.filter(viewableImage);

  async function build() {
    setBusy(true);
    try {
      const slides = await slidesFrom(images);
      if (slides.length === 0) {
        onNotice("No viewable images in this set.");
        return null;
      }
      rememberSlides(slides);
      return slides;
    } catch {
      onNotice("Could not prepare the gallery.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="fixed inset-0 z-30 flex min-h-0 flex-col bg-bg md:static md:z-auto md:w-96 md:border-l md:border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="font-display text-2xl">Share</h2>
        <button type="button" className={ghost} onClick={onClose} aria-label="Close share">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4">
        <p className="text-sm text-muted">
          Images stay on this device until you export them. The gallery page is one HTML file — put it on any web host, including a machine running Ubuntu.
        </p>
        <p className="text-sm tabular-nums text-fg">{images.length} viewable images in this set, up to 24 in a pack.</p>
        <button
          type="button"
          className={brass}
          disabled={busy}
          onClick={() => {
            void build().then((slides) => {
              if (slides) void navigate({ to: "/hosted" });
            });
          }}
        >
          {busy ? "Preparing…" : "Preview hosted gallery"}
        </button>
        <button
          type="button"
          className={ghost}
          disabled={busy}
          onClick={() => {
            void build().then((slides) => {
              if (!slides) return;
              const html = galleryHtml(slides);
              const blob = new Blob([html], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "yashafiness-gallery.html";
              link.click();
              URL.revokeObjectURL(url);
              onNotice("Gallery page downloaded. Open it, or place it on your host.");
            });
          }}
        >
          Download host page
        </button>
        <p className="text-sm text-muted">
          Guests do not need YashaFiness installed. Arrow keys move through the pictures after you open one.
        </p>
      </div>
    </aside>
  );
}

const brass =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-4 text-sm font-medium text-brass-ink disabled:opacity-50";
const ghost =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-raised px-3 text-sm text-fg";
