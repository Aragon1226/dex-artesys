import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import { z } from "zod";

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
  newEmail: z.string().email().max(255).optional(),
  password: z.string().min(8).max(128).optional(),
  username: z.string().min(2).max(64).optional(),
  role: z.enum(["admin", "staff"]).optional(),
  permissions: PermissionsSchema,
});

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export const Route = createFileRoute("/api/public/admin/update")({
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

        const { data: account, error: lookupError } = await supabaseAdmin
          .from("custom_accounts")
          .select("id, custom_id, email, username, role, permissions")
          .ilike("email", parsed.email)
          .maybeSingle();

        if (lookupError) return Response.json({ error: lookupError.message }, { status: 500 });
        if (!account) return Response.json({ error: "Account not found" }, { status: 404 });

        const userId = account.id;
        const role = parsed.role ?? account.role;
        const username = parsed.username ?? account.username;
        const permissions =
          parsed.permissions ?? (account.permissions as Record<string, boolean> | null) ?? {};

        // Auth-side changes (credentials, email, metadata)
        const authUpdate: Record<string, unknown> = {
          user_metadata: { username, is_admin: role === "admin", role },
        };
        if (parsed.newEmail) {
          authUpdate["email"] = parsed.newEmail;
          authUpdate["email_confirm"] = true;
        }
        if (parsed.password) authUpdate["password"] = parsed.password;

        const authResult = await supabaseAdmin.auth.admin.updateUserById(userId, authUpdate);
        if (authResult.error) {
          return Response.json({ error: authResult.error.message }, { status: 400 });
        }

        const accountUpdate = await supabaseAdmin
          .from("custom_accounts")
          .update({
            email: parsed.newEmail ?? account.email,
            username,
            role,
            permissions,
          })
          .eq("id", userId);
        if (accountUpdate.error) {
          return Response.json({ error: accountUpdate.error.message }, { status: 500 });
        }

        const profileUpdate = await supabaseAdmin
          .from("profiles")
          .update({
            email: parsed.newEmail ?? account.email,
            username,
            is_admin: role === "admin",
            admin_permissions: permissions,
          })
          .eq("id", userId);
        if (profileUpdate.error) {
          return Response.json({ error: profileUpdate.error.message }, { status: 500 });
        }

        if (role === "admin") {
          await supabaseAdmin
            .from("user_roles")
            .upsert(
              { user_id: userId, role: "admin" },
              { onConflict: "user_id,role", ignoreDuplicates: true },
            );
        } else {
          await supabaseAdmin.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        }

        const origin = new URL(request.url).origin;
        return Response.json({
          userId,
          adminId: account.custom_id,
          email: parsed.newEmail ?? account.email,
          username,
          role,
          permissions,
          referralCode: account.custom_id,
          referralLink: `${origin}/auth?ref=${account.custom_id}`,
        });
      },
    },
  },
});
