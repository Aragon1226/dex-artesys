import { getDepositAddress, getSupportContact } from "@/lib/user-config.functions";

type SupportContact = NonNullable<Awaited<ReturnType<typeof getSupportContact>>["contact"]>;

/** Fetches the deposit address assigned to the signed-in client. */
export async function fetchDepositAddress(symbol: string, network: string): Promise<string | null> {
  const result = await getDepositAddress({ data: { symbol, network } });
  return result.address;
}

/** Fetches the support contact assigned to the signed-in client. */
export async function fetchSupportContact(): Promise<SupportContact | null> {
  const result = await getSupportContact();
  return result.contact;
}
