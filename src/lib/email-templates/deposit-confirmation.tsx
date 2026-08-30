import React from 'react'
import { Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { APP_URL, DetailCard, EmailShell, text } from './shared-layout'

interface Props {
  name?: string
  amount?: string
  asset?: string
  network?: string
  txId?: string
  newBalance?: string
  creditedAt?: string
}

const DepositConfirmationEmail = ({
  name,
  amount,
  asset,
  network,
  txId,
  newBalance,
  creditedAt,
}: Props) => (
  <EmailShell
    preview={`Your ${asset || 'crypto'} deposit has been credited to your Artesys balance.`}
    heading="Deposit confirmed"
    ctaLabel="Start trading"
    ctaHref={`${APP_URL}/app/market`}
    footerNote="If you did not make this deposit, contact support immediately."
  >
    <Text style={text}>
      {name ? `Hi ${name},` : 'Hi there,'} your deposit is confirmed and the funds are available in
      your account.
    </Text>
    <DetailCard
      accent="#16A34A"
      rows={[
        { label: 'Amount credited', value: `${amount ?? '—'} ${asset ?? ''}`.trim() },
        { label: 'Network', value: network || 'Not specified' },
        { label: 'Transaction', value: txId || '—' },
        ...(newBalance ? [{ label: 'New balance', value: `${newBalance} ${asset ?? ''}`.trim() }] : []),
        { label: 'Credited', value: creditedAt || 'Just now' },
      ]}
    />
  </EmailShell>
)

export const template = {
  component: DepositConfirmationEmail,
  subject: (d: Record<string, any>) =>
    `Deposit confirmed${d?.['asset'] ? ` — ${d['amount'] ?? ''} ${d['asset']}`.trimEnd() : ''}`,
  displayName: 'Deposit confirmed',
  previewData: {
    name: 'Aung',
    amount: '2,500.00',
    asset: 'USDT',
    network: 'TRC20',
    txId: '0x9a41…c72f',
    newBalance: '11,340.55',
    creditedAt: '30 Aug 2026, 07:18 UTC',
  },
} satisfies TemplateEntry
