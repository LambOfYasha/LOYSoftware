import { Outlet } from "react-router";
import { ThemeProvider } from "next-themes";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { usePalette } from "./hooks/usePalette";

function Layout() {
  const p = usePalette();
  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{ background: p.pageBg, color: p.heading, fontFamily: "'Inter', sans-serif" }}
    >
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function Root() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange={false}>
      <Layout />
    </ThemeProvider>
  );
}
