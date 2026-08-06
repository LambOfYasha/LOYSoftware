import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { usePalette } from "../hooks/usePalette";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/store", label: "Store" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const p = usePalette();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-500"
      style={{
        background: isDark ? "rgba(5,10,14,0.85)" : "rgba(240,244,248,0.85)",
        borderBottom: `1px solid ${p.accentBorder}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}>
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-black" style={{ background: p.accent }}>L</span>
          <span>Lamb of Yeshu</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={({ isActive }) => ({
                color: isActive ? p.accent : p.muted,
                background: isActive ? p.accentDim : "transparent",
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="rounded-full p-2 transition-all hover:scale-110 active:scale-95"
            style={{
              background: p.accentDim,
              color: p.accent,
              border: `1px solid ${p.accentBorder}`,
            }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* CTA */}
          <Link
            to="/store"
            className="hidden sm:flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-black transition-all hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${isDark ? "#00e676" : "#00994d"}, #00b35c)` }}
          >
            Get Started
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full transition-all"
            style={{ color: p.muted }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-1 transition-all"
          style={{ background: isDark ? "#050a0e" : "#f0f4f8" }}
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={({ isActive }) => ({
                color: isActive ? p.accent : p.muted,
                background: isActive ? p.accentDim : "transparent",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
