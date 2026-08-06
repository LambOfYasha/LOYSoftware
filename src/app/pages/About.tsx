import { Link } from "react-router";
import { useTheme } from "next-themes";
import { ArrowRight, Heart, Lightbulb, Shield, Zap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePalette } from "../hooks/usePalette";
import mascotImg from "../../imports/jrpuh.jpg";

const values = [
  { icon: Heart, title: "Faith-Driven", desc: "We operate with integrity and purpose, guided by the values of honesty, service, and excellence." },
  { icon: Lightbulb, title: "Innovation First", desc: "We stay ahead of the curve, adopting the best modern tools and techniques for every project." },
  { icon: Shield, title: "Quality & Trust", desc: "Every line of code is written with care. We stand behind our work with ongoing support." },
  { icon: Zap, title: "Speed & Precision", desc: "We deliver fast without cutting corners — efficient processes from day one to launch." },
];

const stack = ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "Stripe", "PostgreSQL", "AWS", "Vercel", "Figma"];

export function About() {
  const p = usePalette();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col transition-colors duration-500">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden transition-colors duration-500" style={{ background: p.heroGrad }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute rounded-full blur-3xl" style={{ width: "40%", height: "80%", top: "-20%", left: "0%", background: "radial-gradient(circle, #00c06a, transparent)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 transition-colors duration-500" style={{ color: p.accent }}>About Us</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
            Building Software with{" "}
            <span style={{ color: p.accent }}>Purpose</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto transition-colors duration-500" style={{ color: p.body }}>
            Lamb of Yeshu Software is a boutique software development studio dedicated to helping businesses and entrepreneurs bring their digital vision to life.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 transition-colors duration-500" style={{ background: p.sectionAlt }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-25" style={{ background: `radial-gradient(circle, ${p.accent}, transparent)` }} />
              <div
                className="relative rounded-3xl overflow-hidden border-2 transition-all duration-500"
                style={{ width: 280, height: 320, borderColor: `${p.accent}60`, boxShadow: `0 0 40px ${p.accent}20` }}
              >
                <ImageWithFallback
                  src={mascotImg}
                  alt="Lamb of Yeshu mascot"
                  className="w-full h-full object-cover object-top"
                  style={{ filter: isDark ? "hue-rotate(-120deg) saturate(1.2)" : "hue-rotate(-120deg) saturate(1.1) brightness(0.95)" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>Our Story</h2>
            {[
              "Founded with the belief that great software should be accessible to everyone, Lamb of Yeshu Software started as a one-person studio and has grown into a trusted development partner for startups and small businesses across the globe.",
              "Our name reflects our core identity — a commitment to humble service, innovative thinking, and delivering work that genuinely matters to the people we serve.",
              "From building sleek landing pages to full-stack SaaS products with payments and dashboards, we bring the same level of craft and care to every project, big or small.",
            ].map((text, i) => (
              <p key={i} className="leading-relaxed transition-colors duration-500" style={{ color: p.body }}>{text}</p>
            ))}
            <Link
              to="/contact"
              className="flex items-center gap-2 w-fit px-5 py-2.5 rounded-full font-semibold text-black text-sm mt-2 transition-all hover:brightness-110"
              style={{ background: `linear-gradient(135deg, ${isDark ? "#00e676" : "#00994d"}, #00b35c)`, boxShadow: `0 0 16px ${p.accent}30` }}
            >
              Work With Us <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 transition-colors duration-500" style={{ background: p.pageBg }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 transition-colors duration-500" style={{ color: p.accent }}>What We Stand For</p>
            <h2 className="text-3xl font-bold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl flex flex-col gap-4 transition-all duration-500" style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: p.accentDim }}>
                  <Icon size={20} style={{ color: p.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>{title}</h3>
                  <p className="text-sm leading-relaxed transition-colors duration-500" style={{ color: p.muted }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 sm:px-6 transition-colors duration-500" style={{ background: p.sectionAlt }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2 transition-colors duration-500" style={{ color: p.accent }}>Technology</p>
          <h2 className="text-3xl font-bold mb-10 transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>Our Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-500"
                style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}`, color: p.body }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
