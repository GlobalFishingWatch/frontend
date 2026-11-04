import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { Button, InputText, Modal, Tag } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/map/config'
import { selectUserData } from 'features/_user/selectors/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectDetectionFeedbackModal } from 'features/modals/modals.slice'
import type { FeedbackForm } from 'routes/api/feedback'

import styles from './DetectionFeedbackModal.module.css'

type DetectionFeedbackModalProps = {
  isOpen?: boolean
  onClose: () => void
}

function DetectionFeedbackModal({ isOpen = false, onClose }: DetectionFeedbackModalProps) {
  const { t } = useTranslation()
  const { datasetId, detectionId } = useSelector(selectDetectionFeedbackModal)
  const userData = useSelector(selectUserData)

  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [error, setError] = useState(false)

  const sendFeedback = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setError(false)
    try {
      const data: FeedbackForm['data'] = {
        date: getUTCDate().toISOString(),
        name: (userData?.firstName || '') + ' ' + (userData?.lastName || '') || 'Anonymous',
        email: userData?.email || '',
        organization: userData?.organization,
        feedbackType: 'detection',
        datasetId,
        detectionId,
        description: comment,
      }

      const response = await fetch(`${PATH_BASENAME}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'detections', data }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong')
      }
      setLoading(false)
      onClose()

      trackEvent({
        category: TrackCategory.MapInteraction,
        action: 'send_detection_feedback',
      })
    } catch (e: any) {
      setLoading(false)
      setError(true)
      console.error('Error: ', e)
    }
  }

  return (
    <Modal
      title={t((t) => t.detectionFeedback.title)}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.top}>
          <div>
            <label>{t((t) => t.detectionFeedback.dataset)}</label>
            <Tag>{datasetId}</Tag>
          </div>
          <div>
            <label>{t((t) => t.detectionFeedback.detectionId)}</label>
            <Tag>{detectionId}</Tag>
          </div>
        </div>

        <div>
          <label>{t((t) => t.detectionFeedback.comments)}</label>
          <InputText
            placeholder={t((t) => t.detectionFeedback.commentPlaceholder)}
            value={comment}
            className={styles.input}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.footer}>
          {error && <p className={styles.error}>{t((t) => t.errors.genericShort)}</p>}
          <Button
            disabled={loading || !comment.trim()}
            onClick={sendFeedback}
            loading={loading}
            className={styles.cta}
          >
            {t((t) => t.detectionFeedback.send)}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DetectionFeedbackModal
