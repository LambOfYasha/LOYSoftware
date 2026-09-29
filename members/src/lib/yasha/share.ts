import type { Entry } from "./engine";
import { viewableImage } from "./engine";
import { getBlob } from "./blobs";

export type HostSlide = {
  name: string;
  src: string;
  width?: number;
  height?: number;
};

const MAX_SLIDES = 24;
const MAX_EDGE = 1400;

async function blobFor(entry: Entry): Promise<Blob | null> {
  const stored = getBlob(entry.id);
  if (stored) return stored;
  if (!entry.href) return null;
  const res = await fetch(entry.href);
  if (!res.ok) return null;
  return res.blob();
}

async function compress(blob: Blob): Promise<string | null> {
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read an image"));
      el.src = url;
    });
    const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function slidesFrom(entries: Entry[]): Promise<HostSlide[]> {
  const images = entries.filter(viewableImage).slice(0, MAX_SLIDES);
  const slides: HostSlide[] = [];
  for (const entry of images) {
    const blob = await blobFor(entry);
    if (!blob) continue;
    const src = await compress(blob);
    if (!src) continue;
    slides.push({ name: entry.name, src, width: entry.width, height: entry.height });
  }
  return slides;
}

export function galleryHtml(slides: HostSlide[]): string {
  const payload = JSON.stringify({ title: "YashaFiness", slides }).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>YashaFiness gallery</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #10120e; color: #f3ecdf; font: 16px/1.5 Outfit, ui-sans-serif, system-ui, sans-serif; }
  header { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; padding: 20px 22px 8px; }
  h1 { font-family: Fraunces, ui-serif, Georgia, serif; font-weight: 560; font-size: 28px; margin: 0; }
  p { margin: 0; color: #a39b8c; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; padding: 16px 22px 40px; }
  figure { margin: 0; background: #1a1d17; border: 1px solid #34392e; border-radius: 12px; overflow: hidden; }
  img { width: 100%; aspect-ratio: 3/2; object-fit: cover; display: block; background: #23281f; }
  figcaption { padding: 10px 12px 12px; font-size: 14px; }
  button { font: inherit; color: #1c1408; background: #c9923a; border: 0; border-radius: 999px; min-height: 44px; padding: 0 16px; }
  #stage { position: fixed; inset: 0; background: rgba(16,18,14,.94); display: none; align-items: center; justify-content: center; flex-direction: column; gap: 12px; padding: 20px; }
  #stage.open { display: flex; }
  #stage img { max-width: min(1100px, 100%); max-height: 78vh; width: auto; height: auto; object-fit: contain; aspect-ratio: auto; }
  .nav { display: flex; gap: 8px; }
</style>
</head>
<body>
<header>
  <div>
    <h1>YashaFiness</h1>
    <p>Hosted gallery</p>
  </div>
  <p id="count"></p>
</header>
<main id="grid"></main>
<div id="stage" role="dialog" aria-modal="true" aria-label="Image">
  <img id="full" alt="" />
  <div class="nav">
    <button type="button" id="prev">Previous</button>
    <button type="button" id="next">Next</button>
    <button type="button" id="close">Close</button>
  </div>
  <p id="cap"></p>
</div>
<script id="pack" type="application/json">${payload}</script>
<script>
  const pack = JSON.parse(document.getElementById("pack").textContent);
  const grid = document.getElementById("grid");
  const stage = document.getElementById("stage");
  const full = document.getElementById("full");
  const cap = document.getElementById("cap");
  document.getElementById("count").textContent = pack.slides.length + " images";
  let index = 0;
  function show(i) {
    index = (i + pack.slides.length) % pack.slides.length;
    const slide = pack.slides[index];
    full.src = slide.src;
    full.alt = slide.name;
    cap.textContent = slide.name;
    stage.classList.add("open");
  }
  pack.slides.forEach((slide, i) => {
    const fig = document.createElement("figure");
    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = slide.name;
    const caption = document.createElement("figcaption");
    caption.textContent = slide.name;
    fig.append(img, caption);
    fig.addEventListener("click", () => show(i));
    grid.append(fig);
  });
  document.getElementById("prev").onclick = () => show(index - 1);
  document.getElementById("next").onclick = () => show(index + 1);
  document.getElementById("close").onclick = () => stage.classList.remove("open");
  document.addEventListener("keydown", (event) => {
    if (!stage.classList.contains("open")) return;
    if (event.key === "Escape") stage.classList.remove("open");
    if (event.key === "ArrowRight") show(index + 1);
    if (event.key === "ArrowLeft") show(index - 1);
  });
</script>
</body>
</html>`;
}

let memorySlides: HostSlide[] | null = null;

export function rememberSlides(slides: HostSlide[]) {
  memorySlides = slides;
  try {
    sessionStorage.setItem("yashafiness-host", JSON.stringify(slides));
  } catch {
    /* oversized gallery stays in memory for this tab */
  }
}

export function recallSlides(): HostSlide[] | null {
  if (memorySlides && memorySlides.length > 0) return memorySlides;
  try {
    const raw = sessionStorage.getItem("yashafiness-host");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HostSlide[];
    if (!Array.isArray(parsed)) return null;
    memorySlides = parsed;
    return parsed;
  } catch {
    return null;
  }
}
