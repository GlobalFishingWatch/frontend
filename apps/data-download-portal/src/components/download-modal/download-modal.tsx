import { useCallback } from 'react'

import type { UserData } from '@globalfishingwatch/api-types'
import type {
  DownloadSurveyAnswer,
  DownloadSurveyContactConsent,
} from '@globalfishingwatch/ui-components'
import { Button, DownloadSurvey, Modal } from '@globalfishingwatch/ui-components'

import { DISABLE_DOWNLOAD_SURVEY, DOWNLOAD_SURVEY_URL } from '../../config'

import styles from './download-modal.module.css'

const MULTIPLE_FILES_NOTICE =
  'We are preparing the files you requested, you will receive an email when they are ready.'

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

export type DownloadRequest = {
  showSurvey: boolean
  multipleFiles: boolean
}

type DownloadModalProps = {
  request: DownloadRequest | null
  user: UserData | null
  downloading?: boolean
  onClose: () => void
}

function DownloadModal({ request, user, downloading, onClose }: DownloadModalProps) {
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
      isOpen={request !== null}
      onClose={onClose}
      contentClassName={request?.showSurvey ? styles.surveyContent : styles.noticeContent}
    >
      {request?.showSurvey ? (
        <DownloadSurvey
          disableStorageKey={DISABLE_DOWNLOAD_SURVEY}
          onConfirm={onConfirm}
          onClose={onClose}
          notice={request?.multipleFiles ? MULTIPLE_FILES_NOTICE : undefined}
          downloading={downloading}
        />
      ) : (
        <div className={styles.notice}>
          <p>{MULTIPLE_FILES_NOTICE}</p>
          <div className={styles.noticeFooter}>
            <Button onClick={onClose}>Okay</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DownloadModal
