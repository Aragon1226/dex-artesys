import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import { z } from "zod";

const BodySchema = z.object({
  email: z.string().email().max(255),
});

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export const Route = createFileRoute("/api/public/admin/delete")({
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
          .select("id, custom_id, email")
          .ilike("email", parsed.email)
          .maybeSingle();

        if (lookupError) return Response.json({ error: lookupError.message }, { status: 500 });
        if (!account) return Response.json({ error: "Account not found" }, { status: 404 });

        // Protect the owner account (first issued admin id).
        if (account.custom_id === "CXPAD-001") {
          return Response.json({ error: "The owner account cannot be deleted" }, { status: 403 });
        }

        await supabaseAdmin.from("user_roles").delete().eq("user_id", account.id);
        const accountDelete = await supabaseAdmin
          .from("custom_accounts")
          .delete()
          .eq("id", account.id);
        if (accountDelete.error) {
          return Response.json({ error: accountDelete.error.message }, { status: 500 });
        }

        const authDelete = await supabaseAdmin.auth.admin.deleteUser(account.id);
        if (authDelete.error) {
          return Response.json({ error: authDelete.error.message }, { status: 500 });
        }

        return Response.json({ deleted: true, email: account.email, adminId: account.custom_id });
      },
    },
  },
});
