export type SecretWhen = "immediate" | "restart";

export type SecretField = {
  key: string;
  label: string;
  purpose: string;
  when: SecretWhen;
};

/** Keys a person may paste. Platform tokens are not in this list. */
export const SECRET_FIELDS: SecretField[] = [
  {
    key: "DATABASE_URL",
    label: "Database URL",
    purpose: "Postgres for memberships and seats. Without it, accounts live in a temporary embedded database.",
    when: "restart",
  },
  {
    key: "BETTER_AUTH_SECRET",
    label: "Session secret",
    purpose: "Signs member sessions. Changing it signs everyone out.",
    when: "restart",
  },
  {
    key: "BETTER_AUTH_URL",
    label: "Public site URL",
    purpose: "Origin only, such as https://members.lambofyeshu.life. No path and no trailing slash.",
    when: "restart",
  },
  {
    key: "GROK_AUTH_CLIENT_ID",
    label: "Sign-in client id",
    purpose: "Google and X. The private preview already has a client, so leave this blank there.",
    when: "restart",
  },
  {
    key: "GROK_AUTH_CLIENT_SECRET",
    label: "Sign-in client secret",
    purpose: "Matches the client id. Required on a public host. Not required in the private preview.",
    when: "restart",
  },
  {
    key: "GROK_AUTH_ISSUER",
    label: "Sign-in issuer",
    purpose: "Optional. Defaults to https://auth.grok.me.",
    when: "restart",
  },
];

export const SECRET_KEYS = new Set(SECRET_FIELDS.map((field) => field.key));

export type SecretSource = "host" | "pasted" | "missing";

export type SecretStatus = SecretField & {
  source: SecretSource;
  hint: string | null;
};
