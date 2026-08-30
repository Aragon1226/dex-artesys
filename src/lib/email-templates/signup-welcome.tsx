import React from 'react'
import { Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { APP_URL, EmailShell, StatusPill, text } from './shared-layout'
import { GOLD, MIDNIGHT, SURFACE } from './brand'

interface Props {
  name?: string
  appUrl?: string
}

const SignupWelcomeEmail = ({ name, appUrl }: Props) => {
  const base = appUrl || APP_URL
  return (
    <EmailShell
      preview="Your Artesys account is verified — start trading spot, futures and Earn."
      heading={name ? `Welcome, ${name}` : 'Welcome to Artesys'}
      ctaLabel="Open your dashboard"
      ctaHref={`${base}/app/home`}
      footerNote="You're receiving this because you just verified your Artesys account."
    >
      <StatusPill label="Account verified" tone="success" />
      <Text style={text}>
        Your email is verified and your account is live. You now have access to spot trading,
        futures, and Earn — all from one portfolio.
      </Text>

      <Section style={card}>
        <Text style={cardTitle}>First steps</Text>
        <Text style={bullet}>1. Fund your account from Assets → Deposit.</Text>
        <Text style={bullet}>2. Place your first spot order on a live market.</Text>
        <Text style={bullet}>3. Stake idle balances in Earn to collect yield.</Text>
      </Section>
    </EmailShell>
  )
}

export const template = {
  component: SignupWelcomeEmail,
  subject: 'Welcome to Artesys — your account is verified',
  displayName: 'Sign-up welcome',
  previewData: { name: 'Aung', appUrl: APP_URL },
} satisfies TemplateEntry

const card = {
  backgroundColor: SURFACE,
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: '10px',
  padding: '18px 20px',
  margin: '14px 0 0',
}

const cardTitle = { margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: MIDNIGHT }

const bullet = { margin: '0 0 6px', fontSize: '14px', lineHeight: '1.55', color: '#33445C' }
