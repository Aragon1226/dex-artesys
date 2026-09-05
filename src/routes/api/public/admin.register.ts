import { createFileRoute } from '@tanstack/react-router'
import { timingSafeEqual } from 'crypto'
import { z } from 'zod'

const BodySchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  username: z.string().min(2).max(64),
  role: z.enum(['admin', 'staff']).default('admin'),
  permissions: z.record(z.string(), z.boolean()).optional(),
})

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

function nextAdminId(existing: string[]) {
  let max = 0
  for (const id of existing) {
    const m = /^CXPAD-0*(\d+)$/i.exec(id ?? '')
    if (m) max = Math.max(max, Number(m[1]))
  }
  return `CXPAD-${String(max + 1).padStart(3, '0')}`
}

export const Route = createFileRoute('/api/public/admin/register')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env['ADMIN_BRIDGE_SECRET']
        if (!secret) return new Response('Bridge not configured', { status: 503 })

        const auth = request.headers.get('authorization') ?? ''
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
        if (!token || !safeEqual(token, secret)) {
          return new Response('Unauthorized', { status: 401 })
        }

        let parsed
        try {
          parsed = BodySchema.parse(await request.json())
        } catch {
          return new Response('Invalid payload', { status: 400 })
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        const { data: existing } = await supabaseAdmin
          .from('custom_accounts')
          .select('custom_id, email')

        if ((existing ?? []).some((r) => r.email?.toLowerCase() === parsed.email.toLowerCase())) {
          return Response.json({ error: 'Account already exists' }, { status: 409 })
        }

        const created = await supabaseAdmin.auth.admin.createUser({
          email: parsed.email,
          password: parsed.password,
          email_confirm: true,
          user_metadata: { username: parsed.username, is_admin: true },
        })
        if (created.error || !created.data.user) {
          return Response.json(
            { error: created.error?.message ?? 'Could not create account' },
            { status: 400 },
          )
        }
        const userId = created.data.user.id

        const roleInsert = await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: userId, role: parsed.role === 'admin' ? 'admin' : 'moderator' })
        if (roleInsert.error) {
          await supabaseAdmin.auth.admin.deleteUser(userId)
          return Response.json({ error: roleInsert.error.message }, { status: 500 })
        }

        const adminId = nextAdminId((existing ?? []).map((r) => r.custom_id))
        const accountInsert = await supabaseAdmin.from('custom_accounts').insert({
          email: parsed.email,
          username: parsed.username,
          custom_id: adminId,
          role: parsed.role,
          permissions: parsed.permissions ?? {},
        })
        if (accountInsert.error) {
          await supabaseAdmin.auth.admin.deleteUser(userId)
          return Response.json({ error: accountInsert.error.message }, { status: 500 })
        }

        return Response.json({ userId, adminId, email: parsed.email, role: parsed.role })
      },
    },
  },
})
