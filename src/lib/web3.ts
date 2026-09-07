/**
 * Browser-side wallet connectors for Web3 sign-in.
 * Supports injected EIP-1193 wallets (MetaMask, Rabby, Brave, Coinbase) and
 * WalletConnect v2 for mobile wallets.
 */

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  disconnect?: () => Promise<void>;
};

export type WalletKind = "injected" | "walletconnect";

export const WALLETCONNECT_PROJECT_ID = (import.meta.env["VITE_WALLETCONNECT_PROJECT_ID"] ||
  "") as string;

export const hasInjectedWallet = () =>
  typeof window !== "undefined" && Boolean((window as any).ethereum);

export const isWalletConnectAvailable = () => WALLETCONNECT_PROJECT_ID.length > 0;

let wcProvider: any = null;

async function getWalletConnectProvider() {
  if (!isWalletConnectAvailable()) {
    throw new Error(
      "WalletConnect is not configured yet. Use a browser wallet, or add a WalletConnect project ID.",
    );
  }
  if (!wcProvider) {
    const { default: EthereumProvider } = await import("@walletconnect/ethereum-provider");
    wcProvider = await EthereumProvider.init({
      projectId: WALLETCONNECT_PROJECT_ID,
      chains: [1],
      optionalChains: [1, 8453, 42161, 137, 56],
      showQrModal: true,
      metadata: {
        name: "Artesys",
        description: "Artesys digital asset exchange",
        url: window.location.origin,
        icons: [`${window.location.origin}/icons/icon-192x192.png`],
      },
    });
  }
  return wcProvider;
}

async function getProvider(kind: WalletKind): Promise<Eip1193Provider> {
  if (kind === "walletconnect") {
    const provider = await getWalletConnectProvider();
    await provider.connect();
    return provider as Eip1193Provider;
  }

  const injected = (window as any).ethereum as Eip1193Provider | undefined;
  if (!injected) {
    throw new Error("No browser wallet detected. Install MetaMask or use WalletConnect.");
  }
  return injected;
}

/** Connects the wallet and returns the primary account address. */
export async function connectWallet(kind: WalletKind): Promise<{
  address: string;
  provider: Eip1193Provider;
}> {
  const provider = await getProvider(kind);
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("No wallet account was shared.");
  return { address, provider };
}

/** Asks the wallet to personal_sign the supplied challenge message. */
export async function signMessage(
  provider: Eip1193Provider,
  address: string,
  message: string,
): Promise<string> {
  const signature = (await provider.request({
    method: "personal_sign",
    params: [message, address],
  })) as string;
  if (!signature) throw new Error("The signature request was cancelled.");
  return signature;
}

export function friendlyWalletError(error: unknown): string {
  const err = error as { code?: number; message?: string };
  if (err?.code === 4001 || /user rejected|denied/i.test(err?.message || "")) {
    return "You cancelled the wallet request.";
  }
  return err?.message || "Wallet connection failed. Please try again.";
}

export const shortAddress = (address: string) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
