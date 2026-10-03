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
- `403 Forbidden` on `https://lambofyeshu.life` while `https://experimental.lambofyeshu.life` returns the marketing page: the name.com document root is empty or the upload left the files inside a `dist` folder. The backup is already correct. Upload the contents of `deploy/loy-namecom.zip` into `public_html`, with `index.html` beside `.htaccess`.
- `/about` (or another route) 404s or 403s on name.com while `/` works: `.htaccess` was not uploaded. Dotfiles are easy to skip in File Manager.

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

### Name.com hosting, with experimental as the backup

Two hosts. Do not put both jobs on the name.com server.

| Role | Where | What it serves now |
| --- | --- | --- |
| Primary | Name.com hosting. `lambofyeshu.life` and `www` resolve to `169.63.229.130`. | 403. The document root has no site files. |
| Backup | Vercel project `lamb-of-yasha-softwares`. | `https://experimental.lambofyeshu.life` already returns the Vite marketing site. The domain is verified on that project. |

The backup is a different machine. Do not point `experimental` at `169.63.229.130`. If name.com is down, that record would go down with it.

Only the marketing site is packed for name.com. From the repository root:

```bash
pnpm run pack:namecom
```

That writes `deploy/loy-namecom.zip`. The zip root is `index.html`, `assets/`, and `.htaccess`. In cPanel File Manager, open the primary domain's document root (`public_html` unless the dashboard says otherwise) and upload those files there. Do not upload a folder named `dist`, and do not upload `members/` or `node_modules`. Name.com shared hosting does not run the member portal.

`.htaccess` is required. The site uses real paths (`/about`, `/projects`, `/portfolio`, `/hlapm`, `/store`, `/contact`, `/success`). Without the rewrite, opening one of those links directly returns 403 or 404 even when the home page works.

Leave the apex A record on the IP shown in the name.com hosting dashboard. Do not replace it with a guessed address. Leave `experimental` on its current Vercel CNAME.

The built page still contains `noindex, nofollow`. Putting it on name.com does not submit it to search.

### When the build says Next.js is missing

1. Read the install list. `@mui/material` means this marketing site. `@tanstack/react-start` means `members/`.
2. If it is the marketing site, confirm `vercel.json` contains `"framework": "vite"` and the Vercel framework preset is Vite, then redeploy.
3. Do not convert the site to Next.js, and do not apply a Node ESM import patch from a different repository. This failure happens before the app compiles.
