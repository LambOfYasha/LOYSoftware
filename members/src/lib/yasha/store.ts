import { create } from "zustand";
import { putBlob } from "./blobs";
import {
  applyRename,
  applyRules,
  DEFAULT_RULES,
  extOf,
  kindOf,
  parkDuplicates,
  type Entry,
  type Rule,
} from "./engine";
import {
  applySavedSamples,
  forgetBlob,
  overridesFrom,
  readImports,
  readSettings,
  writeImports,
  writeSettings,
} from "./persist";
import { SAMPLES } from "./samples";

export type Panel = "none" | "rules" | "share";
export type SortKey = "name" | "date" | "size" | "kind";

type State = {
  entries: Entry[];
  rules: Rule[];
  autoApply: boolean;
  extraFolders: string[];
  folder: string;
  query: string;
  sort: SortKey;
  view: "grid" | "list";
  selected: string[];
  viewerId: string | null;
  panel: Panel;
  hydrated: boolean;
  notice: string;
  renamePattern: string;
  setFolder: (folder: string) => void;
  setQuery: (query: string) => void;
  setSort: (sort: SortKey) => void;
  setView: (view: "grid" | "list") => void;
  setPanel: (panel: Panel) => void;
  setRenamePattern: (pattern: string) => void;
  toggleSelect: (id: string) => void;
  selectIds: (ids: string[]) => void;
  clearSelection: () => void;
  openViewer: (id: string) => void;
  closeViewer: () => void;
  noticeTo: (notice: string) => void;
  hydrate: () => Promise<void>;
  importFiles: (files: File[]) => Promise<void>;
  removeSelected: () => void;
  clearStudioRoll: () => void;
  runRules: () => void;
  toggleRule: (id: string) => void;
  addRule: (rule: Omit<Rule, "id">) => void;
  deleteRule: (id: string) => void;
  setAutoApply: (on: boolean) => void;
  addFolder: (name: string) => void;
  moveSelected: (folder: string) => void;
  renameSelected: () => void;
  parkDupes: () => void;
  applyPlan: (moves: { id: string; folder: string }[], renames: { id: string; name: string }[]) => void;
};

const TEXT_EXT = new Set(["txt", "md", "csv", "json", "html", "htm"]);

function withAuto(entries: Entry[], rules: Rule[], autoApply: boolean) {
  if (!autoApply) return entries;
  return applyRules(entries, rules).entries;
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePersist(state: State) {
  if (!state.hydrated || typeof window === "undefined") return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    writeSettings({
      rules: state.rules,
      autoApply: state.autoApply,
      extraFolders: state.extraFolders,
      overrides: overridesFrom(state.entries),
    });
    void writeImports(state.entries).catch(() => {
      /* keep the in-memory library even if storage is full */
    });
  }, 200);
}

