import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, Steps, CtaRow, FaqList } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Accounts & Verification — Sign-in Options | Artesys";
const DESCRIPTION =
  "Artesys accounts: sign up with email, Google, Apple or a Web3 wallet, complete identity verification, manage sessions and linked wallets, and control account security.";

const FAQS = [
  {
    q: "How can I sign in to Artesys?",
    a: "With email and password, with Google or Apple, or by signing a message with a Web3 wallet such as MetaMask or any WalletConnect-compatible wallet. All routes lead to the same account.",
  },
  {
    q: "Do I need to verify my identity?",
    a: "Identity verification unlocks the full account, including withdrawals. You submit your documents once from the settings screen and can follow the review status there.",
  },
  {
    q: "Can I link a wallet to an existing email account?",
    a: "Yes. Linked wallets are managed in settings, so you can add a wallet to an account you originally created with email and then use either method to sign in.",
  },
  {
    q: "How does wallet sign-in work?",
    a: "Artesys issues a one-time challenge that you sign in your wallet. The signature proves you control the address; no private key or seed phrase ever leaves your wallet.",
  },
];

export const Route = createFileRoute("/accounts")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/accounts" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Accounts", path: "/accounts" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Accounts"
        title="Sign in the way that suits you"
        lede="An Artesys account can be created with an email address, a Google or Apple identity, or a Web3 wallet. Whichever you choose, you get the same wallet, the same markets and the same verification path."
      >
        <CtaRow
          primary={{ label: "Create an account", to: "/auth" }}
          secondary={{ label: "Read the FAQ", to: "/faq" }}
        />
      </PageHero>

      <Section title="Ways to sign in">
        <CardGrid>
          <Card title="Email and password">
            Register with an email address and confirm it from the message we send. Password reset
            and email change flows are both self-service.
          </Card>
          <Card title="Google">
            Use an existing Google identity to register and sign in without managing another
            password.
          </Card>
          <Card title="Apple">
            Sign in with Apple, including Apple's private email relay if you prefer not to share
            your address.
          </Card>
          <Card title="Web3 wallet">
            Connect MetaMask or any WalletConnect wallet and sign a one-time challenge. Nothing
            beyond the signature is requested.
          </Card>
        </CardGrid>
      </Section>

      <Section title="Getting to a fully enabled account">
        <Steps
          steps={[
            {
              title: "Register",
              body: "Create the account with your preferred method. Email registrations are confirmed by a link before first sign-in.",
            },
            {
              title: "Submit verification",
              body: "Provide your identity documents from the settings screen. Submissions are queued for review.",
            },
            {
              title: "Wait for review",
              body: "Your verification status is visible in settings and moves from pending to verified once approved.",
            },
            {
              title: "Fund and trade",
              body: "A verified account can deposit, trade spot and futures, stake in Earn and request withdrawals.",
            },
          ]}
        />
      </Section>

      <Section title="Managing your account">
        <CardGrid>
          <Card title="Profile and display name">
            Set the display name and profile details shown across the platform.
          </Card>
          <Card title="Verification status">
            See exactly where your identity review stands, and resubmit if something was rejected.
          </Card>
          <Card title="Linked wallets">
            Add or remove Web3 addresses tied to your account at any time.
          </Card>
          <Card title="Withdrawal address">
            Save the destination address used for withdrawal requests.
          </Card>
          <Card title="Support">
            Reach the Artesys support team from inside the app and keep the conversation attached to
            your account.
          </Card>
          <Card title="Referrals">
            Track referred sign-ups from your account area.
          </Card>
        </CardGrid>
      </Section>

      <Section title="Account FAQ">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
