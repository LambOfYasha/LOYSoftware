# Lamb of Yeshu Software

The repository root is the public marketing site (Vite + React). It is not a Next.js app. The member portal is a separate app in [`members/`](members/README.md).

## Part 1 — For an AI working in this repo

Two deployable apps. Do not treat a failure in one as a defect in the other.

| App | Directory | Package manager | Build | Host output |
| --- | --- | --- | --- | --- |
| Marketing site | repository root | pnpm (`pnpm-lock.yaml`) | `pnpm run build` (`vite build`) | `dist` |
| Member portal | `members/` | npm (`package-lock.json`) | `npm run build` | Nitro / `.vercel/output` |

The Vercel project `lamb-of-yasha-softwares` is connected to this repo with root directory `/`. Its framework preset was `nextjs`. That preset looks for a `next` dependency, this `package.json` does not have one (`next-themes` is not Next.js), and the build stops before Vite runs.

`vercel.json` at the root forces `framework: vite`. Do not remove it. Do not set this project's root directory to `members/` if the goal is the marketing site. A member-portal deploy is a different Vercel project whose root directory is `members`.

### Failure signatures

- `No Next.js version detected` after a log that installs `@mui/material` and `react-router`: the project framework is still Next.js, or `vercel.json` is missing. The install list is the marketing site, not the member portal. Set framework to Vite. Do not add the `next` package to silence it.
- The same error after a log that installs `@tanstack/react-start`: root directory is `members/` but the framework preset is still Next.js. Use the member portal's own project settings, documented in `members/README.md`.
- `Could not identify Next.js version` on the line above is the same failure, not a missing TypeScript install.

## Part 2 — For a person running or debugging the site

### Run the marketing site

Use Node 22, from the repository root:

```bash
pnpm install
pnpm run dev
```

Vite prints a local URL. `pnpm run build` writes `dist/`.

### Deploy the marketing site

The project that failed on commit `3468d91` is `lamb-of-yasha-softwares`. It must build this directory as Vite, not as Next.js.

1. Root directory stays the repository root.
2. Framework is Vite. `vercel.json` sets that in git.
3. Build command is `pnpm run build`. Output directory is `dist`.
4. Redeploy after that file is on `main`. A successful log runs `vite build` and does not mention Next.js.

The member portal is not this deployment. Its steps are in `members/README.md`.

### When the build says Next.js is missing

1. Read the install list. `@mui/material` means this marketing site. `@tanstack/react-start` means `members/`.
2. If it is the marketing site, confirm `vercel.json` contains `"framework": "vite"` and the Vercel framework preset is Vite, then redeploy.
3. Do not convert the site to Next.js, and do not apply a Node ESM import patch from a different repository. This failure happens before the app compiles.
