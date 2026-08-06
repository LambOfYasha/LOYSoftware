import { Link } from "react-router";
import { usePalette } from "../hooks/usePalette";

export function Footer() {
  const p = usePalette();
  return (
    <footer
      className="w-full py-10 px-4 sm:px-6 mt-auto transition-colors duration-500"
      style={{ background: p.sectionAlt, borderTop: `1px solid ${p.accentBorder}` }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-black" style={{ background: p.accent }}>L</span>
          Lamb of Yeshu Software
        </div>
        <nav className="flex flex-wrap gap-4 text-xs" style={{ color: p.faint }}>
          {["/", "/about", "/portfolio", "/store", "/contact"].map((to) => (
            <Link key={to} to={to} className="hover:underline transition-colors" style={{ color: p.muted }}>
              {to === "/" ? "Home" : to.slice(1).charAt(0).toUpperCase() + to.slice(2)}
            </Link>
          ))}
        </nav>
        <p className="text-xs" style={{ color: p.faint }}>
          © {new Date().getFullYear()} Lamb of Yeshu Software
        </p>
      </div>
    </footer>
  );
}
