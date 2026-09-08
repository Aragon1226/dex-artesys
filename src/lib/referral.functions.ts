import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const claimSchema = z.object({
  code: z.string().trim().max(64).optional(),
});

/**
 * Links the signed-in account to the admin behind a referral code.
 * Works for every sign-up path (email, Google, Apple, wallet) because the
 * attribution is written server-side, not from the browser.
 */
export const claimReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => claimSchema.parse(data ?? {}))
  .handler(async ({ data, context }) => {
    const { claimReferralForUser } = await import("@/lib/referral.server");
    const claims = context.claims as { email?: string } | undefined;
    return claimReferralForUser(context.userId, claims?.email ?? null, data.code ?? null);
  });
