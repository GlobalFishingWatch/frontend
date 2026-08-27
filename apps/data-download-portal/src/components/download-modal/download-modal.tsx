import { useCallback } from 'react'

import type { UserData } from '@globalfishingwatch/api-types'
import type { DownloadSurveyAnswer } from '@globalfishingwatch/ui-components'
import {
  Button,
  DownloadSurvey,
  Modal,
  submitDownloadSurvey,
} from '@globalfishingwatch/ui-components'

import { DISABLE_DOWNLOAD_SURVEY, DOWNLOAD_SURVEY_URL } from '../../config'

import styles from './download-modal.module.css'

const MULTIPLE_FILES_NOTICE =
  'We are preparing the files you requested, you will receive an email when they are ready.'

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
    (answer: DownloadSurveyAnswer) =>
      submitDownloadSurvey({ url: DOWNLOAD_SURVEY_URL, answer, user }),
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
            <Button
              onClick={downloading ? undefined : onClose}
              disabled={downloading}
              loading={downloading}
            >
              Ok
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DownloadModal
