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
  fee?: string
  reference?: string
  submittedAt?: string
}

const WithdrawalRequestEmail = ({
  name,
  amount,
  asset,
  network,
  address,
  fee,
  reference,
  submittedAt,
}: Props) => (
  <EmailShell
    preview={`Your ${asset || 'crypto'} withdrawal request is pending review.`}
    heading="Withdrawal request received"
    ctaLabel="View withdrawal status"
    ctaHref={`${APP_URL}/app/assets`}
    footerNote="If you did not request this withdrawal, contact support immediately and secure your account."
  >
    <Text style={text}>
      {name ? `Hi ${name},` : 'Hi there,'} we have received your withdrawal request. It is under
      review and you will be notified once it has been processed and broadcast to the network.
    </Text>
    <DetailCard
      rows={[
        { label: 'Amount', value: `${amount ?? '—'} ${asset ?? ''}`.trim() },
        { label: 'Network', value: network || 'Not specified' },
        { label: 'Destination address', value: address || '—' },
        ...(fee ? [{ label: 'Network fee', value: `${fee} ${asset ?? ''}`.trim() }] : []),
        { label: 'Reference', value: reference || '—' },
        { label: 'Submitted', value: submittedAt || 'Just now' },
        { label: 'Status', value: 'Pending review' },
      ]}
    />
  </EmailShell>
)

export const template = {
  component: WithdrawalRequestEmail,
  subject: (d: Record<string, any>) =>
    `Withdrawal request received${d?.['asset'] ? ` — ${d['amount'] ?? ''} ${d['asset']}`.trimEnd() : ''}`,
  displayName: 'Withdrawal request received',
  previewData: {
    name: 'Aung',
    amount: '1,200.00',
    asset: 'USDT',
    network: 'TRC20',
    address: 'TQ5s…9kPa',
    fee: '1.00',
    reference: 'WDR-3B71Z04',
    submittedAt: '30 Aug 2026, 07:05 UTC',
  },
} satisfies TemplateEntry
