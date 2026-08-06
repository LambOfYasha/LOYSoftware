import { Link } from "react-router";
import { useTheme } from "next-themes";
import { ArrowRight, Code2, Smartphone, BarChart3, Shield, Zap, Users } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePalette } from "../hooks/usePalette";
import mascotImg from "../../imports/jrpuh.jpg";

const services = [
  { icon: Code2, title: "Web Development", desc: "Full-stack web applications built with modern frameworks. Fast, scalable, and maintainable." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Cross-platform mobile solutions for iOS and Android that deliver exceptional user experiences." },
  { icon: BarChart3, title: "Tech Consulting", desc: "Strategic technology guidance to help your business make the right architectural decisions." },
  { icon: Shield, title: "Security Audits", desc: "Comprehensive code and infrastructure reviews to keep your product safe from vulnerabilities." },
  { icon: Zap, title: "Performance Optimization", desc: "Diagnose and eliminate bottlenecks so your application runs at peak efficiency." },
  { icon: Users, title: "Team Augmentation", desc: "Embed experienced engineers directly into your team to accelerate delivery." },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "99%", label: "Client Satisfaction" },
];

const portfolioPreview = [
  { title: "E-Commerce Platform", tag: "Web App", desc: "A full-featured online store with Stripe payments, inventory management, and analytics." },
  { title: "SaaS Dashboard", tag: "Web App", desc: "Real-time analytics dashboard serving 10k+ daily active users with live data streaming." },
  { title: "Mobile Banking App", tag: "Mobile", desc: "Secure cross-platform mobile banking experience with biometric authentication." },
];

function CircuitBg({ accent }: { accent: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="xMidYMid slice">
      {[[5,15],[18,25],[35,10],[50,30],[65,15],[80,25],[92,10],[10,55],[28,75],[45,60],[60,80],[78,60],[88,75],[15,90],[40,85],[70,90],[95,50]].map(([cx,cy],i) => (
        <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r="3" fill={accent} opacity="0.5" />
      ))}
      <line x1="5%" y1="15%" x2="18%" y2="25%" stroke={accent} strokeWidth="0.5" />
      <line x1="18%" y1="25%" x2="35%" y2="10%" stroke={accent} strokeWidth="0.5" />
      <line x1="35%" y1="10%" x2="50%" y2="30%" stroke={accent} strokeWidth="0.5" />
      <line x1="50%" y1="30%" x2="65%" y2="15%" stroke={accent} strokeWidth="0.5" />
      <line x1="65%" y1="15%" x2="80%" y2="25%" stroke={accent} strokeWidth="0.5" />
      <line x1="80%" y1="25%" x2="92%" y2="10%" stroke={accent} strokeWidth="0.5" />
      <line x1="10%" y1="55%" x2="28%" y2="75%" stroke={accent} strokeWidth="0.5" />
      <line x1="28%" y1="75%" x2="45%" y2="60%" stroke={accent} strokeWidth="0.5" />
      <line x1="45%" y1="60%" x2="60%" y2="80%" stroke={accent} strokeWidth="0.5" />
      <line x1="60%" y1="80%" x2="78%" y2="60%" stroke={accent} strokeWidth="0.5" />
    </svg>
  );
}

