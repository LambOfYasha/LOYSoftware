import { useState } from "react";
import { Mail, MessageSquare, Clock, Send } from "lucide-react";

const info = [
  { icon: Mail, label: "Email", value: "hello@lambofyeshu.com" },
  { icon: MessageSquare, label: "Response Time", value: "Within 24 hours" },
  { icon: Clock, label: "Hours", value: "Mon – Fri, 9am – 6pm" },
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #060d12, #0a1a22, #050a0e)" }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute rounded-full blur-3xl" style={{ width: "40%", height: "80%", top: "-20%", right: "0", background: "radial-gradient(circle, #00c06a, transparent)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#00e676] text-sm font-semibold uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Let's <span className="text-[#00e676]">Talk</span>
          </h1>
          <p className="text-[#a0c4b8] text-lg max-w-xl mx-auto">
            Have a project in mind or just want to explore what's possible? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 px-4 sm:px-6" style={{ background: "#050a0e" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10">
          {/* Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Get in Touch</h2>
              <p className="text-[#6b9e8a] text-sm leading-relaxed">
                Whether you have a detailed spec or just a rough idea, reach out and we'll figure it out together.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,230,118,0.12)" }}>
                    <Icon size={16} className="text-[#00e676]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#4a7a62] uppercase tracking-wider">{label}</p>
                    <p className="text-[#a0c4b8] text-sm mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 p-8 rounded-2xl" style={{ background: "#0a1a14", border: "1px solid rgba(0,230,118,0.12)" }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[300px] text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(0,230,118,0.15)" }}>
                  <Send size={28} className="text-[#00e676]" />
                </div>
                <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Message Sent!</h3>
                <p className="text-[#6b9e8a] text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="text-[#00e676] text-sm underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#6b9e8a] uppercase tracking-wider">Name</label>
                    <input
                      name="name" value={form.name} onChange={handleChange} required
                      placeholder="Your name"
                      className="px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#4a7a62] outline-none focus:ring-1 focus:ring-[#00e676] transition-all"
                      style={{ background: "#0f2018", border: "1px solid rgba(0,230,118,0.15)" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#6b9e8a] uppercase tracking-wider">Email</label>
                    <input
                      name="email" value={form.email} onChange={handleChange} required type="email"
                      placeholder="your@email.com"
                      className="px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#4a7a62] outline-none focus:ring-1 focus:ring-[#00e676] transition-all"
                      style={{ background: "#0f2018", border: "1px solid rgba(0,230,118,0.15)" }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#6b9e8a] uppercase tracking-wider">Subject</label>
                  <select
                    name="subject" value={form.subject} onChange={handleChange} required
                    className="px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-[#00e676] transition-all"
                    style={{ background: "#0f2018", border: "1px solid rgba(0,230,118,0.15)" }}
                  >
                    <option value="">Select a topic…</option>
                    <option>New Project</option>
                    <option>Store / Products</option>
                    <option>Consulting</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#6b9e8a] uppercase tracking-wider">Message</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Tell us about your project…"
                    className="px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#4a7a62] outline-none focus:ring-1 focus:ring-[#00e676] resize-none transition-all"
                    style={{ background: "#0f2018", border: "1px solid rgba(0,230,118,0.15)" }}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-black transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
                  style={{ background: "linear-gradient(135deg, #00e676, #00b35c)", boxShadow: "0 0 20px rgba(0,230,118,0.3)" }}
                >
                  <Send size={15} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
