# LOY membership prototype

Prototype for `members.lambofyeshu.life`. The public marketing site stays at the repo root. This folder is the member portal only.

## Offer

- LOY Membership, $79 once. Not a subscription.
- Covers the library now and apps added later.
- Access lasts as long as LOY Software runs the library.
- 14-day refund.
- Includes the buyer plus 10 extra memberships.
- Each membership after those 10 is $25, once.
- Seats are for a startup, a company, or friends who share the work.
- Files stay on the member's machine.

## What works in this prototype

- Offer page, sign-in (Google or X), and a seat list saved to the account.
- Included seats turn on when the buyer's membership is active.
- Seats after the 10 are marked $25 due and are not active until that is paid.
- No card is charged. Stripe is not connected. No invite email is sent.
- YashaFiness opens from the library for a signed-in account.

## Run

```bash
cd members
npm install
npm run dev
```

Copy to polish lives in `src/lib/loy/catalog.ts` and `src/components/loy/MembersHome.tsx`.
