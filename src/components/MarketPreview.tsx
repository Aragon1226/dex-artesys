import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { CryptoIcon } from "@/components/shared/CryptoIcon";
import { marketService } from "@/services/market";
import { useNavigate } from "@/lib/router-compat";

type Row = { pair: string; symbol: string; price: number; change: number };

const FEATURED = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "LINK"];

export const MarketPreview = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const markets = await marketService.getAllMarkets();
        if (!active) return;
        const mapped: Row[] = markets
          .map((m) => ({
            pair: m.pair,
            symbol: m.pair.replace("/USDT", "").replace("USDT", ""),
            price: m.price,
            change: m.change24h,
          }))
          .filter((r) => FEATURED.includes(r.symbol))
          .sort((a, b) => FEATURED.indexOf(a.symbol) - FEATURED.indexOf(b.symbol));
        setRows(mapped.slice(0, 8));
      } catch {
        /* keep previous rows on failure */
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (rows.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-4">
              <Activity size={12} /> Live Markets
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-foreground">
              Prices moving <span className="text-primary italic font-medium">right now</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/app/market")}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-6 py-3 border border-border bg-card/60 text-foreground text-[10px] font-bold uppercase tracking-[0.15em] hover:border-primary/40 hover:text-primary transition-colors rounded-xl"
          >
            View all markets <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {rows.map((row, i) => {
            const up = row.change >= 0;
            return (
              <motion.button
                key={row.pair}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.6 }}
                onClick={() => navigate("/app/market")}
                className="text-left bg-card hover:bg-primary/[0.03] transition-colors p-6 group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CryptoIcon symbol={row.symbol} size={32} />
                  <div>
                    <p className="text-xs font-bold text-foreground font-mono tracking-tight">{row.symbol}/USDT</p>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Spot</p>
                  </div>
                </div>
                <p className="text-xl font-light text-foreground font-mono tracking-tight mb-2">
                  ${row.price.toLocaleString(undefined, {
                    minimumFractionDigits: row.price < 1 ? 4 : 2,
                    maximumFractionDigits: row.price < 1 ? 4 : 2,
                  })}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono ${
                    up ? "text-success" : "text-destructive"
                  }`}
                >
                  {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {up ? "+" : ""}
                  {row.change.toFixed(2)}%
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketPreview;
