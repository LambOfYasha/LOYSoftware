import { kindOf, type Entry } from "./engine";

const NOTES = "Cliff path, late light.\nCourtyard olive is the one to keep.\nLanterns are for the night set.\n";
const INVOICE = "item,qty,note\nprints,40,linen set\nlanterns,12,night edit\nclips,8,brass\n";
const PACKING = "# Packing list\n\n- Contact sheets\n- Brass clips\n- Field notes\n";

function doc(id: string, name: string, text: string, modifiedAt: number): Entry {
  const ext = name.split(".").pop() ?? "";
  return {
    id,
    name,
    size: text.length,
    mime: ext === "csv" ? "text/csv" : ext === "md" ? "text/markdown" : "text/plain",
    ext,
    kind: kindOf(ext),
    folder: "Inbox",
    addedAt: modifiedAt,
    modifiedAt,
    text,
    href: `/samples/${name}`,
    origin: "sample",
  };
}

export const SAMPLES: Entry[] = [
  {
    id: "sample-cliff",
    name: "cliff-path.jpg",
    size: 942353,
    mime: "image/jpeg",
    ext: "jpg",
    kind: "image",
    folder: "Inbox",
    addedAt: Date.parse("2026-03-02T16:40:00Z"),
    modifiedAt: Date.parse("2026-03-02T16:40:00Z"),
    href: "/samples/cliff-path.jpg",
    origin: "sample",
  },
  {
    id: "sample-citrus",
    name: "linen-citrus.jpg",
    size: 684511,
    mime: "image/jpeg",
    ext: "jpg",
    kind: "image",
    folder: "Inbox",
    addedAt: Date.parse("2026-03-11T11:05:00Z"),
    modifiedAt: Date.parse("2026-03-11T11:05:00Z"),
    href: "/samples/linen-citrus.jpg",
    origin: "sample",
  },
  {
    id: "sample-court",
    name: "courtyard.jpg",
    size: 708667,
    mime: "image/jpeg",
    ext: "jpg",
    kind: "image",
    folder: "Inbox",
    addedAt: Date.parse("2026-04-18T09:20:00Z"),
    modifiedAt: Date.parse("2026-04-18T09:20:00Z"),
    href: "/samples/courtyard.jpg",
    origin: "sample",
  },
  {
    id: "sample-lantern",
    name: "lanterns.jpg",
    size: 483685,
    mime: "image/jpeg",
    ext: "jpg",
    kind: "image",
    folder: "Inbox",
    addedAt: Date.parse("2026-05-09T21:15:00Z"),
    modifiedAt: Date.parse("2026-05-09T21:15:00Z"),
    href: "/samples/lanterns.jpg",
    origin: "sample",
  },
  doc("sample-notes", "field-notes.txt", NOTES, Date.parse("2026-03-02T18:00:00Z")),
  doc("sample-invoice", "march-invoice.csv", INVOICE, Date.parse("2026-03-28T13:00:00Z")),
  doc("sample-pack", "packing-list.md", PACKING, Date.parse("2026-04-18T12:00:00Z")),
];

export const SAMPLE_IDS = new Set(SAMPLES.map((entry) => entry.id));
