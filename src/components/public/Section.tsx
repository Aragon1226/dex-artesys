import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export const PageHero = ({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children?: ReactNode;
}) => (
  <section className="border-b border-border bg-gradient-to-b from-primary/[0.07] to-transparent px-4 py-14 sm:px-6 sm:py-20">
    <div className="mx-auto max-w-6xl">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
        {eyebrow}
      </p>
      <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {lede}
      </p>
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  </section>
);

export const Section = ({
  title,
  intro,
  children,
  id,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
  id?: string;
}) => (
  <section id={id} className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 last:border-0">
    <div className="mx-auto max-w-6xl">
      <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
      ) : null}
      {children ? <div className="mt-7">{children}</div> : null}
    </div>
  </section>
);

export const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <h3 className="text-sm font-bold text-foreground">{title}</h3>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{children}</p>
  </div>
);

export const CardGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
);

export const Steps = ({ steps }: { steps: { title: string; body: string }[] }) => (
  <ol className="flex flex-col gap-4">
    {steps.map((s, i) => (
      <li key={s.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
          {i + 1}
        </span>
        <span>
          <span className="block text-sm font-bold text-foreground">{s.title}</span>
          <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
            {s.body}
          </span>
        </span>
      </li>
    ))}
  </ol>
);

export const FaqList = ({ faqs }: { faqs: { q: string; a: string }[] }) => (
  <dl className="divide-y divide-border rounded-2xl border border-border">
    {faqs.map((f) => (
      <div key={f.q} className="p-5">
        <dt className="text-sm font-bold text-foreground">{f.q}</dt>
        <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.a}</dd>
      </div>
    ))}
  </dl>
);

export const CtaRow = ({
  primary,
  secondary,
}: {
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}) => (
  <div className="flex flex-wrap gap-3">
    <Link
      to={primary.to as never}
      className="rounded-lg bg-primary px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-90"
    >
      {primary.label}
    </Link>
    {secondary ? (
      <Link
        to={secondary.to as never}
        className="rounded-lg border border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        {secondary.label}
      </Link>
    ) : null}
  </div>
);
