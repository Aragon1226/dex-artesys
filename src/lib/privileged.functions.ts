import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/** Lists every custom admin/staff account. Admin only. */
export const adminListCustomAccounts = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin, listCustomAccounts } = await import('@/lib/privileged.server')
    await assertAdmin(context.supabase, context.userId)
    return listCustomAccounts()
  })

/** Creates (or updates) a custom admin/staff account. Admin only. */
export const adminSaveCustomAccount = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().max(200).default(''),
        username: z.string().min(1).max(120),
        customId: z.string().min(1).max(120),
        role: z.enum(['admin', 'staff']),
        permissions: z.record(z.string(), z.boolean()).default({}),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin, saveCustomAccount } = await import('@/lib/privileged.server')
    await assertAdmin(context.supabase, context.userId)
    return saveCustomAccount(data)
  })

/** Deletes a custom admin/staff account and its auth user. Admin only. */
export const adminDeleteCustomAccount = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ email: z.string().email() }).parse(input))
  .handler(async ({ data, context }) => {
    const { assertAdmin, deleteCustomAccount } = await import('@/lib/privileged.server')
    await assertAdmin(context.supabase, context.userId)
    return deleteCustomAccount(data.email)
  })

/** Settles a futures position. Callable by the position owner or an admin. */
export const closeFuturesPosition = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ positionId: z.string().uuid(), pnl: z.number().finite() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { closePosition } = await import('@/lib/privileged.server')
    return closePosition(context.supabase, context.userId, data.positionId, data.pnl)
  })
