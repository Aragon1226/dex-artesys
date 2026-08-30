import { useState } from "react";
import { Loader2, Wallet, QrCode } from "lucide-react";
import { supabase } from "@/lib/cloudClient";
import { useToast } from "@/hooks/use-toast";
import {
  connectWallet,
  signMessage,
  friendlyWalletError,
  isWalletConnectAvailable,
  shortAddress,
  type WalletKind,
} from "@/lib/web3";

interface WalletSignInProps {
  onSuccess?: () => void;
  disabled?: boolean;
}

export const WalletSignIn = ({ onSuccess, disabled }: WalletSignInProps) => {
  const [pending, setPending] = useState<WalletKind | null>(null);
  const { toast } = useToast();

  const run = async (kind: WalletKind) => {
    setPending(kind);
    try {
      const { requestWalletChallenge, verifyWalletSignature } = await import(
        "@/lib/wallet-auth.functions"
      );

      const { address, provider } = await connectWallet(kind);
      const challenge = await requestWalletChallenge({
        data: { address, chain: "evm" },
      });
      const signature = await signMessage(provider, address, challenge.message);

      const result = await verifyWalletSignature({
        data: { address: challenge.address, signature, chain: "evm" },
      });

      const { error } = await supabase.auth.verifyOtp({
        token_hash: result.tokenHash,
        type: "email",
      });
      if (error) throw error;

      localStorage.removeItem("crypx_custom_session_v1");
      toast({
        title: result.created ? "Wallet account created" : "Welcome back",
        description: `Signed in with ${shortAddress(result.address)}.`,
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Wallet sign-in failed",
        description: friendlyWalletError(error),
        variant: "destructive",
      });
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => run("injected")}
        disabled={disabled || pending !== null}
        className="w-full py-4 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-muted active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {pending === "injected" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4 text-primary" />
        )}
        {pending === "injected" ? "Awaiting signature..." : "Continue with a browser wallet"}
      </button>

      {isWalletConnectAvailable() && (
        <button
          type="button"
          onClick={() => run("walletconnect")}
          disabled={disabled || pending !== null}
          className="w-full py-4 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-muted active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {pending === "walletconnect" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <QrCode className="w-4 h-4 text-primary" />
          )}
          {pending === "walletconnect" ? "Awaiting signature..." : "Continue with WalletConnect"}
        </button>
      )}

      <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.15em]">
        Signature only — no gas fees, no transactions
      </p>
    </div>
  );
};
