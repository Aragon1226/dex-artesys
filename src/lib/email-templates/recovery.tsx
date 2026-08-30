import * as React from 'react'
import { Text } from '@react-email/components'
import { AuthShell, text } from './auth-shell'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <AuthShell
    preview={`Reset your ${siteName} password`}
    heading="Reset your password"
    ctaLabel="Choose a new password"
    ctaHref={confirmationUrl}
    footerNote="This link expires in 1 hour and can be used once. If you didn't request a reset, ignore this email — your password stays unchanged."
  >
    <Text style={text}>
      We received a request to reset the password for your {siteName} account. Use the button below
      to set a new one.
    </Text>
  </AuthShell>
)

export default RecoveryEmail
