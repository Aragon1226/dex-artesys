/**
 * Server-only Web3 wallet authentication helpers.
 *
 * Flow: the client asks for a one-time challenge message, signs it with the
 * connected wallet (MetaMask / injected provider or WalletConnect), and sends
 * the signature back. We verify the signature server-side, then either sign in
 * the account already linked to that address or create a new wallet account.
 */
import { verifyMessage, isAddress, getAddress } from "viem";

const CHALLENGE_TTL_MINUTES = 10;

export const normalizeAddress = (address: string) => {
  if (!isAddress(address)) throw new Error("Invalid wallet address.");
  return getAddress(address);
};

export const walletEmailFor = (address: string) =>
  `${normalizeAddress(address).toLowerCase()}@wallet.artesys.app`;

export const buildChallengeMessage = (address: string, nonce: string, domain: string) =>
  [
    `${domain} wants you to sign in with your Ethereum account:`,
    normalizeAddress(address),
    "",
    "Sign this message to authenticate with Artesys. This request will not trigger a blockchain transaction or cost any gas fees.",
    "",
    `URI: https://${domain}`,
    `Nonce: ${nonce}`,
    `Issued At: ${new Date().toISOString()}`,
    `Expires In: ${CHALLENGE_TTL_MINUTES} minutes`,
  ].join("\n");

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function createChallenge(rawAddress: string, domain: string) {
  const address = normalizeAddress(rawAddress);
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const message = buildChallengeMessage(address, nonce, domain);

  const db = await admin();
  const { error } = await db.from("wallet_auth_challenges").insert({ address, nonce, message });
  if (error) throw new Error("Could not start the wallet sign-in challenge.");

  return { address, message };
}

/** Verifies a signature against the most recent live challenge for the address. */
export async function consumeChallenge(rawAddress: string, signature: string) {
  const address = normalizeAddress(rawAddress);
  const db = await admin();

  const { data: challenges, error } = await db
    .from("wallet_auth_challenges")
    .select("id, message, expires_at")
    .eq("address", address)
    .eq("consumed", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw new Error("Could not verify the wallet signature.");
  const challenge = challenges?.[0];
  if (!challenge) throw new Error("This sign-in request expired. Please try again.");

  const valid = await verifyMessage({
    address: address as `0x${string}`,
    message: challenge.message,
    signature: signature as `0x${string}`,
  });
  if (!valid) throw new Error("The wallet signature could not be verified.");

  await db.from("wallet_auth_challenges").update({ consumed: true }).eq("id", challenge.id);
  return address;
}

/** Signs a verified wallet in, creating a wallet-only account when needed. */
export async function signInWithVerifiedWallet(address: string, chain: string) {
  const db = await admin();

  const { data: linked } = await db
    .from("linked_wallets")
    .select("user_id")
    .eq("address", address)
    .maybeSingle();

  let userId = linked?.user_id ?? null;
  let created = false;

  if (!userId) {
    const email = walletEmailFor(address);
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
    const { data: createdUser, error: createErr } = await db.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        display_name: short,
        username: short,
        wallet_address: address,
        auth_provider: "web3",
      },
    });
    if (createErr || !createdUser.user) {
      throw new Error(createErr?.message || "Could not create the wallet account.");
    }
    userId = createdUser.user.id;
    created = true;
    await db
      .from("linked_wallets")
      .insert({ user_id: userId, address, chain, is_primary: true, label: "Sign-in wallet" });
  }

  const { data: userRes, error: userErr } = await db.auth.admin.getUserById(userId);
  const email = userRes?.user?.email;
  if (userErr || !email) throw new Error("Could not resolve the wallet account.");

  const { data: link, error: linkErr } = await db.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  const tokenHash = link?.properties?.hashed_token;
  if (linkErr || !tokenHash) throw new Error("Could not start the wallet session.");

  return { tokenHash, created, address };
}

/** Attaches a verified wallet to an already signed-in account. */
export async function linkVerifiedWallet(userId: string, address: string, chain: string) {
  const db = await admin();

  const { data: existing } = await db
    .from("linked_wallets")
    .select("user_id")
    .eq("address", address)
    .maybeSingle();

  if (existing) {
    if (existing.user_id === userId) return { address, alreadyLinked: true };
    throw new Error("This wallet is already linked to another Artesys account.");
  }

  const { count } = await db
    .from("linked_wallets")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const { error } = await db.from("linked_wallets").insert({
    user_id: userId,
    address,
    chain,
    is_primary: (count ?? 0) === 0,
  });
  if (error) throw new Error("Could not link this wallet.");

  return { address, alreadyLinked: false };
}
