import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { MEMBERSHIP, MEMBERS_HOST, PRODUCTS, PUBLIC_SITE } from "@/lib/loy/catalog";
import { addSeat, getMyMembership, listSeats, type MembershipState, type Seat } from "@/lib/loy/membership.functions";

export function MembersHome() {
  const user = useCurrentUser();
  const { isPending } = useCurrentUserState();
  const [membership, setMembership] = useState<MembershipState | null>(null);
  const [seats, setSeats] = useState<Seat[] | null>(null);
  const [email, setEmail] = useState("");
  const [seatError, setSeatError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user) {
      setMembership(null);
      setSeats(null);
      return;
    }
    let cancel = false;
    void getMyMembership()
      .then((row) => {
        if (!cancel) setMembership(row);
      })
      .catch(() => {
        if (!cancel) setMembership({ active: false, plan: null, since: null });
      });
    void listSeats()
      .then((rows) => {
        if (!cancel) setSeats(rows);
      })
      .catch(() => {
        if (!cancel) setSeats([]);
      });
    return () => {
      cancel = true;
    };
  }, [user]);

  const active = membership?.active === true;
  const includedUsed = (seats ?? []).filter((seat) => seat.kind === "included").length;
  const extraSeats = (seats ?? []).filter((seat) => seat.kind === "extra");
  const nextCosts = includedUsed >= MEMBERSHIP.includedExtraSeats;

  async function onAddSeat(event: FormEvent) {
    event.preventDefault();
    setSeatError("");
    setAdding(true);
    try {
      const result = await addSeat({ data: email });
      if (!result.ok) {
        setSeatError(result.error);
        return;
      }
      setSeats((current) => [...(current ?? []), result.seat]);
      setEmail("");
    } catch {
      setSeatError("That seat could not be saved.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="members">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg text-fg">
            <span className="grid size-8 place-items-center rounded-full bg-brass text-sm font-semibold text-brass-ink">L</span>
            Lamb of Yeshu
          </Link>
          <p className="hidden text-sm text-muted sm:block">Members</p>
          <Link to="/keys" className="text-sm text-brass">
            Keys
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {isPending ? <span className="size-8 animate-pulse rounded-full bg-raised" /> : null}
            <SignedOut>
              <Link to="/login" className="inline-flex min-h-11 items-center rounded-full bg-brass px-4 text-sm font-medium text-brass-ink">
                Sign in
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
        <section className="grid items-end gap-8 md:grid-cols-[1.4fr_0.8fr]">
          <div>
            <p className="text-sm font-medium tracking-wide text-brass">LOY Software</p>
            <h1 className="mt-2 font-display text-4xl text-fg md:text-5xl">One membership. The whole library.</h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Pay once. This site is the library. YashaFiness is the separate local app. Bring {MEMBERSHIP.includedExtraSeats} other people with you. This is the home that will live at {MEMBERS_HOST}.
            </p>
          </div>
          <aside className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-muted">{MEMBERSHIP.name}</p>
            <p className="mt-1 font-display text-4xl text-fg tabular-nums">
              ${MEMBERSHIP.price}
              <span className="ml-2 text-base text-muted">once</span>
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-fg">
              <li>Every app currently in the library</li>
              <li>Apps added later, without another fee</li>
              <li>
                You, plus {MEMBERSHIP.includedExtraSeats} memberships to give away
              </li>
              <li>${MEMBERSHIP.extraSeatPrice} once for each membership after those {MEMBERSHIP.includedExtraSeats}</li>
              <li>{MEMBERSHIP.refundDays}-day refund</li>
              <li>Your files stay on your machine</li>
            </ul>
            <p className="mt-4 text-sm text-muted">
              {active
                ? "This account has an active membership."
                : "Checkout starts when Stripe is connected on the member site. Nothing is charged in this preview."}
            </p>
          </aside>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-fg">Ten seats, then ${MEMBERSHIP.extraSeatPrice}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                The {MEMBERSHIP.includedExtraSeats} extra memberships are free with yours. Use them for a startup, a company, or friends who share the work. Each person after that is ${MEMBERSHIP.extraSeatPrice}, paid once, and gets the same library.
              </p>
            </div>
            <p className="text-sm tabular-nums text-fg">
              {includedUsed} of {MEMBERSHIP.includedExtraSeats} included
              {extraSeats.length > 0 ? ` · ${extraSeats.length} at $${MEMBERSHIP.extraSeatPrice}` : ""}
            </p>
          </div>

          <SignedOut>
            <p className="mt-4 text-sm text-muted">Sign in to keep the list of people on your membership.</p>
          </SignedOut>
          <SignedIn>
            <form onSubmit={onAddSeat} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="seat-email">Email</label>
              <input
                id="seat-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="min-h-11 flex-1 rounded-full border border-line bg-bg px-4 text-sm text-fg"
              />
              <button
                type="submit"
                disabled={adding}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-4 text-sm font-medium text-brass-ink disabled:opacity-60"
              >
                {adding ? "Saving" : nextCosts ? `Add for $${MEMBERSHIP.extraSeatPrice}` : "Add included seat"}
              </button>
            </form>
            {seatError ? <p className="mt-2 text-sm text-fg">{seatError}</p> : null}
            {seats && seats.length > 0 ? (
              <ul className="mt-4 divide-y divide-line">
                {seats.map((seat) => (
                  <li key={seat.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <span className="text-fg">{seat.email}</span>
                    <span className="text-muted">
                      {seat.kind === "included"
                        ? "Included. Turns on with your membership."
                        : `$${MEMBERSHIP.extraSeatPrice} due. Not active until that is paid.`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">No one else is on this membership yet.</p>
            )}
          </SignedIn>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl text-fg">Library</h2>
            <p className="text-sm text-muted">{user ? (user.displayName ?? "Signed in") : "Sign in to keep a member account"}</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {PRODUCTS.map((product) => (
              <li key={product.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-fg">{product.name}</h3>
                  <span className="rounded-full bg-raised px-3 py-1 text-xs font-medium text-brass">
                    {product.status === "included" ? "Included" : "Next"}
                  </span>
                </div>
                <p className="text-sm text-muted">{product.summary}</p>
                {product.status === "included" ? (
                  <p className="mt-auto text-sm text-muted">Separate app. It runs on your computer, not in this portal.</p>
                ) : (
                  <p className="mt-auto text-sm text-muted">Listed here when it ships.</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 rounded-2xl border border-line bg-raised p-5 md:grid-cols-3">
          <div>
            <h2 className="font-medium text-fg">What the fee covers</h2>
            <p className="mt-2 text-sm text-muted">
              Your access, plus {MEMBERSHIP.includedExtraSeats} memberships, for as long as LOY Software runs this library. Not a subscription.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-fg">What it does not do</h2>
            <p className="mt-2 text-sm text-muted">It does not upload your folders. The local organizer is YashaFiness, and it does not run on this site.</p>
          </div>
          <div>
            <h2 className="font-medium text-fg">Public site</h2>
            <p className="mt-2 text-sm text-muted">
              Company, portfolio, and contact stay on{" "}
              <a className="text-brass underline-offset-2 hover:underline" href={PUBLIC_SITE}>
                lambofyeshu.life
              </a>
              . Point {MEMBERS_HOST} at this portal when the subdomain is ready.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
