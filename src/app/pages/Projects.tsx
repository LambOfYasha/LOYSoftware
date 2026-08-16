import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ExternalLink,
  Gamepad2,
  Layers3,
  Sparkles,
  Users,
} from "lucide-react";
import { usePalette } from "../hooks/usePalette";

const projects = [
  {
    title: "Human-Led AI Project Mastery",
    short: "HLAPM",
    family: "Learn",
    category: "AI Education · Open Source",
    status: "Public foundation · Active",
    description:
      "A public learning framework for using AI to increase what people can accomplish without requiring human understanding to decrease.",
    Icon: Brain,
    kind: "internal" as const,
    href: "/hlapm",
    action: "Explore HLAPM",
  },
  {
    title: "Mustard Seed Studio",
    short: "MSS",
    family: "Create",
    category: "Creative Studio · Education · Entertainment",
    status: "In development",
    description:
      "Faith-centered creative production spanning storytelling, animation, music, interactive media, and educational entertainment.",
    Icon: Sparkles,
    kind: "planned" as const,
    href: "#",
    action: "Project page planned",
  },
  {
    title: "AntiBlasphemy Ministries",
    short: "ABM",
    family: "Minister",
    category: "Bible Study · Ministry · Discipleship",
    status: "Active",
    description:
      "Scripture-centered ministry work focused on Bible study, teaching, discipleship, and public biblical education.",
    Icon: BookOpen,
    kind: "external" as const,
    href: "https://abministries.net",
    action: "Visit ministry",
  },
  {
    title: "Light Is For Everyone",
    short: "LIFE",
    family: "Minister",
    category: "Christian Community · Platform",
    status: "Active",
    description:
      "A Christian community platform connecting biblical discussion, publishing, lessons, and community participation.",
    Icon: Users,
    kind: "external" as const,
    href: "https://lightisforeveryone.life",
    action: "Visit platform",
  },
  {
    title: "Biblically Guided Live Content",
    short: "Live",
    family: "Connect",
    category: "Gaming · Live Media · Ministry",
    status: "Active · Evolving",
    description:
      "Live gaming and community content structured around biblically guided discussion, Bible-study breaks, and ministry interaction.",
    Icon: Gamepad2,
    kind: "planned" as const,
    href: "#",
    action: "Project page planned",
  },
];

export function Projects() {
  const p = usePalette();

  return (
    <div className="flex flex-col transition-colors duration-500">
      <section
        className="relative py-20 sm:py-24 px-4 sm:px-6 overflow-hidden"
        style={{ background: p.heroGrad }}
      >
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute rounded-full blur-3xl"
            style={{
              width: "55%",
              height: "90%",
              top: "-30%",
              right: "-5%",
              background: "radial-gradient(circle, #00c06a, transparent)",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-5"
            style={{
              background: p.accentDim,
              color: p.accent,
              border: `1px solid ${p.accentBorderStrong}`,
            }}
          >
            <Layers3 size={14} />
            LOY ecosystem
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight max-w-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}
          >
            Projects & Initiatives
          </h1>

          <p className="mt-5 text-lg max-w-3xl leading-relaxed" style={{ color: p.body }}>
            Explore the ministries, educational systems, creative work, software-supported initiatives,
            and live-content projects developed or supported through the Lamb of Yeshu ecosystem.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed" style={{ color: p.muted }}>
            This page explains what each initiative is for and where it belongs. The Portfolio remains the
            technical showcase for delivered LOY Software work.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6" style={{ background: p.pageBg }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map(({ title, short, family, category, status, description, Icon, kind, href, action }) => (
              <article
                key={title}
                className="rounded-3xl p-6 flex flex-col min-h-[320px] transition-all"
                style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: p.accentDim, color: p.accent }}
                  >
                    <Icon size={21} />
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-wider font-semibold rounded-full px-2.5 py-1"
                    style={{ color: p.accent, border: `1px solid ${p.accentBorderStrong}` }}
                  >
                    {family}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: p.accent }}>
                    {short} · {category}
                  </div>
                  <h2
                    className="mt-2 text-xl font-bold"
                    style={{ color: p.heading, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: p.body }}>
                    {description}
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <div className="text-xs mb-4" style={{ color: p.muted }}>
                    {status}
                  </div>

                  {kind === "internal" && (
                    <Link
                      to={href}
                      className="inline-flex items-center gap-2 text-sm font-semibold"
                      style={{ color: p.accent }}
                    >
                      {action} <ArrowRight size={15} />
                    </Link>
                  )}

                  {kind === "external" && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold"
                      style={{ color: p.accent }}
                    >
                      {action} <ExternalLink size={15} />
                    </a>
                  )}

                  {kind === "planned" && (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: p.faint }}>
                      {action}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6" style={{ background: p.sectionAlt }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl p-6" style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: p.accent }}>
              Projects
            </div>
            <h2 className="mt-2 text-2xl font-bold" style={{ color: p.heading }}>
              What are we building, and why?
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: p.body }}>
              The Projects hub connects visitors to the purpose, audience, status, and public destination of
              initiatives across education, ministry, creative production, and live content.
            </p>
          </div>

          <div className="rounded-3xl p-6" style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: p.accent }}>
              Portfolio
            </div>
            <h2 className="mt-2 text-2xl font-bold" style={{ color: p.heading }}>
              What has LOY Software built?
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: p.body }}>
              The Portfolio remains the implementation showcase: delivered web applications, platforms,
              media work, technologies, and external client or project outcomes.
            </p>
            <Link
              to="/portfolio"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: p.accent }}
            >
              View Portfolio <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
