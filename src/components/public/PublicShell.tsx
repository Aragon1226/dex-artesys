import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/shared/Logo";

const NAV = [
  { label: "Markets", to: "/markets" },
  { label: "Trading", to: "/trading" },
  { label: "Assets", to: "/assets" },
  { label: "Accounts", to: "/accounts" },
  { label: "Guides", to: "/guides" },
  { label: "FAQ", to: "/faq" },
] as const;

export const PublicShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="Artesys home" className="shrink-0">
            <Logo size={40} variant="FULL" />
          </Link>

          <nav
            aria-label="Artesys sections"
            className="hidden items-center gap-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80 lg:flex"
          >
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/auth"
            className="rounded-lg border border-primary/50 bg-primary/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:px-6"
          >
            Launch App
          </Link>
        </div>

        <nav
          aria-label="Artesys sections"
          className="no-scrollbar flex gap-5 overflow-x-auto border-t border-border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80 lg:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="relative flex-1">{children}</main>

      <footer className="border-t border-border bg-secondary px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <Logo size={48} variant="FULL" />
              <p className="mt-5 max-w-xs text-xs font-light leading-relaxed text-muted-foreground">
                Artesys is a digital asset exchange for spot trading, leveraged futures, and yield
                products, with crypto and synthetic stocks &amp; commodities markets quoted in USDT.
              </p>
            </div>

            <FooterCol
              title="Platform"
              links={[
                { label: "Markets", to: "/markets" },
                { label: "Trading", to: "/trading" },
                { label: "Spot trading", to: "/trading/spot" },
                { label: "Futures trading", to: "/trading/futures" },
              ]}
            />
            <FooterCol
              title="Get started"
              links={[
                { label: "Assets & wallet", to: "/assets" },
                { label: "Accounts & verification", to: "/accounts" },
                { label: "Getting started guide", to: "/guides/getting-started" },
                { label: "Fees", to: "/guides/fees" },
              ]}
            />
            <FooterCol
              title="Learn & legal"
              links={[
                { label: "Guides", to: "/guides" },
                { label: "Security", to: "/guides/security" },
                { label: "FAQ", to: "/faq" },
                { label: "Terms", to: "/terms" },
                { label: "Policies", to: "/policies" },
              ]}
            />
          </div>

          <p className="mt-12 border-t border-border pt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            © {new Date().getFullYear()} Artesys. Trading digital assets carries risk.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FooterCol = ({ title, links }: { title: string; links: { label: string; to: string }[] }) => (
  <div>
    <h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground/60">
      {title}
    </h2>
    <ul className="flex flex-col gap-3 text-xs font-light text-muted-foreground">
      {links.map((l) => (
        <li key={l.to}>
          <Link to={l.to} className="transition-colors hover:text-primary">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default PublicShell;
