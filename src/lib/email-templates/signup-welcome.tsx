import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  appUrl?: string
}

const BLUE = '#1E5FD8'
const MIDNIGHT = '#061428'
const GOLD = '#E6B34A'

const SignupWelcomeEmail = ({ name, appUrl }: Props) => {
  const base = appUrl || 'https://cex.xn--artsys-dva.com'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your Artesys account is verified — start trading spot, futures and Earn.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>ARTESYS</Text>
            <Text style={brandSub}>Crypto Exchange</Text>
          </Section>

          <Heading style={h1}>{name ? `Welcome, ${name}` : 'Welcome to Artesys'}</Heading>
          <Text style={text}>
            Your email is verified and your account is live. You now have access to spot trading,
            futures, and Earn — all from one portfolio.
          </Text>

          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={`${base}/app/home`} style={button}>
              Open your dashboard
            </Button>
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>First steps</Text>
            <Text style={bullet}>1. Fund your account from Assets → Deposit.</Text>
            <Text style={bullet}>2. Place your first spot order on a live market.</Text>
            <Text style={bullet}>3. Stake idle balances in Earn to collect yield.</Text>
          </Section>

          <Hr style={hr} />
          <Text style={muted}>
            Need a hand? Visit the{' '}
            <Link href={`${base}/faq`} style={link}>
              help centre
            </Link>{' '}
            or reply to this email. Never share your password or verification codes with anyone.
          </Text>
          <Text style={muted}>Artesys — trade with clarity.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SignupWelcomeEmail,
  subject: 'Welcome to Artesys — your account is verified',
  displayName: 'Sign-up welcome',
  previewData: { name: 'Aung', appUrl: 'https://cex.xn--artsys-dva.com' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Helvetica, Arial, sans-serif",
  color: MIDNIGHT,
}

const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }

const header = { paddingBottom: '20px' }

const brand = {
  margin: '0',
  fontSize: '20px',
  letterSpacing: '4px',
  fontWeight: 700,
  color: BLUE,
}

const brandSub = {
  margin: '2px 0 0',
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: '#6B7A90',
}

const h1 = { fontSize: '26px', lineHeight: '1.25', margin: '8px 0 12px', color: MIDNIGHT }

const text = { fontSize: '15px', lineHeight: '1.65', color: '#33445C', margin: '0 0 8px' }

const button = {
  backgroundColor: BLUE,
  color: '#ffffff',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: 700,
  padding: '13px 26px',
  textDecoration: 'none',
  display: 'inline-block',
}

const card = {
  backgroundColor: '#F4F7FC',
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: '10px',
  padding: '18px 20px',
}

const cardTitle = { margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: MIDNIGHT }

const bullet = { margin: '0 0 6px', fontSize: '14px', lineHeight: '1.55', color: '#33445C' }

const hr = { borderColor: '#E3E9F2', margin: '28px 0 18px' }

const muted = { fontSize: '12px', lineHeight: '1.6', color: '#6B7A90', margin: '0 0 6px' }

const link = { color: BLUE }
