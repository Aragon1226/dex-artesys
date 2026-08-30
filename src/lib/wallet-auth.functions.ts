import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

const addressInput = z.object({
  address: z.string().min(10).max(64),
  chain: z.string().min(2).max(24).optional(),
})

const signatureInput = addressInput.extend({
  signature: z.string().min(10).max(512),
})

/** Issues the one-time message the wallet must sign. */
export const requestWalletChallenge = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => addressInput.parse(input))
  .handler(async ({ data }) => {
    const { createChallenge } = await import('@/lib/wallet-auth.server')
    return createChallenge(data.address, 'xn--artsys-dva.com')
  })

/** Verifies the signature and returns a one-time token the client exchanges for a session. */
export const verifyWalletSignature = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => signatureInput.parse(input))
  .handler(async ({ data }) => {
    const { consumeChallenge, signInWithVerifiedWallet } = await import(
      '@/lib/wallet-auth.server'
    )
    const address = await consumeChallenge(data.address, data.signature)
    return signInWithVerifiedWallet(address, data.chain ?? 'evm')
  })

/** Links a verified wallet to the signed-in account. */
export const linkWallet = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => signatureInput.parse(input))
  .handler(async ({ data, context }) => {
    const { consumeChallenge, linkVerifiedWallet } = await import('@/lib/wallet-auth.server')
    const address = await consumeChallenge(data.address, data.signature)
    return linkVerifiedWallet(context.userId, address, data.chain ?? 'evm')
  })
