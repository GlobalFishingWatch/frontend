import { useCallback } from 'react'

import type { UserData } from '@globalfishingwatch/api-types'
import type {
  DownloadSurveyAnswer,
  DownloadSurveyContactConsent,
} from '@globalfishingwatch/ui-components'
import { DownloadSurvey, Modal } from '@globalfishingwatch/ui-components'

import { DOWNLOAD_SURVEY_URL } from '../../config'

import styles from './download-survey.module.css'

type SurveyAnswer = DownloadSurveyAnswer & {
  date: string
  name: string
  email: string
  organization: string
  organizationCategory: string
  organizationType: string
  groups: string
  contactConsent: DownloadSurveyContactConsent
}

type DownloadSurveyModalProps = {
  isOpen: boolean
  user: UserData | null
  showQuestions: boolean
  notice?: string
  downloading?: boolean
  onClose: () => void
}

function DownloadSurveyModal({
  isOpen,
  user,
  showQuestions,
  notice,
  downloading,
  onClose,
}: DownloadSurveyModalProps) {
  const onConfirm = useCallback(
    async ({ usageIntent, contactConsent }: DownloadSurveyAnswer) => {
      const answer: SurveyAnswer = {
        date: new Date().toISOString(),
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        email: user?.email || '',
        groups: (user?.groups || []).join(', '),
        organization: user?.organization || '',
        organizationCategory: user?.organizationCategory || '',
        organizationType: user?.organizationType || '',
        usageIntent,
        contactConsent,
      }
      const response = await fetch(DOWNLOAD_SURVEY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answer),
      })
      if (!response.ok) {
        throw new Error(`Download survey answer failed with status ${response.status}`)
      }
    },
    [user]
  )

  return (
    <Modal
      title="Download"
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <DownloadSurvey
        onConfirm={onConfirm}
        onClose={onClose}
        showQuestions={showQuestions}
        notice={notice}
        downloading={downloading}
      />
    </Modal>
  )
}

export default DownloadSurveyModal
