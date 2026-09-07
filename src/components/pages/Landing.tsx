import BannerSlideshow from "@/components/BannerSlideshow";
import FeatureCards from "@/components/FeatureCards";
import { LiveTickerMarquee } from "@/components/LiveTickerMarquee";
import { MarketPreview } from "@/components/MarketPreview";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@/lib/router-compat";
import { useEffect } from "react";
import { ArrowRight, ArrowUpRight, Shield, Globe } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "@/components/shared/Logo";
import heroAbstract from "@/assets/generated/hero-abstract.jpg";
import securityVault from "@/assets/generated/security-vault.jpg";
import { CryptoAuthView } from "@/components/auth/CryptoAuthView";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Editorial primitives                                               */
/* ------------------------------------------------------------------ */

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-gold">
    <span className="inline-block h-px w-8 bg-brand-gold/60" />
    {children}
  </p>
);

const SectionHeading = ({
  index,
  kicker,
  title,
  lede,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  lede?: string;
}) => (
  <div className="border-t border-border pt-8 mb-16 md:mb-20">
    <div className="flex items-baseline justify-between gap-6 mb-10">
      <Kicker>{kicker}</Kicker>
      <span className="font-mono text-xs text-muted-foreground/50 tracking-widest">{index}</span>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
      <h2 className="lg:col-span-8 font-display text-4xl md:text-6xl font-light tracking-[-0.03em] leading-[1.02] text-foreground">
        {title}
      </h2>
      {lede && (
        <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground font-light leading-relaxed lg:pb-2">
          {lede}
        </p>
      )}
    </div>
  </div>
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
});

