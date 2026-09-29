import { useEffect, useMemo, useRef, useState } from "react";
import { Archive, File, FileText, Film, FolderOpen, Image as ImageIcon, LayoutGrid, List, Music, Search } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import type { Entry, Kind } from "@/lib/yasha/engine";
import { viewableImage } from "@/lib/yasha/engine";
import { useYasha, visibleEntries } from "@/lib/yasha/store";
import { RulesPanel } from "./RulesPanel";
import { SharePanel } from "./SharePanel";
import { Viewer } from "./Viewer";

const kindIcon: Record<Kind, typeof File> = {
  image: ImageIcon,
  document: FileText,
  audio: Music,
  video: Film,
  archive: Archive,
  other: File,
};

export function Studio() {
  const state = useYasha();
  const fileRef = useRef<HTMLInputElement>(null);
  const dirRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [moveTarget, setMoveTarget] = useState("Images");

  useEffect(() => {
    void state.hydrate();
  }, [state.hydrate]);

  const shown = useMemo(
    () => visibleEntries({ entries: state.entries, folder: state.folder, query: state.query, sort: state.sort }),
    [state.entries, state.folder, state.query, state.sort],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of state.entries) map.set(entry.folder, (map.get(entry.folder) ?? 0) + 1);
    for (const name of state.extraFolders) if (!map.has(name)) map.set(name, 0);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [state.entries, state.extraFolders]);

  const shareEntries =
    state.selected.length > 0 ? state.entries.filter((entry) => state.selected.includes(entry.id)) : shown;

  function takeFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    void state.importFiles([...list]);
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-bg text-fg">
      <header className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2 md:px-5">
        <div className="mr-auto min-w-0">
          <p className="font-display text-2xl leading-none">
            Yasha<span className="italic text-brass">Finess</span>
          </p>
          <p className="text-xs text-muted">File organizer and image viewer</p>
        </div>
        <label className="relative min-w-0 basis-full md:basis-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            value={state.query}
            onChange={(event) => state.setQuery(event.target.value)}
            placeholder="Search name or type"
            aria-label="Search library"
            className="min-h-11 w-full rounded-full border border-line bg-surface pr-3 pl-9 text-sm outline-none focus:border-brass"
          />
        </label>
        <button type="button" className={ghost} onClick={() => fileRef.current?.click()}>
          Add files
        </button>
        <button type="button" className={ghost} onClick={() => dirRef.current?.click()}>
          Add folder
        </button>
        <button type="button" className={state.panel === "rules" ? brass : ghost} onClick={() => state.setPanel("rules")}>
          Rules
        </button>
        <button type="button" className={state.panel === "share" ? brass : ghost} onClick={() => state.setPanel("share")}>
          Share
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <nav className="hidden w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-line p-3 md:flex" aria-label="Folders">
          <FolderButton name="All files" count={state.entries.length} active={state.folder === "all"} onClick={() => state.setFolder("all")} />
          {counts.map(([name, count]) => (
            <FolderButton key={name} name={name} count={count} active={state.folder === name} onClick={() => state.setFolder(name)} />
          ))}
          <form
            className="mt-3 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              state.addFolder(folderName);
              setFolderName("");
            }}
          >
            <input
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              aria-label="New folder name"
              placeholder="New folder"
              className="min-h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface px-2 text-sm outline-none focus:border-brass"
            />
          </form>
        </nav>
        <main
          className="flex min-w-0 flex-1 flex-col"
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            takeFiles(event.dataTransfer.files);
          }}
        >
          <div className="flex gap-2 overflow-x-auto px-3 pt-3 md:hidden">
            <FolderButton name="All" count={state.entries.length} active={state.folder === "all"} onClick={() => state.setFolder("all")} />
            {counts.map(([name, count]) => (
              <FolderButton key={name} name={name} count={count} active={state.folder === name} onClick={() => state.setFolder(name)} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 px-3 py-3 md:px-4">
            <p className="text-sm text-muted tabular-nums" aria-live="polite">
              {state.notice}
            </p>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button type="button" className={brass} onClick={() => state.runRules()}>
                Run rules
              </button>
              <select
                aria-label="Sort"
                value={state.sort}
                onChange={(event) => state.setSort(event.target.value as typeof state.sort)}
                className="min-h-11 rounded-full border border-line bg-surface px-3 text-sm"
              >
                <option value="date">Newest</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="kind">Kind</option>
              </select>
              <button type="button" className={ghost} aria-pressed={state.view === "grid"} onClick={() => state.setView("grid")}>
                <LayoutGrid className="size-4" />
                <span className="sr-only">Grid</span>
              </button>
              <button type="button" className={ghost} aria-pressed={state.view === "list"} onClick={() => state.setView("list")}>
                <List className="size-4" />
                <span className="sr-only">List</span>
              </button>
            </div>
          </div>
          {state.selected.length > 0 ? (
            <div className="mx-3 mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 md:mx-4">
              <p className="text-sm tabular-nums">{state.selected.length} selected</p>
              <select
                aria-label="Move selected to"
                value={moveTarget}
                onChange={(event) => setMoveTarget(event.target.value)}
                className="min-h-11 rounded-full border border-line bg-raised px-3 text-sm"
              >
                {["Inbox", "Images", "Documents", "Audio", "Video", "Archives", "Finance", "Duplicates", ...state.extraFolders]
                  .filter((name, index, list) => list.indexOf(name) === index)
                  .map((name) => (
                    <option key={name}>{name}</option>
                  ))}
              </select>
              <button type="button" className={ghost} onClick={() => state.moveSelected(moveTarget)}>
                Move
              </button>
              <button type="button" className={ghost} onClick={() => state.removeSelected()}>
                Remove
              </button>
              <button type="button" className={ghost} onClick={() => state.clearSelection()}>
                Clear
              </button>
            </div>
          ) : null}
          <div className={cn("min-h-0 flex-1 overflow-y-auto px-3 pb-6 md:px-4", dragging && "bg-raised")}>
            {shown.length === 0 ? (
              <div className="flex h-full min-h-64 flex-col items-start justify-center gap-3">
                <FolderOpen className="size-8 text-brass" />
                <h2 className="font-display text-3xl">Nothing in this view</h2>
                <p className="max-w-md text-muted">Drop files here, add a folder, or clear the search.</p>
                <button type="button" className={ghost} onClick={() => state.clearStudioRoll()}>
                  Hide studio roll
                </button>
              </div>
            ) : state.view === "grid" ? (
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                {shown.map((entry) => (
                  <li key={entry.id}>
                    <FileCard entry={entry} selected={state.selected.includes(entry.id)} onOpen={() => state.openViewer(entry.id)} onSelect={() => state.toggleSelect(entry.id)} onMeasure={(width, height) => noteSize(entry, width, height)} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex flex-col gap-1">
                {shown.map((entry) => (
                  <li key={entry.id}>
                    <FileRow entry={entry} selected={state.selected.includes(entry.id)} onOpen={() => state.openViewer(entry.id)} onSelect={() => state.toggleSelect(entry.id)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
        {state.panel === "rules" ? (
          <RulesPanel
            rules={state.rules}
            entries={state.entries}
            autoApply={state.autoApply}
            renamePattern={state.renamePattern}
            selectedCount={state.selected.length}
            onClose={() => state.setPanel("rules")}
            onToggle={state.toggleRule}
            onAdd={state.addRule}
            onDelete={state.deleteRule}
            onAuto={state.setAutoApply}
            onRun={state.runRules}
            onRenamePattern={state.setRenamePattern}
            onRename={state.renameSelected}
            onPark={state.parkDupes}
            onApplyPlan={state.applyPlan}
            onNotice={state.noticeTo}
          />
        ) : null}
        {state.panel === "share" ? (
          <SharePanel entries={shareEntries} onClose={() => state.setPanel("share")} onNotice={state.noticeTo} />
        ) : null}
      </div>
      <input ref={fileRef} type="file" multiple className="hidden" onChange={(event) => { takeFiles(event.target.files); event.target.value = ""; }} />
      <input
        ref={dirRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          takeFiles(event.target.files);
          event.target.value = "";
        }}
        {...{ webkitdirectory: "", directory: "" }}
      />
      {state.viewerId ? (
        <Viewer
          entries={shown.length > 0 ? shown : state.entries}
          currentId={state.viewerId}
          onClose={state.closeViewer}
          onOpen={state.openViewer}
        />
      ) : null}
    </div>
  );
}

function noteSize(entry: Entry, width: number, height: number) {
  if (entry.width === width && entry.height === height) return;
  useYasha.setState((current) => ({
    entries: current.entries.map((item) => (item.id === entry.id ? { ...item, width, height } : item)),
  }));
}

function FolderButton({
  name,
  count,
  active,
  onClick,
}: {
  name: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-lg px-3 text-left text-sm",
        active ? "bg-brass text-brass-ink" : "text-fg hover:bg-raised",
      )}
    >
      <span className="truncate">{name}</span>
      <span className={cn("tabular-nums", active ? "text-brass-ink" : "text-muted")}>{count}</span>
    </button>
  );
}

function FileCard({
  entry,
  selected,
  onOpen,
  onSelect,
  onMeasure,
}: {
  entry: Entry;
  selected: boolean;
  onOpen: () => void;
  onSelect: () => void;
  onMeasure: (width: number, height: number) => void;
}) {
  const Icon = kindIcon[entry.kind];
  const showImage = viewableImage(entry) && entry.href;
  return (
    <article className={cn("overflow-hidden rounded-xl border bg-surface", selected ? "border-brass" : "border-line")}>
      <button type="button" onClick={onOpen} className="block w-full text-left">
        {showImage ? (
          <img
            src={entry.href}
            alt={entry.name}
            className="aspect-photo w-full object-cover"
            onLoad={(event) => onMeasure(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)}
          />
        ) : (
          <span className="flex aspect-photo w-full items-center justify-center bg-raised text-muted">
            <Icon className="size-7" />
          </span>
        )}
        <span className="block truncate px-3 pt-3 font-medium">{entry.name}</span>
      </button>
      <div className="flex items-center justify-between gap-2 px-3 pt-1 pb-3">
        <p className="truncate text-xs text-muted">
          {entry.folder} · <span className="tabular-nums">{formatBytes(entry.size)}</span>
        </p>
        <button type="button" aria-pressed={selected} onClick={onSelect} className={cn("min-h-11 rounded-full px-3 text-xs", selected ? "bg-brass text-brass-ink" : "border border-line")}>
          {selected ? "Selected" : "Select"}
        </button>
      </div>
    </article>
  );
}

function FileRow({
  entry,
  selected,
  onOpen,
  onSelect,
}: {
  entry: Entry;
  selected: boolean;
  onOpen: () => void;
  onSelect: () => void;
}) {
  const Icon = kindIcon[entry.kind];
  return (
    <div className={cn("flex min-h-11 items-center gap-2 rounded-lg border px-2", selected ? "border-brass bg-surface" : "border-transparent")}>
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 py-2 text-left">
        <Icon className="size-4 shrink-0 text-brass" />
        <span className="truncate">{entry.name}</span>
        <span className="ml-auto hidden text-sm text-muted sm:inline">{entry.folder}</span>
        <span className="text-sm text-muted tabular-nums">{formatBytes(entry.size)}</span>
      </button>
      <button type="button" aria-pressed={selected} onClick={onSelect} className="min-h-11 shrink-0 rounded-full px-3 text-xs">
        {selected ? "Selected" : "Select"}
      </button>
    </div>
  );
}

const brass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brass px-4 text-sm font-medium text-brass-ink";
const ghost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface px-3 text-sm text-fg";
