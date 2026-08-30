import * as React from 'react'
import { Column, Hr, Img, Link, Row, Section, Text } from '@react-email/components'

/**
 * Artesys email brand presets — the single source of truth for colours,
 * typography, graphics and the header/footer chrome used by every template
 * (auth emails and transactional emails alike).
 */

export const APP_URL = 'https://xn--artsys-dva.com'
export const LOGO_URL = `${APP_URL}/email/logo-mark.png`

// Palette
export const BLUE = '#1E5FD8'
export const BLUE_DEEP = '#123F9B'
export const MIDNIGHT = '#061428'
export const GOLD = '#E6B34A'
export const SUCCESS = '#16A34A'
export const WARNING = '#D97706'
export const DANGER = '#DC2626'
export const BODY_TEXT = '#33445C'
export const MUTED_TEXT = '#6B7A90'
export const SURFACE = '#F4F7FC'
export const BORDER = '#E3E9F2'

// Typography / layout presets
export const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Helvetica, Arial, sans-serif",
  color: MIDNIGHT,
}
export const container = { padding: '28px 28px 32px', maxWidth: '600px', margin: '0 auto' }
export const h1 = { fontSize: '25px', lineHeight: '1.25', margin: '18px 0 12px', color: MIDNIGHT }
export const text = { fontSize: '15px', lineHeight: '1.65', color: BODY_TEXT, margin: '0 0 12px' }
export const muted = { fontSize: '12px', lineHeight: '1.6', color: MUTED_TEXT, margin: '0 0 6px' }
export const link = { color: BLUE, textDecoration: 'underline' }
export const hr = { borderColor: BORDER, margin: '28px 0 16px' }

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

export const codeStyle = {
  fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
  fontSize: '30px',
  fontWeight: 700,
  letterSpacing: '8px',
  color: MIDNIGHT,
  backgroundColor: SURFACE,
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: '10px',
  padding: '18px 20px',
  margin: '4px 0 18px',
  textAlign: 'center' as const,
}

export const urlNote = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: MUTED_TEXT,
  wordBreak: 'break-all' as const,
  margin: '0 0 6px',
}

// Rendered as a text child, which React may HTML-escape: keep this CSS free of >, &, and quotes.
export const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #E6B34A !important; color: #061428 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #E6B34A !important; color: #061428 !important; }
  [data-ogsb] .dm-btn { background-color: #E6B34A !important; color: #061428 !important; }
`

/** Thin brand rule: blue-to-gold gradient hairline with a solid fallback. */
export const AccentBar = () => (
  <Section
    style={{
      height: '4px',
      lineHeight: '4px',
      fontSize: '1px',
      borderRadius: '4px',
      backgroundColor: BLUE,
      backgroundImage: `linear-gradient(90deg, ${BLUE_DEEP} 0%, ${BLUE} 45%, ${GOLD} 100%)`,
      margin: '0 0 18px',
    }}
  >
    &nbsp;
  </Section>
)

const brandName = {
  margin: '0',
  fontSize: '19px',
  letterSpacing: '4px',
  fontWeight: 700,
  color: BLUE,
  lineHeight: '1.1',
}
const brandSub = {
  margin: '3px 0 0',
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: MUTED_TEXT,
}

/** Logo mark + wordmark, followed by the gradient accent bar. */
export const BrandHeader = ({ tagline = 'Crypto Exchange' }: { tagline?: string }) => (
  <>
    <Section style={{ paddingBottom: '18px' }}>
      <Row>
        <Column style={{ width: '52px', verticalAlign: 'middle' }}>
          <Link href={APP_URL}>
            <Img
              src={LOGO_URL}
              width="42"
              height="41"
              alt="Artesys"
              style={{ display: 'block', border: '0' }}
            />
          </Link>
        </Column>
        <Column style={{ verticalAlign: 'middle' }}>
          <Text style={brandName}>ARTESYS</Text>
          <Text style={brandSub}>{tagline}</Text>
        </Column>
      </Row>
    </Section>
    <AccentBar />
  </>
)

const footerLink = { color: MUTED_TEXT, textDecoration: 'none', fontSize: '12px' }

/** Shared legal/help footer with brand links. */
export const BrandFooter = ({ note }: { note?: string }) => (
  <>
    <Hr style={hr} />
    {note ? <Text style={muted}>{note}</Text> : null}
    <Text style={muted}>
      Artesys staff will never ask for your password, recovery link, or verification code.
    </Text>
    <Text style={{ ...muted, margin: '10px 0 4px' }}>
      <Link href={`${APP_URL}/faq`} style={footerLink}>
        Help centre
      </Link>
      {'  ·  '}
      <Link href={`${APP_URL}/terms`} style={footerLink}>
        Terms
      </Link>
      {'  ·  '}
      <Link href={`${APP_URL}/policies`} style={footerLink}>
        Privacy
      </Link>
      {'  ·  '}
      <Link href={`${APP_URL}/app/settings`} style={footerLink}>
        Email settings
      </Link>
    </Text>
    <Text style={{ ...muted, color: '#8A96A8' }}>
      Artesys — trade with clarity. Trading digital assets involves risk; never invest more than you
      can afford to lose.
    </Text>
  </>
)

export interface DetailRow {
  label: string
  value: string
}

const card = {
  backgroundColor: SURFACE,
  borderRadius: '10px',
  padding: '16px 20px',
  margin: '8px 0 4px',
}
const rowLabel = {
  fontSize: '11px',
  color: MUTED_TEXT,
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}
const rowValue = { fontSize: '15px', color: MIDNIGHT, fontWeight: 700, margin: '2px 0 0' }

/** Key/value summary card used by transactional emails. */
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

/** Small status pill — presets keyed to semantic states. */
export const StatusPill = ({
  label,
  tone = 'info',
}: {
  label: string
  tone?: 'info' | 'success' | 'warning' | 'danger'
}) => {
  const tones = {
    info: { bg: '#E7EEFB', fg: BLUE_DEEP },
    success: { bg: '#E6F6EC', fg: '#12703A' },
    warning: { bg: '#FDF2E0', fg: '#8A5307' },
    danger: { bg: '#FDECEC', fg: '#9B1C1C' },
  }[tone]
  return (
    <Text
      style={{
        display: 'inline-block',
        margin: '0 0 12px',
        padding: '5px 12px',
        borderRadius: '999px',
        backgroundColor: tones.bg,
        color: tones.fg,
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
  )
}
