import { motion } from "motion/react";
import { Zap, ShieldCheck, Globe2, LineChart, Layers, Headphones } from "lucide-react";

const features = [
  {
    title: "Ultra-Fast Execution",
    description:
      "Our proprietary matching engine handles over 1 million transactions per second with <5ms latency.",
    icon: Zap,
  },
  {
    title: "Bank-Grade Security",
    description:
      "Multi-sig cold storage and institutional-grade encryption protect your digital assets 24/7.",
    icon: ShieldCheck,
  },
  {
    title: "Global Liquidity",
    description:
      "Deep order books and high liquidity across all top pairs ensure minimal slippage on every trade.",
    icon: Globe2,
  },
  {
    title: "Advanced Trading",
    description:
      "Comprehensive charting tools, custom indicators, and automated trading bots via our API.",
    icon: LineChart,
  },
  {
    title: "Multi-Asset Support",
    description: "Trade everything from majors like BTC and ETH to new trending ecosystem tokens.",
    icon: Layers,
  },
  {
    title: "Premium Support",
    description:
      "Our dedicated support team is available around the clock in 15+ languages via live chat.",
    icon: Headphones,
  },
];

const FeatureCards = () => {
  return (
    <section className="py-24 sm:py-36 px-6 max-w-6xl mx-auto">
      <div className="border-t border-border pt-8 mb-16 md:mb-20">
        <div className="flex items-baseline justify-between gap-6 mb-10">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-gold">
            <span className="inline-block h-px w-8 bg-brand-gold/60" />
            Capabilities
          </p>
          <span className="font-mono text-xs text-muted-foreground/50 tracking-widest">03</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <h2 className="lg:col-span-8 font-display text-4xl md:text-6xl font-light tracking-[-0.03em] leading-[1.02] text-foreground">
            Built for the <span className="text-primary italic font-medium">next generation</span>
          </h2>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground font-light leading-relaxed lg:pb-2">
            The most advanced exchange platform — tooling designed for high-frequency trading and
            wealth management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="p-10 bg-card border border-border hover:bg-primary/[0.02] hover:border-primary/20 transition-all group"
          >
            <div className="mb-8 w-14 h-14 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-transparent text-primary flex items-center justify-center group-hover:scale-110 group-hover:border-primary/40 transition-all duration-700">
              <feature.icon size={22} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-3 tracking-wide">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm font-light">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
