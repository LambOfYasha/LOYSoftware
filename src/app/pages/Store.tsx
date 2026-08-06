import { useState } from "react";
import { useTheme } from "next-themes";
import { ShoppingCart, Package, Star, Loader2 } from "lucide-react";
import { usePalette } from "../hooks/usePalette";

async function startCheckout(productId: number, productName: string, price: number) {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, productName, price }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    throw new Error(data.error ?? "Checkout failed");
  }
}

const products = [
  { id: 1, name: "Starter Website Pack", price: 49, description: "A complete, production-ready website starter with Next.js, Tailwind CSS, dark mode, SEO setup, and Vercel deployment config.", features: ["Next.js 14 + App Router", "Tailwind CSS", "Dark / Light mode", "SEO meta tags", "Vercel-ready"], tag: "Template", popular: false },
  { id: 2, name: "SaaS Boilerplate", price: 149, description: "Everything you need to launch a SaaS: auth, billing with Stripe, user dashboard, role management, and email integration.", features: ["Next.js + TypeScript", "Stripe subscriptions", "NextAuth.js", "Prisma + PostgreSQL", "Email via Resend"], tag: "Boilerplate", popular: true },
  { id: 3, name: "E-Commerce Kit", price: 99, description: "Full e-commerce storefront with product listings, cart, Stripe Checkout, and a lightweight admin panel.", features: ["Next.js storefront", "Stripe Checkout", "Product & cart logic", "Admin dashboard", "Responsive UI"], tag: "Kit", popular: false },
  { id: 4, name: "UI Components Library", price: 29, description: "40+ hand-crafted React components with dark mode support, Tailwind styling, and full TypeScript types.", features: ["40+ components", "Dark mode built-in", "TypeScript", "Tailwind CSS", "Copy-paste ready"], tag: "Components", popular: false },
  { id: 5, name: "Custom Development", price: 500, description: "Let us build something custom for you. Reach out and we'll scope the project together and deliver exactly what you need.", features: ["Full-stack development", "Design included", "Dedicated support", "Source code delivered", "1-month post-launch support"], tag: "Service", popular: false, cta: "Contact Us" },
  { id: 6, name: "Landing Page Design", price: 79, description: "A high-converting, fully responsive landing page built with Next.js and Tailwind. Ready to deploy in days.", features: ["Responsive design", "Animation & motion", "Lead capture form", "SEO optimized", "Vercel deployment"], tag: "Template", popular: false },
];

export function Store() {
  const p = usePalette();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function handleBuy(product: typeof products[number]) {
    if (product.id === 5) {
      window.location.href = "/contact";
      return;
    }
    setLoadingId(product.id);
    try {
      await startCheckout(product.id, product.name, product.price);
    } catch (e) {
      console.error(e);
      setLoadingId(null);
    }
  }

  return (
    <div className="flex flex-col transition-colors duration-500">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden transition-colors duration-500" style={{ background: p.heroGrad }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute rounded-full blur-3xl" style={{ width: "50%", height: "80%", top: "-20%", left: "10%", background: "radial-gradient(circle, #00c06a, transparent)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 transition-colors duration-500" style={{ color: p.accent }}>Store</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
            Tools to <span style={{ color: p.accent }}>Ship Faster</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto transition-colors duration-500" style={{ color: p.body }}>
            Production-ready templates, boilerplates, and component packs — built with the stack you already use.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4 sm:px-6 transition-colors duration-500" style={{ background: p.pageBg }}>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-6 rounded-2xl flex flex-col gap-4 relative transition-all duration-500"
              style={{
                background: p.cardBg,
                border: `1px solid ${product.popular ? p.accent : p.accentBorder}`,
                boxShadow: product.popular ? `0 0 30px ${p.accent}20` : undefined,
              }}
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-black whitespace-nowrap" style={{ background: isDark ? "#00e676" : "#00994d" }}>
                  <Star size={10} fill="currentColor" /> Most Popular
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: p.accentDim }}>
                  <Package size={18} style={{ color: p.accent }} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: p.accentDim, color: p.accent }}>
                  {product.tag}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>{product.name}</h3>
                <p className="text-sm leading-relaxed mt-1 transition-colors duration-500" style={{ color: p.muted }}>{product.description}</p>
              </div>

              <ul className="flex flex-col gap-1.5 flex-1">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm transition-colors duration-500" style={{ color: p.body }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.accent }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: p.accentBorder }}>
                <div>
                  <span className="text-2xl font-bold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>${product.price}</span>
                  <span className="text-sm ml-1 transition-colors duration-500" style={{ color: p.faint }}>USD</span>
                </div>
                <button
                  onClick={() => handleBuy(product)}
                  disabled={loadingId === product.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                  style={
                    product.popular
                      ? { background: `linear-gradient(135deg, ${isDark ? "#00e676" : "#00994d"}, #00b35c)`, color: isDark ? "#050a0e" : "#ffffff", boxShadow: `0 0 16px ${p.accent}35` }
                      : { background: p.accentDim, color: p.accent, border: `1px solid ${p.accentBorder}` }
                  }
                >
                  {loadingId === product.id
                    ? <Loader2 size={14} className="animate-spin" />
                    : <ShoppingCart size={14} />
                  }
                  {loadingId === product.id ? "Redirecting…" : ((product as { cta?: string }).cta ?? "Buy Now")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
