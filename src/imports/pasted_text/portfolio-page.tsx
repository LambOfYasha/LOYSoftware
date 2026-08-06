import { useState } from "react";
import { ExternalLink, Code2 } from "lucide-react";

const projects = [
  { title: "E-Commerce Platform", tag: "Web App", category: "web", year: "2024", desc: "Full-featured online store with Stripe payments, inventory management, real-time analytics, and a custom CMS for the client team.", tech: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"] },
  { title: "SaaS Analytics Dashboard", tag: "Web App", category: "web", year: "2024", desc: "Real-time analytics platform serving 10k+ daily active users with live data streaming, role-based access, and exportable reports.", tech: ["React", "Node.js", "WebSocket", "Recharts"] },
  { title: "Mobile Banking App", tag: "Mobile", category: "mobile", year: "2023", desc: "Secure cross-platform mobile banking experience with biometric authentication, push notifications, and transaction history.", tech: ["React Native", "TypeScript", "AWS", "Plaid"] },
  { title: "Church Management System", tag: "Web App", category: "web", year: "2023", desc: "All-in-one platform for member management, event scheduling, tithing, and sermon media — built for a 500-person congregation.", tech: ["Next.js", "Prisma", "PostgreSQL", "Vercel"] },
  { title: "Freelancer Marketplace", tag: "Platform", category: "web", year: "2023", desc: "Two-sided marketplace connecting freelancers and clients, with escrow payments, dispute resolution, and rating systems.", tech: ["React", "Node.js", "Stripe Connect", "Redis"] },
  { title: "Inventory Mobile App", tag: "Mobile", category: "mobile", year: "2022", desc: "Barcode-scanning inventory management app for small retail businesses. Syncs in real time with a web dashboard.", tech: ["React Native", "Expo", "Firebase", "TypeScript"] },
];

const categories = ["All", "Web App", "Mobile", "Platform"];

export function Portfolio() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.tag === active);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #060d12, #0a1a22, #050a0e)" }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute rounded-full blur-3xl" style={{ width: "50%", height: "80%", top: "-20%", right: "0%", background: "radial-gradient(circle, #00c06a, transparent)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#00e676] text-sm font-semibold uppercase tracking-widest mb-3">Our Work</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Projects We're <span className="text-[#00e676]">Proud Of</span>
          </h1>
          <p className="text-[#a0c4b8] text-lg max-w-xl mx-auto">
            A selection of web and mobile projects spanning e-commerce, SaaS, finance, and community platforms.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 px-4 sm:px-6" style={{ background: "#050a0e" }}>
        <div className="max-w-6xl mx-auto">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  active === cat
                    ? { background: "#00e676", color: "#050a0e" }
                    : { background: "#0a1a14", color: "#6b9e8a", border: "1px solid rgba(0,230,118,0.15)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(({ title, tag, year, desc, tech }) => (
              <div
                key={title}
                className="p-6 rounded-2xl flex flex-col gap-4 group hover:border-[#00e67640] transition-all"
                style={{ background: "#0a1a14", border: "1px solid rgba(0,230,118,0.1)" }}
              >
                {/* Placeholder image */}
                <div
                  className="w-full h-40 rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #0d2a1a, #0a1a10)" }}
                >
                  <Code2 size={36} className="text-[#00e67640]" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#00e676]" style={{ background: "rgba(0,230,118,0.12)" }}>
                    {year}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#00e676] uppercase tracking-wider">{tag}</span>
                  <ExternalLink size={14} className="text-[#4a7a62] group-hover:text-[#00e676] transition-colors cursor-pointer" />
                </div>
                <h3 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
                <p className="text-[#6b9e8a] text-sm leading-relaxed flex-1">{desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t" style={{ borderColor: "rgba(0,230,118,0.08)" }}>
                  {tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full text-[#4a7a62]" style={{ background: "rgba(0,230,118,0.06)" }}>{t}</span>
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
