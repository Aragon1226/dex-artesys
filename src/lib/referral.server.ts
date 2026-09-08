import type { SupabaseClient } from "@supabase/supabase-js";

export interface ReferralClaimResult {
  referredByAdminId: string | null;
  claimed: boolean;
}

/**
 * Attributes the signed-in account to the admin who issued the referral code.
 * Runs with service-role privileges so attribution never depends on the
 * browser keeping the code, and never overwrites an existing attribution.
 */
export async function claimReferralForUser(
  userId: string,
  email: string | null,
  code: string | null,
): Promise<ReferralClaimResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const admin = supabaseAdmin as SupabaseClient;
  const normalizedEmail = (email ?? "").toLowerCase().trim();

  const { data: existing } = await admin
    .from("user_referrals")
    .select("id, user_id, user_email, referred_by_admin_id")
    .or(
      normalizedEmail
        ? `user_id.eq.${userId},user_email.eq.${normalizedEmail}`
        : `user_id.eq.${userId}`,
    )
    .limit(1)
    .maybeSingle();

  if (existing?.referred_by_admin_id) {
    // Backfill the user id when the row was created from an email-only invite.
    if (!existing.user_id) {
      await admin.from("user_referrals").update({ user_id: userId }).eq("id", existing.id);
    }
    return { referredByAdminId: existing.referred_by_admin_id, claimed: false };
  }

  const trimmedCode = (code ?? "").trim();
  if (!trimmedCode) return { referredByAdminId: null, claimed: false };

  const { data: resolved, error: resolveError } = await admin.rpc("resolve_referral_admin_id", {
    p_code: trimmedCode,
  });
  if (resolveError) throw resolveError;

  const adminId = typeof resolved === "string" ? resolved : null;
  if (!adminId) return { referredByAdminId: null, claimed: false };

  // Only accept codes that belong to a real admin account.
  const { data: adminAccount } = await admin
    .from("custom_accounts")
    .select("custom_id")
    .eq("custom_id", adminId)
    .maybeSingle();
  if (!adminAccount) return { referredByAdminId: null, claimed: false };

  if (existing?.id) {
    await admin
      .from("user_referrals")
      .update({ user_id: userId, referred_by_admin_id: adminId })
      .eq("id", existing.id);
  } else {
    await admin.from("user_referrals").insert({
      user_id: userId,
      user_email: normalizedEmail,
      referred_by_admin_id: adminId,
    });
  }

  return { referredByAdminId: adminId, claimed: true };
}
