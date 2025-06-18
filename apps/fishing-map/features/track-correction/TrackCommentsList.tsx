import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import I18nDate from 'features/i18n/i18nDate'

import type { TrackCorrection } from './track-correction.slice'

import styles from './TrackCommentsList.module.css'

interface TrackCommentsListProps {
  track: TrackCorrection
}

const TrackCommentsList = ({ track }: TrackCommentsListProps) => {
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) return <div>Loading comments...</div>
  if (error) return <div>Error loading comments: {error}</div>
  if (!track.comments || !track.comments.length) return

  return (
    <div className={styles.container}>
      <ul>
        {track.comments.map((comment) => (
          <li key={comment.issueId} className={styles.item}>
            <div className={styles.header}>
              <span className={styles.user}>{comment.user}</span>
              <label>{new Date(comment.date).toLocaleDateString()}</label>
            </div>
            <div className="comment-content">{comment.comment}</div>
            <span className={styles.version}>
              {t('trackCorrection.version', 'Version') + ' ' + comment.datasetVersion}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TrackCommentsList
