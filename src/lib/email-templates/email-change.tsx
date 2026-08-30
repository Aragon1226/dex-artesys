import * as React from 'react'
import { Text } from '@react-email/components'
import { AuthShell, text } from './auth-shell'

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail to read
  // "from OLD to NEW" instead of "from NEW to NEW".
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <AuthShell
    preview={`Confirm the new email address for your ${siteName} account`}
    heading="Confirm your new email"
    ctaLabel="Confirm email change"
    ctaHref={confirmationUrl}
    footerNote="If you didn't request this change, ignore this email and contact support — your sign-in address stays the same."
  >
    <Text style={text}>
      You requested to change the email on your {siteName} account from{' '}
      <strong>{oldEmail || 'your current address'}</strong> to <strong>{newEmail}</strong>. Confirm
      the change to finish.
    </Text>
  </AuthShell>
)

export default EmailChangeEmail
