import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, FaqList, CtaRow } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Artesys Security — Accounts, Wallets & Withdrawals";
const DESCRIPTION =
  "How Artesys protects accounts and funds: verified sign-in methods, signature-based wallet login, identity verification, reviewed withdrawals and per-row database access rules.";

const FAQS = [
  {
    q: "Does Artesys ever need my seed phrase?",
    a: "Never. Wallet sign-in works by signing a one-time challenge inside your own wallet. No private key or recovery phrase is requested, transmitted or stored.",
  },
  {
    q: "How are withdrawals protected?",
    a: "Withdrawal requests are reviewed before funds move, and every request is tied to a verified account so an unfamiliar destination can be stopped.",
  },
  {
    q: "Who can see my balances?",
    a: "Access rules are enforced in the database itself, so each row is readable only by the account that owns it and by authorised platform operations.",
  },
  {
    q: "What should I do if I lose access to my email?",
    a: "Link a Web3 wallet to your account in settings while you still have access. A linked wallet gives you a second, independent way to sign in.",
  },
];

export const Route = createFileRoute("/guides/security")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/guides/security" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Guides", path: "/guides" },
        { name: "Security", path: "/guides/security" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: SecurityGuide,
});

function SecurityGuide() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Guide"
        title="How Artesys protects your account"
        lede="Security on Artesys is layered: how you prove who you are, how sessions are held, how funds leave the platform, and how data is walled off inside the database."
      >
        <CtaRow
          primary={{ label: "Review your settings", to: "/settings" }}
          secondary={{ label: "All guides", to: "/guides" }}
        />
      </PageHero>

      <Section title="The layers">
        <CardGrid>
          <Card title="Verified sign-in">
            Email registration requires a confirmed address. Google and Apple sign-in rely on the
            provider's own verification of the account.
          </Card>
          <Card title="Signature-based wallet login">
            A single-use challenge is issued per attempt and must be signed by the wallet address
            claiming the account. Signatures cannot be replayed.
          </Card>
          <Card title="Identity verification">
            Documents are submitted once and reviewed before the full account — including
            withdrawals — is unlocked.
          </Card>
          <Card title="Row-level data rules">
            Balances, orders and requests are readable only by their owner. The rules live in the
            database, not just in the interface.
          </Card>
          <Card title="Reviewed withdrawals">
            Every withdrawal request is checked before funds move, which stops an unrecognised
            destination address from draining an account.
          </Card>
          <Card title="Session control">
            Active sessions and linked wallets are listed in settings so you can remove anything you
            no longer recognise.
          </Card>
        </CardGrid>
      </Section>

      <Section title="What you can do today" intro="Three habits that remove most of the risk.">
        <CardGrid>
          <Card title="Link a second method">
            Add a wallet to an email account, or an email to a wallet account, so losing one does
            not lock you out.
          </Card>
          <Card title="Check the address, twice">
            Withdrawal destinations are the single most common point of loss in crypto. Confirm the
            first and last characters every time.
          </Card>
          <Card title="Keep verification current">
            An up-to-date verified profile keeps withdrawals moving without extra review delays.
          </Card>
        </CardGrid>
      </Section>

      <Section title="Security questions">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
