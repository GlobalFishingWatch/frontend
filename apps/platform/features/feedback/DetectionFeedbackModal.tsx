import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { Button, InputText, Modal, Tag } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/map/config'
import GFWOnly from 'features/_user/GFWOnly'
import { selectUserData } from 'features/_user/selectors/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectDetectionFeedbackModal } from 'features/modals/modals.slice'
import { getCurrentAppUrl } from 'router/routes.utils'
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

  const sendFeedback = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      const data: FeedbackForm['data'] = {
        date: getUTCDate().toISOString(),
        userAgent: navigator.userAgent,
        resolution: `${window.innerWidth}x${window.innerHeight}`,
        url: getCurrentAppUrl(),
        userId: userData?.id,
        email: userData?.email || '',
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
      console.error('Error: ', e)
    }
  }

  return (
    <Modal
      title={
        <Fragment>
          {t((t) => t.detectionFeedback.title)}
          <GFWOnly userGroup="any" />
        </Fragment>
      }
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
