import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import { z } from "zod";

// Accept permissions either as a map ({ users: true }) or as a list of keys
// (["users", "kyc"]), since the admin portal sends both shapes.
const PermissionsSchema = z
  .union([z.record(z.string(), z.boolean()), z.array(z.string())])
  .optional()
  .transform((value) =>
    Array.isArray(value)
      ? Object.fromEntries(value.map((key) => [key, true]))
      : (value ?? undefined),
  );

const BodySchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  username: z.string().min(2).max(64),
  role: z.enum(["admin", "staff"]).default("admin"),
  permissions: PermissionsSchema,
  // Optional: referral/custom id of the admin who created this account.
  createdByAdminId: z.string().max(32).optional(),
});

const DEFAULT_PERMISSIONS = {
  dashboard: true,
  users: true,
  "financial-status": true,
  "deposit-requests": true,
  withdrawals: true,
  futures: true,
  kyc: true,
  wallets: true,
  "customer-service": true,
  support: true,
  administrator: true,
  "sample-tokens": true,
} as const;


function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function nextAdminId(existing: string[]) {
  let max = 0;
  for (const id of existing) {
    const m = /^CXPAD-0*(\d+)$/i.exec(id ?? "");
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `CXPAD-${String(max + 1).padStart(3, "0")}`;
}

export const Route = createFileRoute("/api/public/admin/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["ADMIN_BRIDGE_SECRET"];
        if (!secret) return new Response("Bridge not configured", { status: 503 });

        const auth = request.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        if (!token || !safeEqual(token, secret)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: existing } = await supabaseAdmin
          .from("custom_accounts")
          .select("custom_id, email");

        if ((existing ?? []).some((r) => r.email?.toLowerCase() === parsed.email.toLowerCase())) {
          return Response.json({ error: "Account already exists" }, { status: 409 });
        }

        const created = await supabaseAdmin.auth.admin.createUser({
          email: parsed.email,
          password: parsed.password,
          email_confirm: true,
          // `role` is what the signup trigger reads to flag the profile as an
          // admin — without it the new portal account lands as a normal user.
          user_metadata: {
            username: parsed.username,
            is_admin: parsed.role === "admin",
            role: parsed.role,
          },
        });
        if (created.error || !created.data.user) {
          return Response.json(
            { error: created.error?.message ?? "Could not create account" },
            { status: 400 },
          );
        }
        const userId = created.data.user.id;

        // A signup trigger already grants the default "user" role, so ignore
        // duplicates instead of failing the whole registration.
        const roleInsert = await supabaseAdmin.from("user_roles").upsert(
          { user_id: userId, role: parsed.role === "admin" ? "admin" : "user" },
          {
            onConflict: "user_id,role",
            ignoreDuplicates: true,
          },
        );

        if (roleInsert.error) {
          await supabaseAdmin.auth.admin.deleteUser(userId);
          return Response.json({ error: roleInsert.error.message }, { status: 500 });
        }

        const permissions = parsed.permissions ?? { ...DEFAULT_PERMISSIONS };
        const adminId = nextAdminId((existing ?? []).map((r) => r.custom_id));

        // `id` must match the auth user so referral scoping (which joins
        // custom_accounts.id to auth.uid()) resolves this admin.
        const accountInsert = await supabaseAdmin.from("custom_accounts").insert({
          id: userId,
          email: parsed.email,
          username: parsed.username,
          custom_id: adminId,
          role: parsed.role,
          permissions,
          created_by_admin_id: parsed.createdByAdminId ?? null,
        });
        if (accountInsert.error) {
          await supabaseAdmin.auth.admin.deleteUser(userId);
          return Response.json({ error: accountInsert.error.message }, { status: 500 });
        }

        // The signup trigger runs before this row exists, so mirror the portal
        // permissions onto the profile now.
        const profileUpdate = await supabaseAdmin
          .from("profiles")
          .update({
            is_admin: parsed.role === "admin",
            admin_permissions: permissions,
            username: parsed.username,
          })
          .eq("id", userId);

        if (profileUpdate.error) {
          await supabaseAdmin.from("custom_accounts").delete().eq("id", userId);
          await supabaseAdmin.auth.admin.deleteUser(userId);
          return Response.json({ error: profileUpdate.error.message }, { status: 500 });
        }

        const origin = new URL(request.url).origin;
        return Response.json({
          userId,
          adminId,
          email: parsed.email,
          role: parsed.role,
          permissions,
          referralCode: adminId,
          referralLink: `${origin}/auth?ref=${adminId}`,
        });
      },
    },
  },
});

