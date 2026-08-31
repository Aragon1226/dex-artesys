import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero, Section, Card, CardGrid, Steps, CtaRow, FaqList } from "@/components/public/Section";
import { publicHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/publicSeo";

const TITLE = "Assets & Wallet — Deposits, Withdrawals & Earn | Artesys";
const DESCRIPTION =
  "How the Artesys wallet works: USDT deposits, reviewed withdrawals, instant transfers between spot and futures balances, portfolio tracking and Earn staking products.";

const FAQS = [
  {
    q: "How do I deposit funds?",
    a: "Submit a deposit request from the assets screen with the amount and network. Artesys shows the receiving address, and the balance is credited once the deposit is confirmed and reviewed.",
  },
  {
    q: "How long do withdrawals take?",
    a: "Withdrawal requests are queued for review before they are broadcast. You can follow the status of each request in your assets history until it completes.",
  },
  {
    q: "Can I move funds between spot and futures?",
    a: "Yes. Internal transfers between your spot and futures balances are instant and carry no fee.",
  },
  {
    q: "What is Earn?",
    a: "Earn lets you stake an eligible balance into a yield product and track accrued rewards over time. Staked amounts are held separately from your tradable balance.",
  },
];

export const Route = createFileRoute("/assets")({
  head: () => ({
    ...publicHead({ title: TITLE, description: DESCRIPTION, path: "/assets" }),
    scripts: [
      breadcrumbJsonLd([
        { name: "Artesys", path: "/" },
        { name: "Assets", path: "/assets" },
      ]),
      faqJsonLd(FAQS),
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Assets"
        title="One wallet for trading, futures and yield"
        lede="Your Artesys wallet holds the USDT and assets behind every order you place. Deposits, withdrawals, internal transfers and staking all run from a single assets screen, with a full record of every movement."
      >
        <CtaRow
          primary={{ label: "Create your wallet", to: "/auth" }}
          secondary={{ label: "How trading works", to: "/trading" }}
        />
      </PageHero>

      <Section title="Funding your account">
        <Steps
          steps={[
            {
              title: "Open a deposit request",
              body: "Choose the asset and network and enter the amount you intend to send. Artesys returns the deposit address for that network.",
            },
            {
              title: "Send from your own wallet or exchange",
              body: "Transfer to the address shown. Always match the network you selected — sending on a different network can make funds unrecoverable.",
            },
            {
              title: "Credited after review",
              body: "Once the transfer is confirmed and checked, the balance appears in your spot wallet and the request is marked complete.",
            },
            {
              title: "Allocate it",
              body: "Trade it on spot, or transfer part of it to your futures balance for leveraged positions.",
            },
          ]}
        />
      </Section>

      <Section title="What the assets screen gives you">
        <CardGrid>
          <Card title="Portfolio breakdown">
            Total account value with a per-asset breakdown, so you can see the weight of each
            holding at a glance.
          </Card>
          <Card title="Spot and futures balances">
            Separate balances shown side by side, with instant, fee-free internal transfers between
            them.
          </Card>
          <Card title="Deposit history">
            Every deposit request with its amount, network and current status.
          </Card>
          <Card title="Withdrawal requests">
            Submit a withdrawal to a saved address and track it through review to completion.
          </Card>
          <Card title="Earn balance">
            Staked amounts and accrued rewards are tracked separately from your tradable balance.
          </Card>
          <Card title="Full activity record">
            Trades, transfers, deposits and withdrawals are all recorded against your account.
          </Card>
        </CardGrid>
      </Section>

      <Section
        title="Earn"
        intro="Earn products put an idle balance to work while you keep the rest of your account free to trade."
      >
        <CardGrid>
          <Card title="Stake a balance">
            Commit an amount into an Earn product from the Earn screen. The staked amount leaves
            your tradable balance while it is active.
          </Card>
          <Card title="Track rewards">
            Accrued rewards are shown against the staked position so you can see what the
            allocation has produced.
          </Card>
          <Card title="Keep trading">
            Staking is optional and separate — your spot and futures balances continue to work
            normally alongside it.
          </Card>
        </CardGrid>
      </Section>

      <Section title="Wallet FAQ">
        <FaqList faqs={FAQS} />
      </Section>
    </PublicShell>
  );
}
