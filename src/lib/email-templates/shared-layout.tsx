import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
} from "@react-email/components";
import {
  APP_URL,
  BrandFooter,
  BrandHeader,
  DetailCard,
  StatusPill,
  button,
  container,
  darkModeCss,
  h1,
  hr,
  link,
  main,
  muted,
  text,
  BLUE,
  GOLD,
  MIDNIGHT,
} from "./brand";
import type { DetailRow } from "./brand";

// Re-exported so existing transactional templates keep their imports.
export { APP_URL, DetailCard, StatusPill, button, container, h1, hr, link, main, muted, text };
export { BLUE, GOLD, MIDNIGHT };
export type { DetailRow };

interface ShellProps {
  preview: string;
  heading: string;
  children: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
  tagline?: string;
}

export const EmailShell = ({
  preview,
  heading,
  children,
  ctaLabel,
  ctaHref,
  footerNote,
  tagline,
}: ShellProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <BrandHeader tagline={tagline} />

        <Heading style={h1}>{heading}</Heading>
        {children}

        {ctaLabel && ctaHref ? (
          <Section style={{ textAlign: "center", margin: "26px 0 6px" }}>
            <Button className="dm-btn" href={ctaHref} style={button}>
              {ctaLabel}
            </Button>
          </Section>
        ) : null}

        <BrandFooter note={footerNote} />
      </Container>
    </Body>
  </Html>
);
