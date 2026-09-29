import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { MEMBERSHIP } from "@/lib/loy/catalog";

export type MembershipState = {
  active: boolean;
  plan: string | null;
  since: string | null;
};

export type SeatKind = "included" | "extra";

export type Seat = {
  id: string;
  email: string;
  kind: SeatKind;
  createdAt: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getMyMembership = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MembershipState> => {
    const sql = await getSql();
    const rows = await sql<{ plan: string; status: string; created_at: string | Date }>`
      select plan, status, created_at
      from loy_memberships
      where user_id = ${context.userId}
    `;
    const row = rows[0];
    if (!row || row.status !== "active") return { active: false, plan: null, since: null };
    return { active: true, plan: row.plan, since: new Date(row.created_at).toISOString() };
  });

export const listSeats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Seat[]> => {
    const sql = await getSql();
    const rows = await sql<{ id: string; email: string; kind: string; created_at: string | Date }>`
      select id, email, kind, created_at
      from loy_seats
      where owner_user_id = ${context.userId}
      order by created_at asc
    `;
    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      kind: row.kind === "extra" ? "extra" : "included",
      createdAt: new Date(row.created_at).toISOString(),
    }));
  });

export const addSeat = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const email = String(input ?? "").trim().toLowerCase();
    if (!emailPattern.test(email) || email.length > 180) throw new Error("Enter a valid email.");
    return email;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data: email }): Promise<{ ok: true; seat: Seat } | { ok: false; error: string }> => {
    const sql = await getSql();
    const existing = await sql<{ id: string }>`
      select id from loy_seats where owner_user_id = ${context.userId} and email = ${email}
    `;
    if (existing.length > 0) return { ok: false, error: "That person is already on your list." };
    const counted = await sql<{ n: string | number }>`
      select count(*) as n from loy_seats where owner_user_id = ${context.userId}
    `;
    const used = Number(counted[0]?.n ?? 0);
    if (used >= 100) return { ok: false, error: "This list is full." };
    const kind: SeatKind = used < MEMBERSHIP.includedExtraSeats ? "included" : "extra";
    const id = crypto.randomUUID();
    await sql`
      insert into loy_seats (id, owner_user_id, email, kind)
      values (${id}, ${context.userId}, ${email}, ${kind})
    `;
    return { ok: true, seat: { id, email, kind, createdAt: new Date().toISOString() } };
  });
