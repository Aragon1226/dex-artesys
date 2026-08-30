import React from 'react'
import { Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { APP_URL, DetailCard, EmailShell, text } from './shared-layout'

interface Props {
  name?: string
  status?: 'approved' | 'rejected' | 'more_info' | string
  level?: string
  reference?: string
  reviewedAt?: string
  reason?: string
}

const LABELS: Record<string, { heading: string; accent: string; badge: string }> = {
  approved: { heading: 'Verification approved', accent: '#16A34A', badge: 'Approved' },
  rejected: { heading: 'Verification not approved', accent: '#DC2626', badge: 'Rejected' },
  more_info: { heading: 'More information needed', accent: '#E6B34A', badge: 'Action required' },
}

const KycStatusEmail = ({ name, status, level, reference, reviewedAt, reason }: Props) => {
  const key = status && LABELS[status] ? status : 'approved'
  const meta = LABELS[key]!
  const approved = key === 'approved'

  return (
    <EmailShell
      preview={
        approved
          ? 'Your Artesys identity verification is approved — full account access unlocked.'
          : 'An update on your Artesys identity verification.'
      }
      heading={meta.heading}
      ctaLabel={approved ? 'Go to your dashboard' : 'Update verification'}
      ctaHref={approved ? `${APP_URL}/app/home` : `${APP_URL}/app/settings`}
      footerNote={
        approved
          ? 'Higher limits and full withdrawal access are now active on your account.'
          : 'Please review the note above and resubmit your documents when ready.'
      }
    >
      <Text style={text}>
        {name ? `Hi ${name},` : 'Hi there,'}{' '}
        {approved
          ? 'your identity verification has been approved. Your account limits are now upgraded.'
          : 'our compliance team has finished reviewing your verification and needs your attention.'}
      </Text>
      <DetailCard
        accent={meta.accent}
        rows={[
          { label: 'Decision', value: meta.badge },
          { label: 'Verification level', value: level || 'Level 1' },
          { label: 'Reference', value: reference || '—' },
          { label: 'Reviewed', value: reviewedAt || 'Just now' },
          ...(reason && !approved ? [{ label: 'Reviewer note', value: reason }] : []),
        ]}
      />
    </EmailShell>
  )
}

export const template = {
  component: KycStatusEmail,
  subject: (d: Record<string, any>) => {
    const s = d?.['status']
    if (s === 'rejected') return 'Artesys — your verification was not approved'
    if (s === 'more_info') return 'Artesys — more information needed for your verification'
    return 'Artesys — your identity verification is approved'
  },
  displayName: 'KYC decision',
  previewData: {
    name: 'Aung',
    status: 'approved',
    level: 'Level 2',
    reference: 'KYC-5D22Q88',
    reviewedAt: '30 Aug 2026, 09:12 UTC',
  },
} satisfies TemplateEntry
