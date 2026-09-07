import * as React from "react";
import { Text } from "@react-email/components";
import { AuthShell, codeStyle, text } from "./auth-shell";

interface ReauthenticationEmailProps {
  token: string;
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <AuthShell
    preview="Your Artesys verification code"
    heading="Confirm it's you"
    footerNote="This code expires shortly. If you didn't request it, ignore this email and consider changing your password."
  >
    <Text style={text}>Enter this verification code in Artesys to confirm your identity:</Text>
    <Text style={codeStyle}>{token}</Text>
  </AuthShell>
);

export default ReauthenticationEmail;
