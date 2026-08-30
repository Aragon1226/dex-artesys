import * as React from 'react'
import { Link, Text } from '@react-email/components'
import { AuthShell, link, text } from './auth-shell'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: InviteEmailProps) => (
  <AuthShell
    preview={`You've been invited to join ${siteName}`}
    heading="You're invited to Artesys"
    ctaLabel="Accept invitation"
    ctaHref={confirmationUrl}
    footerNote="If you weren't expecting this invitation, you can safely ignore this email."
  >
    <Text style={text}>
      You have been invited to join{' '}
      <Link href={siteUrl} style={link}>
        <strong>{siteName}</strong>
      </Link>
      . Accept the invitation to set your password and access spot trading, futures and Earn.
    </Text>
  </AuthShell>
)

export default InviteEmail
