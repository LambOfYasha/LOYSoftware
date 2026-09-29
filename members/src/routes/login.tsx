import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { MEMBERS_HOST } from "@/lib/loy/catalog";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="members grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
        <p className="text-sm font-medium text-brass">Lamb of Yeshu</p>
        <h1 className="mt-1 font-display text-3xl text-fg">Member sign-in</h1>
        <p className="mt-2 text-sm text-muted">Use the account that will hold your {MEMBERS_HOST} library.</p>
        <div className="mt-5 flex flex-col gap-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-raised px-4 text-sm font-medium text-fg"
              >
                Continue with {provider.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is not turned on yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
