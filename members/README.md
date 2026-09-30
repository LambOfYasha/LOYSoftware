# LOY membership prototype

Prototype for `members.lambofyeshu.life`. The public marketing site stays at the repository root. This folder is the member portal only. Deploy this folder as its own site. Do not deploy the repository root if you mean to ship the member page.

## Offer

- LOY Membership, $79 once. Not a subscription.
- Covers the library now and apps added later.
- Access lasts as long as LOY Software runs the library.
- 14-day refund.
- Includes the buyer plus 10 extra memberships.
- Each membership after those 10 is $25, once.
- Seats are for a startup, a company, or friends who share the work.
- Files stay on the member's machine.
- Stripe is not connected. The page must not claim a card was charged or an invite email was sent.

Copy for the offer lives in `src/lib/loy/catalog.ts` and `src/components/loy/MembersHome.tsx`.

## Part 1 — For an AI working in this repo

Read this part before editing. The human section below is the same system in operating steps.

### What this app is

TanStack Start (Vite, React, Nitro) member portal plus the YashaFiness studio at `/studio`. Routes that matter:

| Path | File | Behavior |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Offer, price, seat list |
| `/login` | `src/routes/login.tsx` | Google and X only. No email/password. |
| `/studio` | `src/routes/studio.tsx` | YashaFiness. Signed-in only. |
| `/api/auth/*` | `src/routes/api/auth/$.ts` | Better Auth. Do not add `src/routes/auth/popup.tsx`. |

Seat and price constants are in `src/lib/loy/catalog.ts`. Seat writes are in `src/lib/loy/membership.functions.ts`. Schema is only in `migrations/*.sql`.

### Invariants

- The buyer pays $79 once and receives 10 extra memberships. Membership number 11 and later cost $25 once. Do not describe the first 10 as $25 each.
- `loy_seats.kind = 'included'` for the first 10 rows of an owner. Later rows are `kind = 'extra'` and are not active until paid. No code path marks an extra seat paid, because checkout is not implemented.
- Nothing inserts into `loy_memberships`. An included seat does not grant access until that owner has a row with `status = 'active'`.
- Do not upload member files. YashaFiness stays in the browser except for an optional AI call.
- `src/lib/auth/server.ts` is wired auth. Do not rewrite it. `src/lib/auth/preview.ts` ships with an empty `PREVIEW_CLIENT_SECRET` on purpose. Do not paste a secret back into git.
- Start Vite only through `npm run dev`, `npm run build`, or `npm run preview`. Those scripts run `scripts/with-app-env.mjs`. A direct `vite` process will disagree with the next build about `VITE_AUTH_ENABLED`.
- Absence of `VITE_AUTH_ENABLED` means sign-in is on. The string `"false"` turns it off. Restart after any change. Hot reload does not pick up env.
- `migrations/auth/` is not applied. The applied copy is `migrations/0001_auth.sql`, then `0002_membership.sql`, then `0003_seats.sql`. Add a new numbered file. Do not edit an applied file in place.

### Required deploy environment

Set these on the host that serves the public URL. Do not commit them.

| Variable | Required | Role |
| --- | --- | --- |
| `DATABASE_URL` | Yes, for a real deploy | Postgres connection string. Build runs `npm run db:migrate` against it. Without it, the server falls back to embedded PGLite, which is not durable on a serverless host. |
| `BETTER_AUTH_SECRET` | Yes | Long random secret. Sessions break if it changes. |
| `BETTER_AUTH_URL` | Yes, on a custom domain | Public origin only, for example `https://members.lambofyeshu.life`. No path, no trailing slash. Must match the browser origin. |
| `GROK_AUTH_CLIENT_ID` | Yes, for Google/X | OAuth client id for the broker at `https://auth.grok.me`. |
| `GROK_AUTH_CLIENT_SECRET` | Yes, for Google/X | Matching client secret. The git tree has no fallback secret. |
| `GROK_AUTH_ISSUER` | No | Defaults to `https://auth.grok.me`. |
| `VITE_AUTH_ENABLED` | No | Leave unset, or set `true`. Set `false` only to force the logged-out dev user. |
| `XAI_API_KEY` | No | YashaFiness AI suggestions. Rules still run when it is missing. |

`vercel.json` installs with `npm install --omit=dev`. Vite, Nitro, and TypeScript are production dependencies, so that install can still build. Node 22.

Host setup that succeeds:

1. Project root directory is `members`, not the repository root.
2. Build command is `npm run build`.
3. The host publishes the Nitro output under `.vercel/output` (preset `vercel`). Do not point the host at a hand-made `dist/` folder.
4. Env vars above exist before the first production build, so migrate can see `DATABASE_URL`.
5. The custom domain is attached on the host after the deployment URL loads. This repo does not configure DNS.

### Failure signatures

