import { Link } from "react-router";
import { useTheme } from "next-themes";
import { CheckCircle, ArrowRight, Download } from "lucide-react";
import { usePalette } from "../hooks/usePalette";

export function Success() {
  const p = usePalette();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 transition-colors duration-500" style={{ background: p.pageBg }}>
      <div className="max-w-lg w-full text-center flex flex-col items-center gap-8">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ background: `radial-gradient(circle, ${p.accent}, transparent)` }} />
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: p.accentDim, border: `2px solid ${p.accentBorderStrong}` }}>
            <CheckCircle size={44} style={{ color: p.accent }} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
            Purchase Successful!
          </h1>
          <p className="text-lg leading-relaxed transition-colors duration-500" style={{ color: p.body }}>
            Thank you for your order. A confirmation has been sent to your email with your download link and receipt.
          </p>
        </div>

        {/* Card */}
        <div className="w-full p-6 rounded-2xl flex flex-col gap-4 text-left transition-all duration-500" style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}>
          <p className="font-semibold transition-colors duration-500" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>What's next?</p>
          <ul className="flex flex-col gap-3 text-sm">
            {[
              "Check your email for the download link and receipt.",
              "Extract the ZIP file and read the included README.md.",
              "Run npm install to get started with your new product.",
              "Reach out to us if you have any questions — we're here to help.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 transition-colors duration-500" style={{ color: p.body }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black shrink-0 mt-0.5" style={{ background: isDark ? "#00e676" : "#00994d" }}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-black text-sm transition-all hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${isDark ? "#00e676" : "#00994d"}, #00b35c)`, boxShadow: `0 0 16px ${p.accent}30` }}
          >
            <Download size={14} /> Download Files
          </button>
          <Link
            to="/store"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
            style={{ color: p.accent, border: `1px solid ${p.accentBorderStrong}` }}
          >
            Back to Store <ArrowRight size={14} />
          </Link>
        </div>

        <Link to="/" className="text-sm hover:underline transition-colors" style={{ color: p.faint }}>
          ← Return to homepage
        </Link>
      </div>
    </div>
  );
}
