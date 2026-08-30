import React from 'react'
import { Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { APP_URL, DetailCard, EmailShell, text } from './shared-layout'

interface Props {
  name?: string
  amount?: string
  asset?: string
  network?: string
  address?: string
  txId?: string
  remainingBalance?: string
  completedAt?: string
}

const WithdrawalConfirmationEmail = ({
  name,
  amount,
  asset,
  network,
  address,
  txId,
  remainingBalance,
  completedAt,
}: Props) => (
  <EmailShell
    preview={`Your ${asset || 'crypto'} withdrawal has been processed.`}
    heading="Withdrawal completed"
    ctaLabel="View transaction history"
    ctaHref={`${APP_URL}/app/assets`}
    footerNote="If you did not authorise this withdrawal, contact support immediately."
  >
    <Text style={text}>
      {name ? `Hi ${name},` : 'Hi there,'} your withdrawal has been approved and sent to the network.
      Arrival time depends on network confirmations.
    </Text>
    <DetailCard
      accent="#16A34A"
      rows={[
        { label: 'Amount sent', value: `${amount ?? '—'} ${asset ?? ''}`.trim() },
        { label: 'Network', value: network || 'Not specified' },
        { label: 'Destination address', value: address || '—' },
        { label: 'Transaction', value: txId || 'Pending broadcast' },
        ...(remainingBalance
          ? [{ label: 'Remaining balance', value: `${remainingBalance} ${asset ?? ''}`.trim() }]
          : []),
        { label: 'Completed', value: completedAt || 'Just now' },
      ]}
    />
  </EmailShell>
)

export const template = {
  component: WithdrawalConfirmationEmail,
  subject: (d: Record<string, any>) =>
    `Withdrawal completed${d?.['asset'] ? ` — ${d['amount'] ?? ''} ${d['asset']}`.trimEnd() : ''}`,
  displayName: 'Withdrawal completed',
  previewData: {
    name: 'Aung',
    amount: '1,200.00',
    asset: 'USDT',
    network: 'TRC20',
    address: 'TQ5s…9kPa',
    txId: '0x71ce…4ab2',
    remainingBalance: '10,139.55',
    completedAt: '30 Aug 2026, 07:41 UTC',
  },
} satisfies TemplateEntry
