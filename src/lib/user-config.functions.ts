import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const depositAddressSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(16)
    .regex(/^[A-Za-z0-9_-]+$/),
  network: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9_-]+$/),
});

/** Deposit address for one asset/network, scoped to the signed-in client. */
export const getDepositAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => depositAddressSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { getDepositAddressForUser } = await import("@/lib/user-config.server");
    const claims = context.claims as { email?: string } | undefined;
    const address = await getDepositAddressForUser(
      context.userId,
      claims?.email ?? null,
      data.symbol,
      data.network,
    );
    return { address };
  });

/** Support contact details for the signed-in client's admin. */
export const getSupportContact = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getSupportContactForUser } = await import("@/lib/user-config.server");
    const claims = context.claims as { email?: string } | undefined;
    const contact = await getSupportContactForUser(context.userId, claims?.email ?? null);
    return { contact };
  });
