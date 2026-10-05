import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div>
        <h1 className="font-display text-3xl">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">This address is not part of the member portal.</p>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center text-sm text-brass">
          Back home
        </Link>
      </div>
    </main>
  );
}
