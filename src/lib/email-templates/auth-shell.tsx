import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  BrandFooter,
  BrandHeader,
  button,
  codeStyle,
  container,
  darkModeCss,
  h1,
  hr,
  link,
  main,
  muted,
  text,
  urlNote,
  BLUE,
  GOLD,
  MIDNIGHT,
} from "./brand";

// Re-exported so existing auth templates keep importing styles from here.
export { button, codeStyle, container, darkModeCss, h1, hr, link, main, muted, text, urlNote };
export { BLUE, GOLD, MIDNIGHT };

interface AuthShellProps {
  preview: string;
  heading: string;
  children: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
  siteName?: string;
}

export const AuthShell = ({
  preview,
  heading,
  children,
  ctaLabel,
  ctaHref,
  footerNote,
}: AuthShellProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <BrandHeader />

        <Heading style={h1}>{heading}</Heading>
        {children}

        {ctaLabel && ctaHref ? (
          <Section style={{ textAlign: "center", margin: "24px 0 10px" }}>
            <Button className="dm-btn" href={ctaHref} style={button}>
              {ctaLabel}
            </Button>
          </Section>
        ) : null}

        {ctaHref ? (
          <Text style={urlNote}>
            Button not working? Paste this link into your browser:{" "}
            <Link href={ctaHref} style={link}>
              {ctaHref}
            </Link>
          </Text>
        ) : null}

        <BrandFooter note={footerNote} />
      </Container>
    </Body>
  </Html>
);
