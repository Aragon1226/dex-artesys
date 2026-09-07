import { useState, useEffect } from "react";
import { supabase } from "@/lib/cloudClient";
import { useAuth } from "@/hooks/useAuth";
import { getFallbackUserProfile } from "@/contexts/AuthContext";
import { useNavigate } from "@/lib/router-compat";
import { toast } from "sonner";
import type { UserProfile } from "@/types";
import {
  TrendingUp,
  Lock,
  ArrowRightLeft,
  Plus,
  X,
  Wallet,
  Clock,
  ShieldCheck,
  Coins,
  ChevronRight,
  Info,
} from "lucide-react";
import { CryptoIcon } from "@/components/shared/CryptoIcon";

const FIXED_DURATIONS = [
  { label: "10d", days: 10, apr: 3.5 },
  { label: "30d", days: 30, apr: 5 },
  { label: "90d", days: 90, apr: 7.25 },
  { label: "180d", days: 180, apr: 9.8 },
];

const EARN_PRODUCTS = [
  {
    symbol: "USDT",
    name: "Tether Savings",
    apr: "5.00% – 9.80%",
    tag: "Stable",
    min: "10 USDT",
    capacity: 82,
  },
  {
    symbol: "BTC",
    name: "Bitcoin Vault",
    apr: "2.15% – 4.40%",
    tag: "Blue chip",
    min: "0.001 BTC",
    capacity: 64,
  },
  {
    symbol: "ETH",
    name: "Ethereum Staking",
    apr: "3.05% – 5.60%",
    tag: "Proof of stake",
    min: "0.01 ETH",
    capacity: 71,
  },
  {
    symbol: "SOL",
    name: "Solana Delegation",
    apr: "6.20% – 8.15%",
    tag: "High yield",
    min: "0.5 SOL",
    capacity: 45,
  },
];

const EARN_FAQ = [
  {
    q: "When do rewards start accruing?",
    a: "Interest accrues from the next settlement cycle (00:00 UTC) and is credited to your Earn balance daily.",
  },
  {
    q: "Can I exit a fixed plan early?",
    a: "Yes. Early redemption returns your principal to Spot, but accrued interest for the current term is forfeited.",
  },
  {
    q: "Are staked assets insured?",
    a: "Earn balances sit inside the same multi-signature custody framework as your Spot wallet, with reserves audited quarterly.",
  },
];