- `Sign-in is not turned on yet` on `/login`: `VITE_AUTH_ENABLED` is `"false"`.
- Sign-in buttons render but the provider round-trip never completes: `GROK_AUTH_CLIENT_SECRET` is empty. `authConfigured` in `src/lib/auth/server.ts` is false unless both client id and secret are set.
- `Invalid origin`: `BETTER_AUTH_URL` does not match the page origin, or local traffic used a host other than `localhost`, `127.0.0.1`, or `[::1]` on port 8080.
- `relation "loy_seats" does not exist` or `relation "loy_memberships" does not exist`: migrate did not run against this database. Check the build log for `[migrate] applied ...` and the `_migrations` table.
- `[migrate] DATABASE_URL not set — skipping`: expected only for a local build. A production build that prints this did not receive the database URL.
- `ENOENT` for `pglite.data` or `pglite.wasm`: production tried embedded Postgres. Set `DATABASE_URL` instead of copying those files in.
- Seat form shows `That seat could not be saved`: request was unauthenticated, or the table is missing. Confirm a session, then the migration log.
- AI in YashaFiness says it is unavailable: `XAI_API_KEY` is unset, or the caller is signed out (`401` from `authMiddleware`).
- `[auth-invariant] dev server has sign-in off but the next build has it on`: stop the process and start again with `npm run dev`.

Do not "fix" these by mocking a paid membership or by committing secrets.

## Part 2 — For a person running or debugging the site

### Run it on your machine

Use Node 22. From this folder:

```bash
cd members
npm install
npm run dev
```

Open `http://localhost:8080`. The offer page loads with no database URL. Accounts and seats are stored in a local embedded database that disappears if that data directory is deleted. That is fine for reading the page. It is not fine for a public site.

Sign-in from a fresh clone will not finish Google or X until the host has the auth variables in Part 1. The buttons can still show. An empty client secret is intentional in git.

Check the project before you deploy:

```bash
npm run typecheck
npm run check:auth
```

`check:auth` must say the dev server and the next build agree. If it does not, you started Vite by hand. Stop it and use `npm run dev` again.

### Deploy it

Deploy the `members` directory as its own project. The repository root is the marketing site. Pointing the member domain at that project will ship the wrong app.

1. Create a Postgres database and copy its connection string.
2. Create the hosting project with root directory `members`.
3. Set the build command to `npm run build`.
4. Set the environment variables from the table in Part 1. Put `DATABASE_URL` in place before the first build so the tables are created during the build.
5. Deploy. In the build log, confirm lines like `[migrate] applied 0001_auth.sql`, `0002_membership.sql`, and `0003_seats.sql`. A later deploy should say `[migrate] up to date.`
6. Open the host's deployment URL. Confirm the offer, the price ($79 once, 10 included seats, $25 after that), and `/login`.
7. Attach `members.lambofyeshu.life` only after that URL works, and set `BETTER_AUTH_URL` to `https://members.lambofyeshu.life`. Redeploy after changing that variable.

Checkout still does not charge a card. Saving a seat only stores an email. The first 10 are marked included. Further seats are marked $25 due and stay inactive.

### When something is wrong

Work down this list. Stop at the first item that matches.

1. **The live domain shows the marketing site, not the member offer.** The host project is building the repository root. Set the root directory to `members` and redeploy.
2. **The page is blank or the build failed immediately.** Run `npm run build` locally and read the first error. A missing `DATABASE_URL` does not fail the build. A TypeScript or Vite error does.
3. **Build succeeded but accounts reset on every visit.** `DATABASE_URL` was missing, so the server used a temporary embedded database. Set the Postgres URL and redeploy. You cannot recover the temporary rows.
4. **Build log never mentions `[migrate]`.** The build command is not `npm run build`. Migrations run at the end of that script.
5. **Migrate prints an error applying a file.** Leave that file applied-or-not alone. Fix the SQL, but if `_migrations` has no row for it, the transaction rolled back and the next build will retry the same file. Do not edit `0001`, `0002`, or `0003` after they have been applied to production. Add `0004_something.sql`.
6. **Sign-in says it is not turned on.** Remove `VITE_AUTH_ENABLED`, or set it to `true`, then redeploy. Locally, restart `npm run dev`. Refreshing the page is not enough.
7. **Google or X opens and then fails, or nothing happens.** The client id or secret is missing or belongs to another host. `BETTER_AUTH_URL` must be the exact origin in the address bar.
8. **Local sign-in says `Invalid origin`.** Use `http://localhost:8080` or `http://127.0.0.1:8080`, not a LAN hostname, unless you add that origin in `src/lib/auth/server.ts`.
9. **You are signed in but the seat list shows an error or stays empty after Add.** Open the network call for the seat action. `401` means the session was not sent. A database error in the server log means migrate did not see this database.
10. **A seat past the first 10 looks unpaid.** That is correct. There is no payment button yet.
11. **YashaFiness sends you to `/login`.** The studio requires a signed-in member. Wait for the account chip in the header before deciding sign-in failed.
12. **AI organization does nothing useful.** The app still sorts with rules. AI needs `XAI_API_KEY` and a signed-in caller. It sends file names and sizes, not file contents.

After a fix, redeploy and read the new build log before testing the domain. Changing an env var without a redeploy leaves the old value in the running build.
