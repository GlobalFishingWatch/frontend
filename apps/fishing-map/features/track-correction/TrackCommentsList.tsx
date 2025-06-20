import { useTranslation } from 'react-i18next'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'

import { getTimeAgo } from 'utils/dates'

import type { TrackCorrection } from './track-correction.slice'

import styles from './TrackCommentsList.module.css'

interface TrackCommentsListProps {
  track: TrackCorrection
}

const TrackCommentsList = ({ track }: TrackCommentsListProps) => {
  const { t } = useTranslation()

  if (!track.comments || !track.comments.length) return

  return (
    <div className={styles.container}>
      <ul>
        {track.comments.map((comment) => (
          <li key={comment.issueId} className={styles.item}>
            <div className={styles.header}>
              <span className={styles.user}>{comment.user}</span>
              <span className={styles.version}>{getTimeAgo(getUTCDateTime(comment.date))}</span>
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