const Earn = () => {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const profile = authProfile || getFallbackUserProfile(user);
  const [showStake, setShowStake] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [stakeType, setStakeType] = useState<"fixed" | "flexible">("fixed");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferFromSpot, setTransferFromSpot] = useState(true);

  useEffect(() => {
    if (!user) return;
    refreshProfile();
  }, [user, refreshProfile]);

  const handleConfirmStake = async () => {
    if (!user) {
      toast.info("Please sign in to stake assets");
      navigate("/auth");
      return;
    }
    if (!profile || !amount) return;
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0 || val > (profile.balance || 0)) {
      toast.error("Insufficient Balance");
      return;
    }
    setIsProcessing(true);
    const newSpot = (profile.balance || 0) - val;
    const newStaked = (profile.staked_balance || 0) + val;
    try {
      await supabase
        .from("profiles")
        .update({ balance: newSpot, staked_balance: newStaked })
        .eq("id", user.id);
    } catch (e) {
      console.warn("Failed to update stake in Supabase", e);
    }
    refreshProfile();
    setIsProcessing(false);
    setShowStake(false);
    setAmount("");
    toast.success(`${stakeType === "fixed" ? "Fixed" : "Flexible"} staking initiated`);
  };

  const handleTransfer = async () => {
    if (!user) {
      toast.info("Please sign in to transfer assets");
      navigate("/auth");
      return;
    }
    if (!profile || !amount) return;
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    if (transferFromSpot && val > (profile.balance || 0)) {
      toast.error("Insufficient Spot Balance");
      return;
    }
    if (!transferFromSpot && val > (profile.staked_balance || 0)) {
      toast.error("Insufficient Earn Balance");
      return;
    }
    setIsProcessing(true);
    let newSpot = profile.balance || 0,
      newStaked = profile.staked_balance || 0;
    if (transferFromSpot) {
      newSpot -= val;
      newStaked += val;
    } else {
      newStaked -= val;
      newSpot += val;
    }
    try {
      await supabase
        .from("profiles")
        .update({ balance: newSpot, staked_balance: newStaked })
        .eq("id", user.id);
    } catch (e) {
      console.warn("Failed to update balances on Supabase", e);
    }
    refreshProfile();
    setIsProcessing(false);
    setShowTransfer(false);
    setAmount("");
    toast.success("Transfer completed successfully");
  };

  const staked = profile.staked_balance || 0;
  const blendedApr =
    stakeType === "fixed" ? (FIXED_DURATIONS.find((d) => d.days === duration)?.apr ?? 5) : 0.25;
  const dailyYield = (staked * (blendedApr / 100)) / 365;
  const annualYield = staked * (blendedApr / 100);

  return (
    <div className="pb-24 bg-background min-h-screen text-foreground">
      <div className="bg-card px-4 py-2 flex items-center justify-end border-b border-border sticky top-0 z-30 shadow-sm backdrop-blur-md bg-card/90">
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              setAmount("");
              setShowTransfer(true);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-bold text-foreground hover:bg-muted flex items-center gap-1.5"
          >
            <ArrowRightLeft size={12} /> Transfer
          </button>
          <button
            onClick={() => {
              setStakeType("fixed");
              setAmount("");
              setShowStake(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/90 shadow-sm flex items-center gap-1.5"
          >
            <Plus size={12} /> Stake
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Portfolio summary */}
        <div className="rounded-2xl p-5 border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mb-1">
                Total Earn Balance
              </p>
              <h2 className="text-3xl font-bold text-foreground font-mono tracking-tight">
                $
                {staked.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
              <p className="text-[10px] font-bold text-success mt-1">
                +${dailyYield.toFixed(2)} / day est.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border/60">
            {[
              { label: "Blended APR", value: `${blendedApr.toFixed(2)}%` },
              { label: "30d Projection", value: `$${(dailyYield * 30).toFixed(2)}` },
              { label: "Annual Projection", value: `$${annualYield.toFixed(2)}` },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                  {s.label}
                </p>
                <p className="text-sm font-bold text-foreground font-mono">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plan selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => {
              setStakeType("fixed");
              setAmount("");
              setShowStake(true);
            }}
            className="rounded-2xl p-4 border border-warning/25 bg-warning/5 cursor-pointer active:scale-[0.98] transition-transform hover:border-warning/50"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-warning/15 text-warning flex items-center justify-center">
                <Lock size={15} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Fixed Term</h3>
                <p className="text-[10px] text-muted-foreground">Locked period, higher yield</p>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-muted-foreground">APR up to</p>
                <p className="text-base font-bold text-success font-mono">9.80%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Terms</p>
                <p className="text-[11px] font-bold text-foreground">10d – 180d</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setStakeType("flexible");
              setAmount("");
              setShowStake(true);
            }}
            className="rounded-2xl p-4 border border-primary/20 bg-primary/5 cursor-pointer active:scale-[0.98] transition-transform hover:border-primary/50"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Clock size={15} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Flexible</h3>
                <p className="text-[10px] text-muted-foreground">Redeem at any time</p>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-muted-foreground">APR</p>
                <p className="text-base font-bold text-success font-mono">0.25%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Lock Period</p>
                <p className="text-[11px] font-bold text-foreground">None</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product list */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Coins size={13} className="text-primary" /> Earn Products
            </h3>
            <span className="text-[9px] font-bold text-muted-foreground font-mono">
              Updated hourly
            </span>
          </div>
          <div className="divide-y divide-border">
            {EARN_PRODUCTS.map((prod) => (
              <button
                key={prod.symbol}
                onClick={() => {
                  setStakeType("fixed");
                  setAmount("");
                  setShowStake(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
              >
                <CryptoIcon symbol={prod.symbol} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground font-mono">
                      {prod.symbol}
                    </span>
                    <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {prod.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {prod.name} · Min {prod.min}
                  </p>
                  <div className="h-1 mt-1.5 w-24 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${prod.capacity}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-success font-mono">{prod.apr}</p>
                  <p className="text-[9px] text-muted-foreground">Est. APR</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Active positions / empty */}
        {staked > 0 ? (
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Active Position
              </h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success uppercase">
                Accruing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CryptoIcon symbol="USDT" size={36} />
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground font-mono">
                  $
                  {staked.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Flexible savings · settles daily at 00:00 UTC
                </p>
              </div>
              <button
                onClick={() => {
                  setTransferFromSpot(false);
                  setAmount("");
                  setShowTransfer(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-[10px] font-bold text-foreground hover:bg-muted"
              >
                Redeem
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Wallet size={20} />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">No Active Positions</h3>
            <p className="text-[11px] text-muted-foreground max-w-[220px] mb-4">
              Move idle balance into Earn and start compounding rewards daily.
            </p>
            <button
              onClick={() => {
                setStakeType("fixed");
                setAmount("");
                setShowStake(true);
              }}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold"
            >
              Start Earning
            </button>
          </div>
        )}

        {/* Assurance strip */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, label: "Audited reserves" },
            { icon: Clock, label: "Daily settlement" },
            { icon: Coins, label: "No hidden fees" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-card px-2 py-3 text-center"
            >
              <item.icon size={14} className="text-primary mx-auto mb-1.5" />
              <p className="text-[9px] font-bold text-muted-foreground leading-tight">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {EARN_FAQ.map((item) => (
            <details key={item.q} className="group px-4 py-3">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-foreground">
                {item.q}
                <ChevronRight
                  size={14}
                  className="text-muted-foreground transition-transform group-open:rotate-90"
                />
              </summary>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="flex items-start gap-1.5 text-[9px] text-muted-foreground leading-relaxed px-1">
          <Info size={11} className="shrink-0 mt-0.5" />
          Displayed APRs are estimates based on current network conditions and may change. Rewards
          are simulated for demonstration purposes.
        </p>
      </div>

      {/* Stake Modal */}
      {showStake && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in border border-border">
            <div className="p-4 border-b border-border flex justify-between items-center text-foreground">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Plus className="text-primary" size={18} /> Stake USDT
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  {stakeType === "fixed" ? "Locked Savings" : "Flexible Savings"}
                </p>
              </div>
              <button
                onClick={() => setShowStake(false)}
                className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <div
                className={`rounded-lg p-3 mb-4 flex items-center justify-between ${stakeType === "fixed" ? "bg-warning/5 border border-warning/25" : "bg-primary/5 border border-primary/20"}`}
              >
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">
                    APR Rate
                  </span>
                  <span className="text-lg font-bold text-success font-mono">
                    {blendedApr.toFixed(2)}%
                  </span>
                </div>
                <TrendingUp size={16} className="text-primary" />
              </div>
              {stakeType === "fixed" && (
                <div className="mb-4">
                  <label className="text-[11px] font-bold text-foreground mb-1.5 block">
                    Duration
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {FIXED_DURATIONS.map((d) => (
                      <button
                        key={d.days}
                        type="button"
                        onClick={() => setDuration(d.days)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${duration === d.days ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-muted-foreground/30"}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-6">
                <div className="flex justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-foreground">Amount</label>
                  <span className="text-[10px] text-muted-foreground">
                    Available: {(profile.balance || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min 10.00"
                  className="w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 font-mono text-base text-foreground focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none"
                />
              </div>
              <button
                onClick={handleConfirmStake}
                disabled={isProcessing || !amount}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-1 rounded-xl shadow-sm transition-all disabled:opacity-50 text-sm"
              >
                {isProcessing ? "Processing..." : "Confirm Stake"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in border border-border">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ArrowRightLeft className="text-primary" size={18} /> Transfer
                </h3>
              </div>
              <button
                onClick={() => setShowTransfer(false)}
                className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="mb-4">
                <div className="bg-muted border border-border rounded-lg pl-3 py-2.5 font-bold text-foreground mb-1.5 text-sm">
                  {transferFromSpot ? "Spot → Earn" : "Earn → Spot"}
                </div>
                <button
                  onClick={() => setTransferFromSpot(!transferFromSpot)}
                  className="text-[10px] text-primary font-bold"
                >
                  Swap Direction
                </button>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-foreground">Amount</label>
                  <span className="text-[10px] text-muted-foreground">
                    Available:{" "}
                    {(transferFromSpot ? profile.balance : profile.staked_balance || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 font-mono text-base text-foreground focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none"
                />
              </div>
              <button
                onClick={handleTransfer}
                disabled={isProcessing || !amount}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-1 rounded-xl shadow-sm transition-all disabled:opacity-50 text-sm"
              >
                {isProcessing ? "Processing..." : "Confirm Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earn;
