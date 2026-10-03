import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const outDir = join(root, "deploy");
const zipPath = join(outDir, "loy-namecom.zip");

const build = spawnSync("pnpm", ["run", "build"], { cwd: root, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

mkdirSync(outDir, { recursive: true });
const zip = spawnSync(
  "python3",
  [
    "-c",
    `
import os, zipfile
dist, dest = ${JSON.stringify(dist)}, ${JSON.stringify(zipPath)}
with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, _, files in os.walk(dist):
        for name in files:
            full = os.path.join(dirpath, name)
            z.write(full, os.path.relpath(full, dist))
print(dest)
`,
  ],
  { stdio: "inherit" },
);
if (zip.status !== 0) process.exit(zip.status ?? 1);
console.log("Upload the files inside this zip into the domain document root. Do not leave them inside a dist folder.");
