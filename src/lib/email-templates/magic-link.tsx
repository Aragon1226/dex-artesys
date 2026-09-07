import * as React from "react";
import { Text } from "@react-email/components";
import { AuthShell, text } from "./auth-shell";

interface MagicLinkEmailProps {
  siteName: string;
  confirmationUrl: string;
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <AuthShell
    preview={`Your secure sign-in link for ${siteName}`}
    heading="Your sign-in link"
    ctaLabel="Sign in to Artesys"
    ctaHref={confirmationUrl}
    footerNote="This link expires shortly and works only once. If you didn't request it, ignore this email."
  >
    <Text style={text}>
      Tap the button below to sign in to your {siteName} account — no password needed.
    </Text>
  </AuthShell>
);

export default MagicLinkEmail;
