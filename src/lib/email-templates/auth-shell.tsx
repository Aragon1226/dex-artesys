import * as React from 'react'
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

export const BLUE = '#1E5FD8'
export const MIDNIGHT = '#061428'
export const GOLD = '#E6B34A'

export const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Helvetica, Arial, sans-serif",
  color: MIDNIGHT,
}
export const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
export const h1 = { fontSize: '25px', lineHeight: '1.25', margin: '8px 0 14px', color: MIDNIGHT }
export const text = { fontSize: '15px', lineHeight: '1.65', color: '#33445C', margin: '0 0 12px' }
export const muted = { fontSize: '12px', lineHeight: '1.6', color: '#6B7A90', margin: '0 0 6px' }
export const link = { color: BLUE, textDecoration: 'underline' }
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
export const codeStyle = {
  fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
  fontSize: '30px',
  fontWeight: 700,
  letterSpacing: '8px',
  color: MIDNIGHT,
  backgroundColor: '#F4F7FC',
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: '10px',
  padding: '18px 20px',
  margin: '4px 0 18px',
  textAlign: 'center' as const,
}
export const urlNote = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#6B7A90',
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

const brandRow = { paddingBottom: '18px' }
const brand = { margin: '0', fontSize: '20px', letterSpacing: '4px', fontWeight: 700, color: BLUE }
const brandSub = {
  margin: '2px 0 0',
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: '#6B7A90',
}

interface AuthShellProps {
  preview: string
  heading: string
  children: React.ReactNode
  ctaLabel?: string
  ctaHref?: string
  footerNote?: string
  siteName?: string
}

export const AuthShell = ({
  preview,
  heading,
  children,
  ctaLabel,
  ctaHref,
  footerNote,
  siteName,
}: AuthShellProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandRow}>
          <Text style={brand}>ARTESYS</Text>
          <Text style={brandSub}>{siteName ? 'Crypto Exchange' : 'Crypto Exchange'}</Text>
        </Section>

        <Heading style={h1}>{heading}</Heading>
        {children}

        {ctaLabel && ctaHref ? (
          <Section style={{ textAlign: 'center', margin: '24px 0 10px' }}>
            <Button className="dm-btn" href={ctaHref} style={button}>
              {ctaLabel}
            </Button>
          </Section>
        ) : null}

        {ctaHref ? (
          <Text style={urlNote}>
            Button not working? Paste this link into your browser:{' '}
            <Link href={ctaHref} style={link}>
              {ctaHref}
            </Link>
          </Text>
        ) : null}

        <Hr style={hr} />
        {footerNote ? <Text style={muted}>{footerNote}</Text> : null}
        <Text style={muted}>
          Artesys staff will never ask for your password, recovery link, or verification code.
        </Text>
        <Text style={muted}>Artesys — trade with clarity.</Text>
      </Container>
    </Body>
  </Html>
)