export function Home() {
  const p = usePalette();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col transition-colors duration-500">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 transition-colors duration-500" style={{ background: p.heroGrad }} />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute rounded-full blur-3xl" style={{ width: "60%", height: "80%", top: "-20%", left: "-10%", opacity: isDark ? 0.25 : 0.3, background: "radial-gradient(circle, #00c06a, transparent 70%)" }} />
          <div className="absolute rounded-full blur-3xl" style={{ width: "40%", height: "60%", top: "20%", right: "0%", opacity: isDark ? 0.1 : 0.15, background: "radial-gradient(circle, #0d9488, transparent 70%)" }} />
        </div>
        <CircuitBg accent={p.accent} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit transition-colors duration-500" style={{ color: p.accent, background: p.accentDim, border: `1px solid ${p.accentBorder}` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.accent }} />
              Available for new projects
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
              Innovative{" "}
              <span style={{ color: p.accent }}>Technology</span>
              <br />Trusted Solutions
            </h1>
            <p className="text-lg leading-relaxed max-w-lg transition-colors duration-500" style={{ color: p.body }}>
              Empowering businesses through cutting-edge software development and consulting. We build fast, scalable, and beautiful products.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/store"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-black transition-all hover:brightness-110 hover:scale-105 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${isDark ? "#00e676" : "#00994d"}, #00b35c)`, boxShadow: `0 0 24px ${p.accent}40` }}
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                to="/portfolio"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                style={{ color: p.accent, border: `1px solid ${p.accentBorderStrong}` }}
              >
                View Our Work
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold transition-colors duration-500" style={{ color: p.accent, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
                  <p className="text-xs mt-0.5 transition-colors duration-500" style={{ color: p.muted }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mascot */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${p.accent}, transparent 70%)` }} />
              <div
                className="relative rounded-full overflow-hidden border-2 transition-all duration-500"
                style={{ width: 280, height: 280, borderColor: p.accent, boxShadow: `0 0 40px ${p.accent}35` }}
              >
                <ImageWithFallback
                  src={mascotImg}
                  alt="Lamb of Yeshu mascot"
                  className="w-full h-full object-cover object-top"
                  style={{ filter: isDark ? "hue-rotate(-120deg) saturate(1.2)" : "hue-rotate(-120deg) saturate(1.1) brightness(0.95)" }}
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black whitespace-nowrap" style={{ background: isDark ? "#00e676" : "#00994d" }}>
                Lamb of Yeshu Software
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 transition-colors duration-500" style={{ background: p.sectionAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 transition-colors duration-500" style={{ color: p.accent }}>What We Do</p>
            <h2 className="text-3xl sm:text-4xl font-bold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>Services Built to Scale</h2>
            <p className="mt-3 max-w-xl mx-auto transition-colors duration-500" style={{ color: p.muted }}>From concept to deployment, we handle every phase of your software project with precision and care.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl flex flex-col gap-4 transition-all duration-500"
                style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}
              >
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

      {/* Portfolio Preview */}
      <section className="py-20 px-4 sm:px-6 transition-colors duration-500" style={{ background: p.pageBg }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-2 transition-colors duration-500" style={{ color: p.accent }}>Our Work</p>
              <h2 className="text-3xl sm:text-4xl font-bold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>Recent Projects</h2>
            </div>
            <Link to="/portfolio" className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all" style={{ color: p.accent }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolioPreview.map(({ title, tag, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl flex flex-col gap-3 cursor-pointer transition-all duration-500"
                style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}
              >
                <div
                  className="w-full h-36 rounded-xl flex items-center justify-center transition-colors duration-500"
                  style={{ background: isDark ? "linear-gradient(135deg, #0d2a1a, #0a1a10)" : "linear-gradient(135deg, #c8e6d4, #d4ede0)" }}
                >
                  <Code2 size={32} style={{ color: `${p.accent}50` }} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider transition-colors duration-500" style={{ color: p.accent }}>{tag}</span>
                <h3 className="font-semibold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>{title}</h3>
                <p className="text-sm leading-relaxed transition-colors duration-500" style={{ color: p.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden transition-colors duration-500" style={{ background: p.sectionAlt }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute rounded-full blur-3xl" style={{ width: "50%", height: "200%", top: "-50%", left: "25%", background: `radial-gradient(circle, ${p.accent}, transparent 70%)` }} />
        </div>
        <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <p className="text-sm font-semibold uppercase tracking-widest transition-colors duration-500" style={{ color: p.accent }}>Ready to Build?</p>
          <h2 className="text-3xl sm:text-4xl font-bold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
            Let's Turn Your Idea Into Reality
          </h2>
          <p className="leading-relaxed transition-colors duration-500" style={{ color: p.body }}>
            Whether you need a full product build, a single feature, or expert advice — we're here to help.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-black hover:brightness-110 hover:scale-105 transition-all"
              style={{ background: `linear-gradient(135deg, ${isDark ? "#00e676" : "#00994d"}, #00b35c)`, boxShadow: `0 0 24px ${p.accent}35` }}
            >
              Start a Project <ArrowRight size={16} />
            </Link>
            <Link
              to="/store"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
              style={{ color: p.accent, border: `1px solid ${p.accentBorderStrong}` }}
            >
              Browse the Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
