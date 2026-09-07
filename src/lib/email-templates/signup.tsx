import * as React from "react";
import { Link, Text } from "@react-email/components";
import { AuthShell, link, text } from "./auth-shell";

interface SignupEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <AuthShell
    preview={`Confirm your email to activate your ${siteName} account`}
    heading="Confirm your email"
    ctaLabel="Verify my email"
    ctaHref={confirmationUrl}
    footerNote="This link expires in 24 hours. If you didn't create an account, you can safely ignore this email."
  >
    <Text style={text}>
      Thanks for signing up for{" "}
      <Link href={siteUrl} style={link}>
        <strong>{siteName}</strong>
      </Link>
      . Confirm{" "}
      <Link href={`mailto:${recipient}`} style={link}>
        {recipient}
      </Link>{" "}
      to activate spot trading, futures and Earn on your account.
    </Text>
  </AuthShell>
);

export default SignupEmail;