/* ------------------------------------------------------------------ */

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobileAuth, setIsMobileAuth] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileAuth(window.innerWidth < 1024); // lg breakpoint equivalent
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const hostname = window.location.hostname;
    const isDomainAdmin = hostname === "admin.artesys.com" || hostname.startsWith("admin.");
    const searchParams = window.location.search;

    if (isDomainAdmin) {
      navigate(`/auth${searchParams}`, { replace: true });
      return;
    }

    if (!loading && user) {
      navigate("/app/home", { replace: true });
      return;
    }

    const urlParams = new URLSearchParams(searchParams);
    const ref = urlParams.get("ref");
    if (ref && !loading && !user) {
      navigate(`/auth?ref=${ref}`, { replace: true });
    }
  }, [user, loading, navigate]);


  if (isMobileAuth && !user) {
    return <CryptoAuthView />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-clip font-sans">
      {/* Ambient backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] rounded-full bg-primary/10 blur-[160px] opacity-70" />
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Masthead nav                                                */}
      {/* ---------------------------------------------------------- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[4.5rem] flex items-center justify-between">
          <button className="cursor-pointer" onClick={() => navigate("/")} aria-label="Artesys home">
            <Logo size={44} variant="FULL" />
          </button>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">
            <a href="#markets" className="hover:text-primary transition-colors">Markets</a>
            <a href="#platform" className="hover:text-primary transition-colors">Platform</a>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
            <a href="#onboarding" className="hover:text-primary transition-colors">Onboarding</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-7">
            {!user ? (
              <button
                onClick={() => navigate("/auth")}
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </button>
            ) : null}
            <button
              onClick={() => navigate("/auth")}
              className="px-5 sm:px-7 py-2.5 border border-primary/50 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-[0.15em] hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 sm:pt-[4.5rem] relative z-10">
        {/* Live ticker */}
        <div className="border-b border-border bg-muted/40 overflow-hidden">
          <LiveTickerMarquee />
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Masthead hero — bold & minimal                              */}
        {/* ---------------------------------------------------------- */}
        <section className="relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={heroAbstract}
              alt="Abstract three-dimensional cobalt-blue crystalline coin and geometric forms"
              width={1920}
              height={1088}
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_80%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 pt-16 sm:pt-24 pb-20 sm:pb-28">
            {/* Masthead meta row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex items-center justify-between border-y border-border/70 py-3 mb-14 sm:mb-20 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70"
            >
              <span>Private Wealth</span>
              <span className="hidden sm:inline text-brand-gold">Digital Assets, Institutional Grade</span>
              <span>Est. {new Date().getFullYear()}</span>
            </motion.div>

            {/* Headline + lede (magazine grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-9 font-display text-[2.9rem] leading-[1.0] sm:text-7xl md:text-8xl font-light tracking-[-0.035em] text-foreground"
              >
                The Premier Standard{" "}
                <span className="block mt-2 text-primary italic font-medium">for Digital Finance</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="lg:col-span-3 lg:pb-3"
              >
                <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed border-l-2 border-primary/40 pl-5">
                  Institutional-grade liquidity, uncompromising custody, and execution measured in
                  milliseconds — built for the elite trader.
                </p>
              </motion.div>
            </div>

            {/* Single decisive CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <button
                onClick={() => navigate("/auth")}
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-display font-semibold text-sm tracking-[0.15em] uppercase rounded-xl shadow-brand transition-all hover:scale-[1.03] active:scale-95"
              >
                Create Account
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#markets"
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
              >
                Explore live markets <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>
        </section>


        {/* ---------------------------------------------------------- */}
        {/* Featured figure — product slideshow                         */}
        {/* ---------------------------------------------------------- */}
        <section className="py-24 sm:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()} className="mb-10 flex items-baseline justify-between gap-6">
              <Kicker>The Platform</Kicker>
              <span className="font-mono text-xs text-muted-foreground/50 tracking-widest">Fig. 01</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="border border-border"
            >
              <BannerSlideshow />
            </motion.div>
            <p className="mt-5 text-[11px] font-light text-muted-foreground/70 tracking-wide">
              Spot, futures, earn and custody — one professional terminal for every desk.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Live markets                                                */}
        {/* ---------------------------------------------------------- */}
        <div id="markets" className="scroll-mt-24">
          <MarketPreview />
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Onboarding — editorial numbered columns                     */}
        {/* ---------------------------------------------------------- */}
        <section id="onboarding" className="py-24 sm:py-36 px-6 border-y border-border bg-secondary/30 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              index="02"
              kicker="Onboarding"
              title={
                <>
                  Three steps to <span className="text-primary italic font-medium">your first trade</span>
                </>
              }
              lede="From registration to execution in minutes — with identity verification and custody handled in-line."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
              {[
                { step: "01", title: "Open your account", copy: "Register with your email and complete identity verification in minutes." },
                { step: "02", title: "Fund your wallet", copy: "Deposit crypto to your secure custody address and see it credited on confirmation." },
                { step: "03", title: "Trade and earn", copy: "Access spot and futures markets, or route idle balance into Earn for daily yield." },
              ].map((item, i) => (
                <motion.article key={item.step} {...fadeUp(i * 0.12)} className="bg-card p-10 md:p-12 group hover:bg-primary/[0.03] transition-colors duration-500">
                  <p className="font-mono text-5xl font-light text-primary/30 mb-10 group-hover:text-primary/60 transition-colors duration-500">
                    {item.step}
                  </p>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.copy}</p>
                </motion.article>
              ))}
            </div>
            <motion.div {...fadeUp(0.2)} className="flex justify-center mt-16">
              <button
                onClick={() => navigate("/auth")}
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-display font-semibold text-sm tracking-[0.15em] uppercase rounded-xl shadow-brand transition-all hover:scale-[1.03] active:scale-95"
              >
                Get Started <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Platform features                                           */}
        {/* ---------------------------------------------------------- */}
        <div id="platform" className="scroll-mt-24">
          <FeatureCards />
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Security / trust                                            */}
        {/* ---------------------------------------------------------- */}
        <section id="security" className="py-24 sm:py-36 px-6 relative overflow-hidden bg-secondary/50 border-y border-border scroll-mt-24">
          <div className="max-w-6xl mx-auto relative z-10">
            <SectionHeading
              index="04"
              kicker="Custody & Compliance"
              title={
                <>
                  Uncompromising{" "}
                  <span className="text-primary italic font-medium">Security Standards.</span>
                </>
              }
              lede="Assets live where attackers can't reach them — offline, distributed, and independently audited."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              <motion.div {...fadeUp()} className="space-y-0">
                <div className="flex gap-6 items-start py-8 border-t border-border">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-border text-primary">
                    <Shield size={20} strokeWidth={1.25} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg mb-2 text-foreground tracking-tight">Military-Grade Cold Storage</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      The vast majority of digital assets are continuously kept in geographically
                      distributed offline vaults, protected by advanced cryptographic protocols.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start py-8 border-y border-border">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-border text-primary">
                    <Globe size={20} strokeWidth={1.25} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg mb-2 text-foreground tracking-tight">Global Regulatory Compliance</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      Operating strictly within premier international jurisdictions. Fully licensed,
                      routinely audited, and transparent.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.15)} className="relative">
                <figure className="relative mb-8 overflow-hidden border border-border">
                  <img
                    src={securityVault}
                    alt="Brushed metal vault door with blue-lit cryptographic engravings"
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <figcaption className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-gold mb-2">Cold Storage Infrastructure</p>
                    <p className="text-sm font-light text-foreground/80 leading-relaxed">98% of client assets held in geographically distributed offline vaults.</p>
                  </figcaption>
                </figure>
                <div className="p-10 border border-border bg-card/60 backdrop-blur-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-10 text-center">Trusted by Industry Partners</p>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-10 text-muted-foreground/30">
                    {["BINANCE", "COINBASE", "KRAKEN", "BYBIT"].map((name) => (
                      <div key={name} className="flex items-center justify-center font-display font-light text-2xl tracking-[0.2em] hover:text-primary transition-colors cursor-default">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Closing statement                                           */}
        {/* ---------------------------------------------------------- */}
        <section className="py-32 sm:py-44 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div {...fadeUp()} className="border-t border-border pt-8 mb-14 flex items-baseline justify-between">
              <Kicker>Begin</Kicker>
              <span className="font-mono text-xs text-muted-foreground/50 tracking-widest">05</span>
            </motion.div>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.035em] leading-[1.0] text-foreground mb-12"
            >
              Elevate your{" "}
              <span className="text-primary italic font-medium">trading experience.</span>
            </motion.h2>
            <motion.div {...fadeUp(0.2)} className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
              <p className="md:col-span-7 text-muted-foreground text-base md:text-lg font-light leading-relaxed max-w-xl">
                Open an institutional-grade account today to access premier liquidity, personalized
                service, and professional trading architecture.
              </p>
              <div className="md:col-span-5 md:text-right">
                <button
                  onClick={() => navigate("/auth")}
                  className="group inline-flex items-center gap-3 px-10 py-4 border border-foreground text-foreground hover:bg-foreground hover:text-background font-display font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500"
                >
                  Apply for Account <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- */}
      {/* Footer                                                      */}
      {/* ---------------------------------------------------------- */}
      <footer className="bg-secondary py-20 px-6 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-14 mb-20">
            <div className="md:col-span-5">
              <div className="mb-8 opacity-90">
                <Logo size={56} variant="FULL" />
              </div>
              <p className="text-muted-foreground max-w-sm text-xs font-light leading-loose">
                Artesys provides institutional-grade digital asset infrastructure to professional
                traders, wealth managers, and corporate entities globally.
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-7">
              <h5 className="font-semibold text-[10px] uppercase tracking-[0.25em] text-foreground/60 mb-8">Corporate & Legal</h5>
              <div className="flex flex-col gap-4 text-xs font-light text-muted-foreground">
                <a href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</a>
                <a href="/policies" className="hover:text-primary transition-colors">User Policies & Safeguards</a>
                <a href="/faq" className="hover:text-primary transition-colors">App FAQ & Guide</a>
                <a href="mailto:admin@artesys.com" className="hover:text-primary transition-colors">admin@artesys.com</a>
              </div>
            </div>

            <div className="md:col-span-3">
              <h5 className="font-semibold text-[10px] uppercase tracking-[0.25em] text-foreground/60 mb-8">Client Service</h5>
              <div className="flex flex-col gap-4 text-xs font-light text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Wealth Support</a>
                <a href="#" className="hover:text-primary transition-colors">Institutional APIs</a>
                <a href="#" className="hover:text-primary transition-colors">Fee Structures</a>
                <a href="#" className="hover:text-primary transition-colors">System Status</a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.25em]">
              © {new Date().getFullYear()} Artesys Holdings. All Rights Reserved.
            </p>
            <div className="flex items-center gap-8">
              <span className="text-muted-foreground hover:text-primary transition-all cursor-pointer text-[11px] font-semibold tracking-[0.2em] uppercase">X</span>
              <span className="text-muted-foreground hover:text-primary transition-all cursor-pointer text-[11px] font-semibold tracking-[0.2em] uppercase">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
