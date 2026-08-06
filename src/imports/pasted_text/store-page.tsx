import { ShoppingCart, Package, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Starter Website Pack",
    price: 49,
    description: "A complete, production-ready website starter with Next.js, Tailwind CSS, dark mode, SEO setup, and Vercel deployment config.",
    features: ["Next.js 14 + App Router", "Tailwind CSS", "Dark / Light mode", "SEO meta tags", "Vercel-ready"],
    tag: "Template",
    popular: false,
  },
  {
    id: 2,
    name: "SaaS Boilerplate",
    price: 149,
    description: "Everything you need to launch a SaaS: auth, billing with Stripe, user dashboard, role management, and email integration.",
    features: ["Next.js + TypeScript", "Stripe subscriptions", "NextAuth.js", "Prisma + PostgreSQL", "Email via Resend"],
    tag: "Boilerplate",
    popular: true,
  },
  {
    id: 3,
    name: "E-Commerce Kit",
    price: 99,
    description: "Full e-commerce storefront with product listings, cart, Stripe Checkout, and a lightweight admin panel.",
    features: ["Next.js storefront", "Stripe Checkout", "Product & cart logic", "Admin dashboard", "Responsive UI"],
    tag: "Kit",
    popular: false,
  },
  {
    id: 4,
    name: "UI Components Library",
    price: 29,
    description: "40+ hand-crafted React components with dark mode support, Tailwind styling, and full TypeScript types.",
    features: ["40+ components", "Dark mode built-in", "TypeScript", "Tailwind CSS", "Copy-paste ready"],
    tag: "Components",
    popular: false,
  },
  {
    id: 5,
    name: "Custom Development",
    price: 500,
    description: "Let us build something custom for you. Reach out and we'll scope the project together and deliver exactly what you need.",
    features: ["Full-stack development", "Design included", "Dedicated support", "Source code delivered", "1-month post-launch support"],
    tag: "Service",
    popular: false,
    cta: "Contact Us",
  },
  {
    id: 6,
    name: "Landing Page Design",
    price: 79,
    description: "A high-converting, fully responsive landing page built with Next.js and Tailwind. Ready to deploy in days.",
    features: ["Responsive design", "Animation & motion", "Lead capture form", "SEO optimized", "Vercel deployment"],
    tag: "Template",
    popular: false,
  },
];

export function Store() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #060d12, #0a1a22, #050a0e)" }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute rounded-full blur-3xl" style={{ width: "50%", height: "80%", top: "-20%", left: "10%", background: "radial-gradient(circle, #00c06a, transparent)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#00e676] text-sm font-semibold uppercase tracking-widest mb-3">Store</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tools to <span className="text-[#00e676]">Ship Faster</span>
          </h1>
          <p className="text-[#a0c4b8] text-lg max-w-xl mx-auto">
            Production-ready templates, boilerplates, and component packs — built with the stack you already use.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4 sm:px-6" style={{ background: "#050a0e" }}>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-6 rounded-2xl flex flex-col gap-4 relative"
              style={{
                background: "#0a1a14",
                border: `1px solid ${product.popular ? "#00e676" : "rgba(0,230,118,0.1)"}`,
                boxShadow: product.popular ? "0 0 30px rgba(0,230,118,0.15)" : undefined,
              }}
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-black" style={{ background: "#00e676" }}>
                  <Star size={10} fill="currentColor" /> Most Popular
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,230,118,0.12)" }}>
                  <Package size={18} className="text-[#00e676]" />
                </div>
                <span className="text-xs font-semibold text-[#00e676] uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "rgba(0,230,118,0.1)" }}>
                  {product.tag}
                </span>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{product.name}</h3>
                <p className="text-[#6b9e8a] text-sm leading-relaxed mt-1">{product.description}</p>
              </div>

              <ul className="flex flex-col gap-1.5 flex-1">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#a0c4b8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(0,230,118,0.1)" }}>
                <div>
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>${product.price}</span>
                  <span className="text-[#4a7a62] text-sm ml-1">USD</span>
                </div>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:brightness-110 hover:scale-105 active:scale-95"
                  style={
                    product.popular
                      ? { background: "linear-gradient(135deg, #00e676, #00b35c)", color: "#050a0e", boxShadow: "0 0 16px rgba(0,230,118,0.35)" }
                      : { background: "rgba(0,230,118,0.12)", color: "#00e676", border: "1px solid rgba(0,230,118,0.25)" }
                  }
                >
                  <ShoppingCart size={14} />
                  {product.cta ?? "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
