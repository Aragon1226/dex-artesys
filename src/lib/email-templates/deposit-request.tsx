import React from 'react'
import { Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { APP_URL, DetailCard, EmailShell, text } from './shared-layout'

interface Props {
  name?: string
  amount?: string
  asset?: string
  network?: string
  reference?: string
  submittedAt?: string
}

const DepositRequestEmail = ({ name, amount, asset, network, reference, submittedAt }: Props) => (
  <EmailShell
    preview={`We received your ${asset || 'crypto'} deposit request — it is pending review.`}
    heading="Deposit request received"
    ctaLabel="View deposit status"
    ctaHref={`${APP_URL}/app/assets`}
    footerNote="Deposits are credited after the required network confirmations and a quick compliance check."
  >
    <Text style={text}>
      {name ? `Hi ${name},` : 'Hi there,'} we have received your deposit request and it is now
      pending confirmation. You will get another email as soon as the funds are credited.
    </Text>
    <DetailCard
      rows={[
        { label: 'Amount', value: `${amount ?? '—'} ${asset ?? ''}`.trim() },
        { label: 'Network', value: network || 'Not specified' },
        { label: 'Reference', value: reference || '—' },
        { label: 'Submitted', value: submittedAt || 'Just now' },
        { label: 'Status', value: 'Pending confirmation' },
      ]}
    />
  </EmailShell>
)

export const template = {
  component: DepositRequestEmail,
  subject: (d: Record<string, any>) =>
    `Deposit request received${d?.['asset'] ? ` — ${d['amount'] ?? ''} ${d['asset']}`.trimEnd() : ''}`,
  displayName: 'Deposit request received',
  previewData: {
    name: 'Aung',
    amount: '2,500.00',
    asset: 'USDT',
    network: 'TRC20',
    reference: 'DEP-8F42K19',
    submittedAt: '30 Aug 2026, 07:02 UTC',
  },
} satisfies TemplateEntry
