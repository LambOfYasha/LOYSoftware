# Lamb of Yeshu Software

The repository root is the public marketing site (Vite + React). It is not a Next.js app. The member portal is a separate app in [`members/`](members/README.md). YashaFiness, the local photo viewer and file organizer, is a different repository.

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
- `403 Forbidden` on `https://experimental.lambofyeshu.life` after its A record is `169.63.229.130`: the name.com document root is empty, or the upload left the files inside a `dist` folder. Upload the contents of `deploy/loy-namecom.zip` into `public_html`, with `index.html` beside `.htaccess`.
- `/about` (or another route) 404s or 403s on name.com while `/` works: `.htaccess` was not uploaded. Dotfiles are easy to skip in File Manager.
- `lambofyeshu.life` still returns the name.com 403 after the Vercel domains were added: DNS was not changed. Nameservers stay at name.com. Only the records below move.

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

### Hosts after the swap

Vercel is the main host. Name.com is only the static experimental copy. DNS is still at name.com (`ns1djs.name.com` and the other `ns*.name.com` servers). Do not change the nameservers.

The Vercel project `lamb-of-yasha-softwares` already has these domains, all verified:

| Domain | Role |
| --- | --- |
| `lambofyeshu.life` | Main marketing site |
| `www.lambofyeshu.life` | 308 redirect to the apex |
| `experimental.lambofyeshu.life` | Still attached, so the current site stays up until DNS moves |

Until the records below are saved, the apex and `www` still answer `169.63.229.130` with a 403, and `experimental` still answers Vercel.

In name.com DNS for `lambofyeshu.life`:

| Host | Change |
| --- | --- |
| `@` | Replace the A record `169.63.229.130` with the A value shown on the Vercel domain card for `lambofyeshu.life`. Do not copy an IP resolved from the experimental CNAME. |
| `www` | Delete the A record `169.63.229.130`. Add a CNAME to `65a863b71d38a490.vercel-dns-017.com`. That is the target experimental already uses. |
| `experimental` | Delete the CNAME to Vercel. Add an A record to `169.63.229.130`. |

Do `experimental` last. It will 403 until the zip is in `public_html`. The member portal is not in that zip.

```bash
pnpm run pack:namecom
```

Upload the files inside `deploy/loy-namecom.zip` into `public_html` so `index.html` and `.htaccess` are in the document root. `.htaccess` is what makes `/about`, `/projects`, `/portfolio`, `/hlapm`, `/store`, `/contact`, and `/success` work on name.com. The marketing page no longer sends `noindex`.

### When the build says Next.js is missing

1. Read the install list. `@mui/material` means this marketing site. `@tanstack/react-start` means `members/`.
2. If it is the marketing site, confirm `vercel.json` contains `"framework": "vite"` and the Vercel framework preset is Vite, then redeploy.
3. Do not convert the site to Next.js, and do not apply a Node ESM import patch from a different repository. This failure happens before the app compiles.