export const useYasha = create<State>((set, get) => {
  const commit = (partial: Partial<State>) => {
    set(partial);
    schedulePersist({ ...get(), ...partial });
  };

  return {
    entries: SAMPLES,
    rules: DEFAULT_RULES,
    autoApply: false,
    extraFolders: [],
    folder: "all",
    query: "",
    sort: "date",
    view: "grid",
    selected: [],
    viewerId: null,
    panel: "none",
    hydrated: false,
    notice: "Studio roll is in Inbox. Run rules, or drop your own files.",
    renamePattern: "{date}_{stem}",
    setFolder: (folder) => set({ folder }),
    setQuery: (query) => set({ query }),
    setSort: (sort) => set({ sort }),
    setView: (view) => set({ view }),
    setPanel: (panel) => set({ panel: get().panel === panel ? "none" : panel }),
    setRenamePattern: (renamePattern) => set({ renamePattern }),
    toggleSelect: (id) => {
      const selected = get().selected.includes(id)
        ? get().selected.filter((item) => item !== id)
        : [...get().selected, id];
      set({ selected });
    },
    selectIds: (ids) => set({ selected: ids }),
    clearSelection: () => set({ selected: [] }),
    openViewer: (viewerId) => set({ viewerId }),
    closeViewer: () => set({ viewerId: null }),
    noticeTo: (notice) => set({ notice }),
    hydrate: async () => {
      if (get().hydrated || typeof window === "undefined") return;
      try {
        const settings = readSettings();
        const imports = await readImports();
        const samples = applySavedSamples(settings.overrides);
        const rules = settings.rules?.length ? settings.rules : DEFAULT_RULES;
        set({
          entries: [...samples, ...imports],
          rules,
          autoApply: Boolean(settings.autoApply),
          extraFolders: settings.extraFolders ?? [],
          hydrated: true,
          notice: imports.length
            ? "Restored your library on this device."
            : "Studio roll is in Inbox. Run rules, or drop your own files.",
        });
      } catch {
        set({ hydrated: true });
      }
    },
    importFiles: async (files) => {
      const added: Entry[] = [];
      for (const file of files) {
        const ext = extOf(file.name);
        const id = crypto.randomUUID();
        putBlob(id, file);
        let text: string | undefined;
        if ((file.type.startsWith("text/") || TEXT_EXT.has(ext)) && file.size < 200_000) {
          text = await file.text();
        }
        let width: number | undefined;
        let height: number | undefined;
        if (file.type.startsWith("image/") && !["image/heic", "image/heif"].includes(file.type)) {
          const dims = await measureImage(file);
          width = dims?.width;
          height = dims?.height;
        }
        added.push({
          id,
          name: file.name,
          size: file.size,
          mime: file.type || "application/octet-stream",
          ext,
          kind: kindOf(ext, file.type),
          folder: "Inbox",
          addedAt: Date.now(),
          modifiedAt: file.lastModified || Date.now(),
          width,
          height,
          href: URL.createObjectURL(file),
          text,
          origin: "import",
        });
      }
      if (added.length === 0) return;
      const { rules, autoApply } = get();
      const entries = withAuto([...get().entries, ...added], rules, autoApply);
      commit({
        entries,
        folder: "Inbox",
        notice: autoApply
          ? `Brought in ${added.length} file${added.length === 1 ? "" : "s"} and applied rules.`
          : `Brought in ${added.length} file${added.length === 1 ? "" : "s"} to Inbox.`,
      });
    },
    removeSelected: () => {
      const ids = new Set(get().selected);
      if (ids.size === 0) return;
      for (const entry of get().entries) {
        if (!ids.has(entry.id)) continue;
        if (entry.href?.startsWith("blob:")) URL.revokeObjectURL(entry.href);
        forgetBlob(entry.id);
      }
      commit({
        entries: get().entries.filter((entry) => !ids.has(entry.id)),
        selected: [],
        viewerId: ids.has(get().viewerId ?? "") ? null : get().viewerId,
        notice: `Removed ${ids.size} from the library. Originals on disk were not touched.`,
      });
    },
    clearStudioRoll: () => {
      commit({
        entries: get().entries.filter((entry) => entry.origin !== "sample"),
        notice: "Studio roll hidden. Your imports stay.",
      });
    },
    runRules: () => {
      const result = applyRules(get().entries, get().rules);
      commit({
        entries: result.entries,
        notice:
          result.moved === 0 ? "Rules ran. Nothing needed to move." : `Rules moved ${result.moved} files.`,
      });
    },
    toggleRule: (id) => {
      const rules = get().rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule));
      const entries = withAuto(get().entries, rules, get().autoApply);
      commit({ rules, entries });
    },
    addRule: (rule) => {
      const rules = [...get().rules, { ...rule, id: crypto.randomUUID() }];
      const entries = withAuto(get().entries, rules, get().autoApply);
      commit({ rules, entries, extraFolders: uniqueFolders(get().extraFolders, rule.folder) });
    },
    deleteRule: (id) => commit({ rules: get().rules.filter((rule) => rule.id !== id) }),
    setAutoApply: (autoApply) => {
      const entries = withAuto(get().entries, get().rules, autoApply);
      commit({
        autoApply,
        entries,
        notice: autoApply ? "New files will be sorted as they arrive." : "Auto-sort is off.",
      });
    },
    addFolder: (name) => {
      const folder = name.trim();
      if (!folder) return;
      commit({ extraFolders: uniqueFolders(get().extraFolders, folder), folder });
    },
    moveSelected: (folder) => {
      const ids = new Set(get().selected);
      if (ids.size === 0) {
        set({ notice: "Select files first." });
        return;
      }
      commit({
        entries: get().entries.map((entry) => (ids.has(entry.id) ? { ...entry, folder } : entry)),
        extraFolders: uniqueFolders(get().extraFolders, folder),
        notice: `Moved ${ids.size} to ${folder}.`,
      });
    },
    renameSelected: () => {
      const ids = new Set(get().selected);
      if (ids.size === 0) {
        set({ notice: "Select files to rename." });
        return;
      }
      commit({
        entries: applyRename(get().entries, ids, get().renamePattern),
        notice: `Renamed ${ids.size} file${ids.size === 1 ? "" : "s"} in the library.`,
      });
    },
    parkDupes: () => {
      const result = parkDuplicates(get().entries);
      commit({
        entries: result.entries,
        notice:
          result.parked === 0
            ? "No duplicates by name and size."
            : `Parked ${result.parked} duplicate${result.parked === 1 ? "" : "s"}. Kept the earliest copy.`,
      });
    },
    applyPlan: (moves, renames) => {
      const moveMap = new Map(moves.map((move) => [move.id, move.folder]));
      const nameMap = new Map(renames.map((rename) => [rename.id, rename.name]));
      const entries = get().entries.map((entry) => {
        const folder = moveMap.get(entry.id);
        const name = nameMap.get(entry.id);
        if (!folder && !name) return entry;
        return { ...entry, folder: folder ?? entry.folder, name: name ?? entry.name };
      });
      const folders = moves.map((move) => move.folder);
      commit({
        entries,
        extraFolders: folders.reduce(uniqueFolders, get().extraFolders),
        notice: "Applied the AI plan inside the library. Disk copies are unchanged until you write them.",
      });
    },
  };
});

function uniqueFolders(existing: string[], folder: string) {
  if (!folder || existing.includes(folder)) return existing;
  return [...existing, folder].sort((a, b) => a.localeCompare(b));
}

function measureImage(file: Blob): Promise<{ width: number; height: number } | null> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });
}

export function visibleEntries(state: Pick<State, "entries" | "folder" | "query" | "sort">): Entry[] {
  const q = state.query.trim().toLowerCase();
  const filtered = state.entries.filter((entry) => {
    if (state.folder !== "all" && entry.folder !== state.folder) return false;
    if (!q) return true;
    return (
      entry.name.toLowerCase().includes(q) ||
      entry.folder.toLowerCase().includes(q) ||
      entry.ext.toLowerCase().includes(q)
    );
  });
  const copy = [...filtered];
  copy.sort((a, b) => {
    if (state.sort === "name") return a.name.localeCompare(b.name);
    if (state.sort === "size") return b.size - a.size;
    if (state.sort === "kind") return a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name);
    return b.modifiedAt - a.modifiedAt;
  });
  return copy;
}
