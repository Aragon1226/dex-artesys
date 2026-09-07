import { sendTemplateEmail } from "@/lib/email-templates/send-email";

type Claims = Record<string, unknown>;

export async function dispatchWelcomeEmail(userId: string, claims: Claims) {
  const email = typeof claims["email"] === "string" ? (claims["email"] as string) : null;
  const emailVerified = claims["email_verified"] === true;

  if (!email || !emailVerified) {
    return { sent: false as const, reason: "not_verified" as const };
  }

  const metadata = (claims["user_metadata"] ?? {}) as Record<string, unknown>;
  const displayName =
    (typeof metadata["display_name"] === "string" && metadata["display_name"]) ||
    (typeof metadata["username"] === "string" && metadata["username"]) ||
    email.split("@")[0];

  const result = await sendTemplateEmail("signup-welcome", email, {
    // Same key for every retry of this user's welcome email — no duplicates.
    idempotencyKey: `signup-welcome-${userId}`,
    templateData: {
      name: displayName,
      appUrl: process.env["APP_URL"] || "https://www.xn--artsys-dva.com",
    },
  });

  return result.sent ? { sent: true as const } : { sent: false as const, reason: result.reason };
}
