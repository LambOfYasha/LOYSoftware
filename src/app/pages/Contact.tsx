import { useState } from "react";
import { useTheme } from "next-themes";
import { Mail, MessageSquare, Clock, Send, Loader2, AlertCircle } from "lucide-react";
import { usePalette } from "../hooks/usePalette";

const info = [
  { icon: Mail, label: "Email", value: "hello@lambofyeshu.com" },
  { icon: MessageSquare, label: "Response Time", value: "Within 24 hours" },
  { icon: Clock, label: "Hours", value: "Mon – Fri, 9am – 6pm" },
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const p = usePalette();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col transition-colors duration-500">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden transition-colors duration-500" style={{ background: p.heroGrad }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute rounded-full blur-3xl" style={{ width: "40%", height: "80%", top: "-20%", right: "0", background: "radial-gradient(circle, #00c06a, transparent)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 transition-colors duration-500" style={{ color: p.accent }}>Contact</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
            Let's <span style={{ color: p.accent }}>Talk</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto transition-colors duration-500" style={{ color: p.body }}>
            Have a project in mind or just want to explore what's possible? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 px-4 sm:px-6 transition-colors duration-500" style={{ background: p.pageBg }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10">
          {/* Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold mb-2 transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>Get in Touch</h2>
              <p className="text-sm leading-relaxed transition-colors duration-500" style={{ color: p.muted }}>
                Whether you have a detailed spec or just a rough idea, reach out and we'll figure it out together.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.accentDim }}>
                    <Icon size={16} style={{ color: p.accent }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider transition-colors duration-500" style={{ color: p.faint }}>{label}</p>
                    <p className="text-sm mt-0.5 transition-colors duration-500" style={{ color: p.body }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 p-8 rounded-2xl transition-all duration-500" style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[300px] text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: p.accentDim }}>
                  <Send size={28} style={{ color: p.accent }} />
                </div>
                <h3 className="font-bold text-xl transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>Message Sent!</h3>
                <p className="text-sm transition-colors duration-500" style={{ color: p.muted }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setError(null); setForm({ name: "", email: "", subject: "", message: "" }); }} className="text-sm underline transition-colors" style={{ color: p.accent }}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "name", label: "Name", type: "text", placeholder: "Your name" },
                    { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <label className="text-xs uppercase tracking-wider transition-colors duration-500" style={{ color: p.muted }}>{label}</label>
                      <input
                        name={name}
                        value={form[name as keyof typeof form]}
                        onChange={handleChange}
                        required
                        type={type}
                        placeholder={placeholder}
                        className="px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ background: p.inputBg, border: `1px solid ${p.accentBorder}`, color: p.heading }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider transition-colors duration-500" style={{ color: p.muted }}>Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: p.inputBg, border: `1px solid ${p.accentBorder}`, color: p.heading }}
                  >
                    <option value="">Select a topic…</option>
                    <option>New Project</option>
                    <option>Store / Products</option>
                    <option>Consulting</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider transition-colors duration-500" style={{ color: p.muted }}>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your project…"
                    className="px-4 py-2.5 rounded-xl text-sm outline-none resize-none transition-all"
                    style={{ background: p.inputBg, border: `1px solid ${p.accentBorder}`, color: p.heading }}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: "#fff1f1", color: "#c0392b", border: "1px solid #fcc" }}>
                    <AlertCircle size={15} className="shrink-0" />
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-black transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: `linear-gradient(135deg, ${isDark ? "#00e676" : "#00994d"}, #00b35c)`, boxShadow: `0 0 20px ${p.accent}30` }}
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
