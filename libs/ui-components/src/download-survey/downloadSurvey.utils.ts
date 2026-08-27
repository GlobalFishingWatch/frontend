import type { UserData } from '@globalfishingwatch/api-types'

import type { DownloadSurveyAnswer } from './DownloadSurvey'

export type DownloadSurveyPayload = DownloadSurveyAnswer & {
  date: string
  name: string
  email: string
  organization: string
  organizationCategory: string
  organizationType: string
  groups: string
}

type SubmitDownloadSurveyParams = {
  url: string
  answer: DownloadSurveyAnswer
  user: UserData | null
  groups?: string[]
}

export async function submitDownloadSurvey({
  url,
  answer,
  user,
  groups,
}: SubmitDownloadSurveyParams) {
  const payload: DownloadSurveyPayload = {
    date: new Date().toISOString(),
    name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
    email: user?.email ?? '',
    organization: user?.organization ?? '',
    organizationCategory: user?.organizationCategory ?? '',
    organizationType: user?.organizationType ?? '',
    groups: (groups ?? user?.groups ?? []).join(', '),
    ...answer,
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || `Download survey answer failed with status ${response.status}`)
  }
}
