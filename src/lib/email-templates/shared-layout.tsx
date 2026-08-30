import React from 'react'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

export const BLUE = '#1E5FD8'
export const MIDNIGHT = '#061428'
export const GOLD = '#E6B34A'
export const APP_URL = 'https://cex.xn--artsys-dva.com'

export const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Helvetica, Arial, sans-serif",
  color: MIDNIGHT,
}
export const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
export const h1 = { fontSize: '25px', lineHeight: '1.25', margin: '8px 0 12px', color: MIDNIGHT }
export const text = { fontSize: '15px', lineHeight: '1.65', color: '#33445C', margin: '0 0 10px' }
export const muted = { fontSize: '12px', lineHeight: '1.6', color: '#6B7A90', margin: '0 0 6px' }
export const link = { color: BLUE }
export const hr = { borderColor: '#E3E9F2', margin: '28px 0 18px' }

export const button = {
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
  borderRadius: '10px',
  padding: '16px 20px',
  margin: '8px 0 4px',
}

const rowLabel = {
  fontSize: '12px',
  color: '#6B7A90',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}
const rowValue = { fontSize: '15px', color: MIDNIGHT, fontWeight: 700, margin: '2px 0 0' }

const brandRow = { paddingBottom: '18px' }
const brand = { margin: '0', fontSize: '20px', letterSpacing: '4px', fontWeight: 700, color: BLUE }
const brandSub = {
  margin: '2px 0 0',
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: '#6B7A90',
}

export interface DetailRow {
  label: string
  value: string
}

export const DetailCard = ({ rows, accent }: { rows: DetailRow[]; accent?: string }) => (
  <Section style={{ ...card, borderLeft: `3px solid ${accent || GOLD}` }}>
    {rows.map((r) => (
      <Row key={r.label} style={{ marginBottom: '8px' }}>
        <Column>
          <Text style={rowLabel}>{r.label}</Text>
          <Text style={rowValue}>{r.value}</Text>
        </Column>
      </Row>
    ))}
  </Section>
)

interface ShellProps {
  preview: string
  heading: string
  children: React.ReactNode
  ctaLabel?: string
  ctaHref?: string
  footerNote?: string
}

export const EmailShell = ({
  preview,
  heading,
  children,
  ctaLabel,
  ctaHref,
  footerNote,
}: ShellProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandRow}>
          <Text style={brand}>ARTESYS</Text>
          <Text style={brandSub}>Crypto Exchange</Text>
        </Section>

        <Heading style={h1}>{heading}</Heading>
        {children}

        {ctaLabel && ctaHref ? (
          <Section style={{ textAlign: 'center', margin: '26px 0 6px' }}>
            <Button href={ctaHref} style={button}>
              {ctaLabel}
            </Button>
          </Section>
        ) : null}

        <Hr style={hr} />
        {footerNote ? <Text style={muted}>{footerNote}</Text> : null}
        <Text style={muted}>
          Questions? Visit the{' '}
          <Link href={`${APP_URL}/faq`} style={link}>
            help centre
          </Link>
          . Artesys staff will never ask for your password or verification codes.
        </Text>
        <Text style={muted}>Artesys — trade with clarity.</Text>
      </Container>
    </Body>
  </Html>
)
