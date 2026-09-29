import { useState } from "react";
import { X } from "lucide-react";
import type { AiSuggestion } from "@/lib/yasha/ai.functions";
import { suggestOrganization } from "@/lib/yasha/ai.functions";
import { writeCopies } from "@/lib/yasha/disk";
import type { Entry, MatchField, MatchOp, Rule } from "@/lib/yasha/engine";
import { duplicateGroups } from "@/lib/yasha/engine";

const fieldClass =
  "min-h-11 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg outline-none focus:border-brass";

export function RulesPanel({
  rules,
  entries,
  autoApply,
  renamePattern,
  selectedCount,
  onClose,
  onToggle,
  onAdd,
  onDelete,
  onAuto,
  onRun,
  onRenamePattern,
  onRename,
  onPark,
  onApplyPlan,
  onNotice,
}: {
  rules: Rule[];
  entries: Entry[];
  autoApply: boolean;
  renamePattern: string;
  selectedCount: number;
  onClose: () => void;
  onToggle: (id: string) => void;
  onAdd: (rule: Omit<Rule, "id">) => void;
  onDelete: (id: string) => void;
  onAuto: (on: boolean) => void;
  onRun: () => void;
  onRenamePattern: (pattern: string) => void;
  onRename: () => void;
  onPark: () => void;
  onApplyPlan: (moves: AiSuggestion["moves"], renames: AiSuggestion["renames"]) => void;
  onNotice: (notice: string) => void;
}) {
  const [draft, setDraft] = useState({
    name: "Custom rule",
    field: "ext" as MatchField,
    op: "is" as MatchOp,
    value: "png",
    folder: "Images",
  });
  const [ai, setAi] = useState<AiSuggestion | null>(null);
  const [aiError, setAiError] = useState("");
  const [busy, setBusy] = useState(false);
  const dupes = duplicateGroups(entries).reduce((sum, group) => sum + group.length - 1, 0);

  async function ask() {
    setBusy(true);
    setAiError("");
    try {
      const result = await suggestOrganization({
        data: {
          files: entries.slice(0, 60).map((entry) => ({
            id: entry.id,
            name: entry.name,
            ext: entry.ext,
            kind: entry.kind,
            size: entry.size,
            folder: entry.folder,
          })),
        },
      });
      if (!result.ok) {
        setAi(null);
        setAiError(result.error);
        return;
      }
      setAi(result.suggestion);
    } catch (error) {
      setAi(null);
      setAiError(error instanceof Error ? error.message : "AI request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="fixed inset-0 z-30 flex min-h-0 flex-col bg-bg md:static md:z-auto md:w-96 md:border-l md:border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="font-display text-2xl text-fg">Rules</h2>
        <button type="button" className={ghost} onClick={onClose} aria-label="Close rules">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={brass} onClick={onRun}>
            Run rules
          </button>
          <button
            type="button"
            className={ghost}
            onClick={() => onAuto(!autoApply)}
            aria-pressed={autoApply}
          >
            {autoApply ? "Auto-sort on" : "Auto-sort off"}
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {rules.map((rule) => (
            <li key={rule.id} className="rounded-xl border border-line bg-surface p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-sm text-muted">
                    If {rule.field} {rule.op} {rule.value || "—"} → {rule.folder}
                  </p>
                </div>
                <button type="button" className={ghost} aria-pressed={rule.enabled} onClick={() => onToggle(rule.id)}>
                  {rule.enabled ? "On" : "Off"}
                </button>
              </div>
              <button type="button" className="mt-2 text-sm text-muted underline-offset-2 hover:underline" onClick={() => onDelete(rule.id)}>
                Remove rule
              </button>
            </li>
          ))}
        </ul>
        <form
          className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-3"
          onSubmit={(event) => {
            event.preventDefault();
            onAdd({ ...draft, enabled: true, name: draft.name.trim() || "Custom rule", folder: draft.folder.trim() || "Inbox" });
          }}
        >
          <h3 className="font-medium">New rule</h3>
          <input className={fieldClass} aria-label="Rule name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <select className={fieldClass} aria-label="Match field" value={draft.field} onChange={(event) => setDraft({ ...draft, field: event.target.value as MatchField })}>
              <option value="kind">kind</option>
              <option value="ext">extension</option>
              <option value="name">name</option>
              <option value="size">size in bytes</option>
            </select>
            <select className={fieldClass} aria-label="Match operation" value={draft.op} onChange={(event) => setDraft({ ...draft, op: event.target.value as MatchOp })}>
              <option value="is">is</option>
              <option value="contains">contains</option>
              <option value="gt">greater than</option>
              <option value="lt">less than</option>
            </select>
          </div>
          <input className={fieldClass} aria-label="Match value" value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} />
          <input className={fieldClass} aria-label="Destination folder" value={draft.folder} onChange={(event) => setDraft({ ...draft, folder: event.target.value })} />
          <button type="submit" className={brass}>
            Add rule
          </button>
        </form>
        <section className="flex flex-col gap-2">
          <h3 className="font-medium">Rename selection</h3>
          <p className="text-sm text-muted">
            Tokens: {"{stem} {ext} {index} {date} {folder} {kind}"}. {selectedCount} selected.
          </p>
          <input className={fieldClass} aria-label="Rename pattern" value={renamePattern} onChange={(event) => onRenamePattern(event.target.value)} />
          <button type="button" className={ghost} onClick={onRename}>
            Rename in library
          </button>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="font-medium">Duplicates</h3>
          <p className="text-sm text-muted">{dupes === 0 ? "None by name and size." : `${dupes} extra copies.`}</p>
          <button type="button" className={ghost} onClick={onPark}>
            Park extras
          </button>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="font-medium">Write copies</h3>
          <p className="text-sm text-muted">
            Chromium can copy the library into a folder you pick, grouped by the folders above. Nothing is deleted.
          </p>
          <button
            type="button"
            className={brass}
            onClick={() => {
              void writeCopies(entries)
                .then((message) => onNotice(message))
                .catch((error: unknown) => {
                  const message = error instanceof Error ? error.message : "Could not write the folder.";
                  if (message.includes("aborted") || message.includes("cancel")) onNotice("Folder write cancelled.");
                  else onNotice(message);
                });
            }}
          >
            Write into a folder
          </button>
        </section>
        <section className="flex flex-col gap-2 border-t border-line pt-4">
          <h3 className="font-medium">AI option</h3>
          <p className="text-sm text-muted">
            Sends names, kinds, and sizes only — not file contents. You review the plan before it changes the library.
          </p>
          <button type="button" className={brass} disabled={busy || entries.length === 0} onClick={() => void ask()}>
            {busy ? "Asking…" : "Suggest with AI"}
          </button>
          {aiError ? <p className="text-sm text-brass">{aiError}</p> : null}
          {ai ? (
            <div className="rounded-xl border border-line bg-surface p-3">
              <p className="text-sm">{ai.summary}</p>
              <p className="mt-2 text-sm text-muted tabular-nums">
                {ai.moves.length} moves · {ai.renames.length} renames
              </p>
              <ul className="mt-2 flex max-h-40 flex-col gap-1 overflow-auto text-sm text-muted">
                {ai.moves.slice(0, 8).map((move) => (
                  <li key={move.id}>Move to {move.folder}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`${brass} mt-3`}
                onClick={() => {
                  onApplyPlan(ai.moves, ai.renames);
                  setAi(null);
                }}
              >
                Apply plan
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </aside>
  );
}

const brass =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-4 text-sm font-medium text-brass-ink disabled:opacity-50";
const ghost =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-raised px-3 text-sm text-fg";
