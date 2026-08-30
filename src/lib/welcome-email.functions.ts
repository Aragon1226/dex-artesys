import { createServerFn } from '@tanstack/react-start'

import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/**
 * Sends the sign-up welcome email to the authenticated caller, but only once
 * their email address is verified. Deduped server-side by idempotency key, so
 * repeat calls never produce a second email.
 */
export const sendWelcomeEmail = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { dispatchWelcomeEmail } = await import('@/lib/welcome-email.server')
    return dispatchWelcomeEmail(context.userId, context.claims as Record<string, unknown>)
  })
