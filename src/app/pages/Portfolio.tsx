import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { usePalette } from "../hooks/usePalette";

const projects = [
  {
    title: "Light Is For Everyone", tag: "Platform", category: "web", year: "2025",
    desc: "A full-stack Christian community platform for biblical discussion, publishing, lessons, AI-assisted moderation, and member growth workflows.",
    tech: ["Next.js", "Sanity CMS", "Clerk", "OpenAI", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1769755411779-e4c43e7b7742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    imageAlt: "Young adults gathered in worship with hands raised",
    url: "https://lightisforeveryone.life",
  },
  {
    title: "AntiBlasphemy Ministries", tag: "Web App", category: "web", year: "2024",
    desc: "Modern web platform for a remote ministry featuring news articles, a headless CMS, and a community comment section.",
    tech: ["React", "Next.js", "Tailwind CSS", "W3CSS", "Sanity.io"],
    image: "https://images.unsplash.com/photo-1653133672754-82025e7e9074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBtaW5pc3RyeSUyMHdlYnNpdGUlMjBuZXdzfGVufDF8fHx8MTc4NTk2ODAyNXww&ixlib=rb-4.1.0&q=80&w=800",
    imageAlt: "Group of people with hands raised in worship",
    url: "https://abministries.net",
  },
  {
    title: "Anyaka Safaris", tag: "Web App", category: "web", year: "2024",
    desc: "Travel agency website with a modern design, blog section, and inquiry forms for booking African safari experiences.",
    tech: ["React", "Next.js", "Tailwind CSS", "Sanity.io", "Web3Forms"],
    image: "https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjB0cmF2ZWwlMjBhZnJpY2ElMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzg1OTY4MDI1fDA&ixlib=rb-4.1.0&q=80&w=800",
    imageAlt: "African landscape with green trees under blue sky",
    url: "https://anyekasafaris.com",
  },
  {
    title: "Discord Bot Promo Video", tag: "Video", category: "video", year: "2024",
    desc: "Promotional video showcase highlighting purchasable Discord bot features — built to drive conversions for a bot product launch.",
    tech: ["Video Production", "Motion Graphics", "Discord API"],
    image: "https://images.unsplash.com/photo-1683029096295-7680306aa37d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3JkJTIwYm90JTIwdmlkZW8lMjBnYW1pbmclMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzg1OTY4MDI2fDA&ixlib=rb-4.1.0&q=80&w=800",
    imageAlt: "Discord emoji button on blue background",
    url: undefined,
  },
];

const categories = ["All", "Web App", "Video"];

export function Portfolio() {
  const [active, setActive] = useState("All");
  const p = usePalette();
  const filtered = active === "All" ? projects : projects.filter((proj) => proj.tag === active);

  return (
    <div className="flex flex-col transition-colors duration-500">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden transition-colors duration-500" style={{ background: p.heroGrad }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute rounded-full blur-3xl" style={{ width: "50%", height: "80%", top: "-20%", right: "0%", background: "radial-gradient(circle, #00c06a, transparent)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 transition-colors duration-500" style={{ color: p.accent }}>Our Work</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
            Projects We're <span style={{ color: p.accent }}>Proud Of</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto transition-colors duration-500" style={{ color: p.body }}>
            A selection of web and mobile projects spanning e-commerce, SaaS, finance, and community platforms.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 px-4 sm:px-6 transition-colors duration-500" style={{ background: p.pageBg }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  active === cat
                    ? { background: p.accent, color: "#ffffff" }
                    : { background: p.cardBg, color: p.muted, border: `1px solid ${p.accentBorder}` }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(({ title, tag, year, desc, tech, image, imageAlt, url }) => (
              <div
                key={title}
                className="p-6 rounded-2xl flex flex-col gap-4 group transition-all duration-500"
                style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}
              >
                <div className="w-full h-40 rounded-xl relative overflow-hidden">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: p.accentDim, color: p.accent, backdropFilter: "blur(4px)" }}>
                    {year}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider transition-colors duration-500" style={{ color: p.accent }}>{tag}</span>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} className="transition-colors hover:opacity-80" style={{ color: p.accent }} />
                    </a>
                  ) : (
                    <ExternalLink size={14} style={{ color: p.faint, opacity: 0.4 }} />
                  )}
                </div>
                <h3 className="font-semibold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>{title}</h3>
                <p className="text-sm leading-relaxed flex-1 transition-colors duration-500" style={{ color: p.muted }}>{desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t" style={{ borderColor: `${p.accent}15` }}>
                  {tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full transition-colors duration-500" style={{ background: p.accentDim, color: p.faint }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
