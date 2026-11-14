import type { SupabaseClient } from "@supabase/supabase-js";

const GLOBAL_SUPPORT_ROW_EMAIL = "global_support_configs@crypxpro.com";

export interface SupportContact {
  email: string;
  telegram: string;
  whatsapp: string;
}

async function getAdminClient(): Promise<SupabaseClient> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as SupabaseClient;
}

/** Returns the admin id the signed-in client was referred by, if any. */
async function resolveReferringAdminId(
  admin: SupabaseClient,
  userId: string,
  email: string | null,
): Promise<string | null> {
  const normalizedEmail = (email ?? "").toLowerCase().trim();
  const filter = normalizedEmail
    ? `user_id.eq.${userId},user_email.eq.${normalizedEmail}`
    : `user_id.eq.${userId}`;
  const { data } = await admin
    .from("user_referrals")
    .select("referred_by_admin_id")
    .or(filter)
    .limit(1)
    .maybeSingle();
  const adminId: unknown = data?.referred_by_admin_id;
  return typeof adminId === "string" && adminId ? adminId : null;
}

/**
 * Looks up the single deposit address the caller should use: the referring
 * admin's own address first, then the platform default. Only one address is
 * returned, so clients never receive the full wallet tables.
 */
export async function getDepositAddressForUser(
  userId: string,
  email: string | null,
  symbol: string,
  network: string,
): Promise<string | null> {
  const admin = await getAdminClient();
  const adminId = await resolveReferringAdminId(admin, userId, email);

  if (adminId) {
    const { data: custom } = await admin
      .from("admin_wallet_configs")
      .select("address")
      .eq("admin_id", adminId)
      .eq("symbol", symbol.toUpperCase())
      .eq("network", network.toUpperCase())
      .maybeSingle();
    const customAddress: unknown = custom?.address;
    if (typeof customAddress === "string" && customAddress.trim()) return customAddress;
  }

  const { data: fallback } = await admin
    .from("admin_wallets")
    .select("address")
    .eq("symbol", symbol)
    .eq("network", network)
    .maybeSingle();
  const fallbackAddress: unknown = fallback?.address;
  return typeof fallbackAddress === "string" && fallbackAddress.trim() ? fallbackAddress : null;
}

function toSupportContact(value: unknown): SupportContact | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const read = (key: string): string => (typeof record[key] === "string" ? record[key] : "");
  return { email: read("email"), telegram: read("telegram"), whatsapp: read("whatsapp") };
}

/**
 * Returns only the support contact that belongs to the caller's admin (or the
 * platform default), never the other admins' contact details.
 */
export async function getSupportContactForUser(
  userId: string,
  email: string | null,
): Promise<SupportContact | null> {
  const admin = await getAdminClient();
  const assignedAdminId = (await resolveReferringAdminId(admin, userId, email)) ?? "OWNER";

  const { data: rows } = await admin.from("support_config").select("email, telegram, whatsapp");
  if (!rows || rows.length === 0) return null;

  const globalRow = rows.find((row) => row.email === GLOBAL_SUPPORT_ROW_EMAIL);
  if (globalRow?.telegram) {
    try {
      const configs: unknown = JSON.parse(globalRow.telegram);
      if (configs && typeof configs === "object") {
        const match = toSupportContact((configs as Record<string, unknown>)[assignedAdminId]);
        if (match) return match;
      }
    } catch {
      // Malformed map: fall back to the default row below.
    }
  }

  const defaultRow = rows.find((row) => row.email !== GLOBAL_SUPPORT_ROW_EMAIL) ?? null;
  return toSupportContact(defaultRow);
}
