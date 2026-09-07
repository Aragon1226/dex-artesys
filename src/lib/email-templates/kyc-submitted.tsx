import React from "react";
import { Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";
import { APP_URL, DetailCard, EmailShell, text } from "./shared-layout";

interface Props {
  name?: string;
  documentType?: string;
  level?: string;
  reference?: string;
  submittedAt?: string;
  reviewWindow?: string;
}

const KycSubmittedEmail = ({
  name,
  documentType,
  level,
  reference,
  submittedAt,
  reviewWindow,
}: Props) => (
  <EmailShell
    preview="We received your identity verification documents — review is in progress."
    heading="Verification documents received"
    ctaLabel="View verification status"
    ctaHref={`${APP_URL}/app/settings`}
    footerNote="You do not need to resubmit unless we ask for a clearer document."
  >
    <Text style={text}>
      {name ? `Hi ${name},` : "Hi there,"} thanks for submitting your identity verification. Our
      compliance team is reviewing your documents and we will email you as soon as a decision is
      made.
    </Text>
    <DetailCard
      rows={[
        { label: "Document type", value: documentType || "Government ID" },
        { label: "Verification level", value: level || "Level 1" },
        { label: "Reference", value: reference || "—" },
        { label: "Submitted", value: submittedAt || "Just now" },
        { label: "Typical review time", value: reviewWindow || "Within 24–48 hours" },
      ]}
    />
  </EmailShell>
);

export const template = {
  component: KycSubmittedEmail,
  subject: "Artesys — we received your verification documents",
  displayName: "KYC submitted",
  previewData: {
    name: "Aung",
    documentType: "Passport",
    level: "Level 2",
    reference: "KYC-5D22Q88",
    submittedAt: "30 Aug 2026, 07:00 UTC",
    reviewWindow: "Within 24–48 hours",
  },
} satisfies TemplateEntry;
