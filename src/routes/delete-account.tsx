import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, Steps, CtaRow, FaqList } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Delete your account & data | Artesys";
const DESCRIPTION =
  "Request deletion of your Artesys account and data. Delete your account yourself from settings in a few taps, or email our privacy team to have it removed for you.";

const SUPPORT_EMAIL = "privacy@artesys.cloud";

const FAQS = [
  {
    q: "How do I delete my Artesys account?",
    a: "Sign in, open Settings, scroll to Account erasure and permanent deletion, choose Delete account, type DELETE to confirm and submit. The account and its data are removed immediately.",
  },
  {
    q: "What if I cannot sign in?",
    a: "Email privacy@artesys.cloud from the address registered on the account and ask for deletion. We confirm ownership of the address and complete the removal within 30 days.",
  },
  {
    q: "What data is deleted?",
    a: "Your sign-in credentials and sessions, profile and display name, balances and portfolio records, spot and futures order history, deposit and withdrawal records, linked wallets, identity verification submissions, support conversations and notifications.",
  },
  {
    q: "Is anything kept after deletion?",
    a: "Only records we are legally required to retain, such as minimal proof that a deletion request was made. These are stored separately, are not used to profile you, and are removed once the retention period ends.",
  },
  {
    q: "Can deletion be undone?",
    a: "No. Deletion is permanent and irreversible. If you want to use Artesys again afterwards you will need to register a new account.",
  },
];

export const Route = createFileRoute("/delete-account")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/delete-account" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Delete account", path: "/delete-account" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: DeleteAccountPage,
});

function DeleteAccountPage() {
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Account deletion request",
  )}&body=${encodeURIComponent(
    "Please delete my Artesys account and all associated data.\n\nRegistered email address:\nReason (optional):\n",
  )}`;

  return (
    <PublicShell>
      <PageHero
        eyebrow="Account deletion"
        title="Delete your account and data"
        lede="You can remove your Artesys account yourself at any time, or ask our privacy team to do it for you. Deletion is permanent and covers your profile, balances, trading history and verification records."
      >
        <CtaRow
          primary={{ label: "Delete in settings", to: "/settings" }}
          secondary={{ label: "Read our policies", to: "/policies" }}
        />
      </PageHero>

      <Section title="Delete it yourself" id="self-service">
        <Steps
          steps={[
            {
              title: "Sign in",
              body: "Open Artesys and sign in with the account you want to remove, using email, Google, Apple or your linked wallet.",
            },
            {
              title: "Open settings",
              body: "Go to Settings from your account area, then scroll to the section named Account erasure and permanent deletion.",
            },
            {
              title: "Choose delete account",
              body: "Select an optional reason and type DELETE to confirm that you understand the action cannot be reversed.",
            },
            {
              title: "Confirm",
              body: "Submit the form. Your account and its data are erased straight away and you are signed out.",
            },
          ]}
        />
      </Section>

      <Section title="Ask us to delete it" id="request-by-email">
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          If you have lost access to your account, send a deletion request from the email address
          registered on it. We verify that the address belongs to the account, then complete the
          removal and confirm by reply. Requests are handled within 30 days.
        </p>
        <a
          href={mailto}
          className="inline-flex items-center rounded-xl border border-primary/30 bg-primary/10 px-5 py-3 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
        >
          Email a deletion request
        </a>
        <p className="mt-4 text-xs text-muted-foreground">
          Or write to us directly at{" "}
          <a className="font-semibold text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="What gets removed">
        <CardGrid>
          <Card title="Sign-in and sessions">
            Your credentials, active sessions and any linked Google, Apple or wallet sign-in methods.
          </Card>
          <Card title="Profile">
            Display name, username, account identifier, avatar and contact details.
          </Card>
          <Card title="Balances and portfolio">
            Simulated spot, futures and staked balances along with your asset holdings.
          </Card>
          <Card title="Trading history">
            Spot orders, futures positions and the records behind your activity history.
          </Card>
          <Card title="Transfers">Deposit and withdrawal records and saved withdrawal addresses.</Card>
          <Card title="Verification and support">
            Identity verification submissions and uploaded documents, support conversations and
            notifications.
          </Card>
        </CardGrid>
      </Section>

      <Section title="Deletion FAQ">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
