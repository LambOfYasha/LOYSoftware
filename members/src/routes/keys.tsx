import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { SecretStatus } from "@/lib/secrets";
import { saveSecrets, secretStatus } from "@/lib/secrets.functions";

export const Route = createFileRoute("/keys")({ component: KeysPage });

function KeysPage() {
  const [fields, setFields] = useState<SecretStatus[] | null>(null);
  const [allowed, setAllowed] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void secretStatus().then((result) => {
      if (cancelled) return;
      setFields(result.fields);
      setAllowed(result.pasteAllowed);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(values: Record<string, string>) {
    setBusy(true);
    setNotice("");
    try {
      const result = await saveSecrets({ data: { values } });
      setFields(result.fields);
      setAllowed(result.pasteAllowed);
      setDrafts({});
      setNotice(
        result.restart
          ? "Saved on this machine. Restart the server so sign-in and the database pick up the new keys."
          : "Saved on this machine. The boxes stay empty so the keys are not shown again.",
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Those keys could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="members mx-auto flex min-h-dvh max-w-xl flex-col gap-6 px-4 py-8">
      <div>
        <Link to="/" className="text-sm text-brass">
          Back to membership
        </Link>
        <h1 className="mt-3 font-display text-4xl text-fg">Keys</h1>
        <p className="mt-2 text-sm text-muted">
          Paste a key only on this machine. It is stored in <code>.secrets.local.json</code>, which is not part of the
          app source. The page never shows a key again. A key already set by the host is left alone.
        </p>
      </div>
      {!loaded ? <p className="text-sm text-muted">Loading keys.</p> : null}
      {loaded && !allowed ? (
        <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-fg">
          This address is public. Pasting is turned off. Set the keys in the host's environment, then restart the
          process that reads them.
        </p>
      ) : null}
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const values: Record<string, string> = {};
          for (const [key, value] of Object.entries(drafts)) {
            if (value.trim()) values[key] = value;
          }
          void save(values);
        }}
      >
        {(fields ?? []).map((field) => (
          <label key={field.key} className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4">
            <span className="text-sm font-medium text-fg">{field.label}</span>
            <span className="text-sm text-muted">{field.purpose}</span>
            <span className="text-xs text-muted">
              {field.source === "host"
                ? "Set by the host. This box will not replace it."
                : field.source === "pasted"
                  ? `Saved on this machine${field.hint ? ` · ends in ${field.hint}` : ""}. Leave the box empty to keep it.`
                  : "Not set."}
              {field.when === "restart" ? " Takes effect after a restart." : " Used on the next request."}
            </span>
            <input
              type="password"
              name={field.key}
              autoComplete="new-password"
              spellCheck={false}
              disabled={!allowed || field.source === "host" || busy}
              value={drafts[field.key] ?? ""}
              onChange={(event) => setDrafts((current) => ({ ...current, [field.key]: event.target.value }))}
              className="mt-2 min-h-11 rounded-full border border-line bg-bg px-4 text-sm text-fg"
            />
            {field.source === "pasted" && allowed ? (
              <button
                type="button"
                className="mt-2 w-fit text-sm text-brass"
                disabled={busy}
                onClick={() => void save({ [field.key]: "" })}
              >
                Remove saved key
              </button>
            ) : null}
          </label>
        ))}
        <button
          type="submit"
          disabled={!allowed || busy}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-4 text-sm font-medium text-brass-ink disabled:opacity-60"
        >
          {busy ? "Saving" : "Save keys"}
        </button>
      </form>
      {notice ? <p className="text-sm text-fg">{notice}</p> : null}
    </main>
  );
}
