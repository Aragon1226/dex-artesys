import { useCallback, useEffect, useState } from "react";
import { Loader2, Wallet, QrCode, Trash2, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/cloudClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  connectWallet,
  signMessage,
  friendlyWalletError,
  isWalletConnectAvailable,
  shortAddress,
  type WalletKind,
} from "@/lib/web3";

interface LinkedWallet {
  id: string;
  address: string;
  chain: string;
  is_primary: boolean;
  created_at: string;
}

export const LinkedWalletsCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallets, setWallets] = useState<LinkedWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<WalletKind | null>(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("linked_wallets")
      .select("id, address, chain, is_primary, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setWallets((data as LinkedWallet[]) || []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const link = async (kind: WalletKind) => {
    setPending(kind);
    try {
      const { requestWalletChallenge, linkWallet } = await import("@/lib/wallet-auth.functions");
      const { address, provider } = await connectWallet(kind);
      const challenge = await requestWalletChallenge({ data: { address, chain: "evm" } });
      const signature = await signMessage(provider, address, challenge.message);
      const result = await linkWallet({
        data: { address: challenge.address, signature, chain: "evm" },
      });

      toast({
        title: result.alreadyLinked ? "Already linked" : "Wallet linked",
        description: `${shortAddress(result.address)} is connected to your account.`,
      });
      await load();
    } catch (error) {
      toast({
        title: "Could not link wallet",
        description: friendlyWalletError(error),
        variant: "destructive",
      });
    } finally {
      setPending(null);
    }
  };

  const remove = async (wallet: LinkedWallet) => {
    const { error } = await supabase.from("linked_wallets").delete().eq("id", wallet.id);
    if (error) {
      toast({ title: "Could not remove wallet", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Wallet removed", description: `${shortAddress(wallet.address)} unlinked.` });
    await load();
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Wallet className="text-primary" size={24} />
        <div>
          <h3 className="text-lg font-bold">Web3 Wallets</h3>
          <p className="text-xs text-muted-foreground">
            Link a wallet to sign in with a signature instead of a password.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading linked wallets…
        </div>
      ) : wallets.length === 0 ? (
        <p className="text-xs text-muted-foreground">No wallets linked yet.</p>
      ) : (
        <ul className="space-y-3">
          {wallets.map((wallet) => (
            <li
              key={wallet.id}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-muted/40 border border-border"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ShieldCheck size={16} className="text-success shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-mono font-semibold truncate">
                    {shortAddress(wallet.address)}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {wallet.chain} {wallet.is_primary ? "· Primary" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => remove(wallet)}
                className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={`Unlink wallet ${shortAddress(wallet.address)}`}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => link("injected")}
          disabled={pending !== null}
          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {pending === "injected" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet size={16} />
          )}
          Link browser wallet
        </button>

        {isWalletConnectAvailable() && (
          <button
            onClick={() => link("walletconnect")}
            disabled={pending !== null}
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-muted/40 border border-border text-xs font-bold hover:bg-accent transition-colors disabled:opacity-50"
          >
            {pending === "walletconnect" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <QrCode size={16} />
            )}
            Link via WalletConnect
          </button>
        )}
      </div>
    </div>
  );
};
