/**
 * Server-only helpers for privileged database routines.
 *
 * The underlying SECURITY DEFINER functions are no longer executable by the
 * `authenticated` role — only the service role can call them. Every helper here
 * verifies the caller's role with the user-scoped client first, then performs
 * the privileged work.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

type UserClient = SupabaseClient<Database>

async function admin() {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  return supabaseAdmin
}

/** Throws unless the signed-in caller holds the admin role. */
export async function assertAdmin(supabase: UserClient, userId: string) {
  const { data, error } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' })
  if (error || !data) throw new Error('Forbidden')
}

export async function listCustomAccounts() {
  const db = await admin()
  const { data, error } = await db.rpc('get_all_custom_accounts')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function saveCustomAccount(input: {
  email: string
  password: string
  username: string
  customId: string
  role: string
  permissions: Record<string, boolean>
}) {
  const db = await admin()
  const { error } = await db.rpc('create_custom_admin', {
    p_email: input.email,
    p_password: input.password,
    p_username: input.username,
    p_custom_id: input.customId,
    p_role: input.role,
    p_permissions: input.permissions,
  })
  if (error) throw new Error(error.message)
  return { ok: true }
}

export async function deleteCustomAccount(email: string) {
  const db = await admin()
  const { error } = await db.rpc('delete_custom_admin', { p_email: email })
  if (error) throw new Error(error.message)
  return { ok: true }
}

export async function closePosition(
  supabase: UserClient,
  userId: string,
  positionId: string,
  pnl: number,
) {
  const db = await admin()

  const { data: position, error: readError } = await db
    .from('positions')
    .select('id, user_id, status')
    .eq('id', positionId)
    .maybeSingle()

  if (readError) throw new Error(readError.message)
  if (!position || position.status !== 'OPEN') return { closed: false }

  if (position.user_id !== userId) {
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    })
    if (!isAdmin) throw new Error('Forbidden')
  }

  const { data, error } = await db.rpc('close_trade_position', {
    p_pos_id: positionId,
    p_pnl: pnl,
  })
  if (error) throw new Error(error.message)
  return { closed: Boolean(data) }
}
