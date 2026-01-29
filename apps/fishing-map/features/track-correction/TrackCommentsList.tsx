import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'

import I18nDate from 'features/i18n/i18nDate'
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
    <ul className={styles.container}>
      {track.comments.map((comment) => (
        <li key={comment.issueId + '-' + comment.date} className={styles.item}>
          <div className={styles.header}>
            <span className={styles.user}>{comment.reviewer || comment.user}</span>
            <span className={styles.version}>{getTimeAgo(getUTCDateTime(comment.date), t)}</span>
          </div>
          <div className="comment-content">{comment.comment} </div>

          {(comment.startDate_corrected || comment.endDate_corrected) && (
            <span className={styles.correctedDates}>
              {comment.startDate_corrected && (
                <I18nDate
                  date={comment.startDate_corrected}
                  format={DateTime.DATETIME_MED}
                  showUTCLabel={false}
                />
              )}
              {comment.startDate_corrected && comment.endDate_corrected && ' - '}
              {comment.endDate_corrected && (
                <I18nDate
                  date={comment.endDate_corrected}
                  format={DateTime.DATETIME_MED}
                  showUTCLabel={false}
                />
              )}
            </span>
          )}
          <span className={styles.version}>
            {t('trackCorrection.version', 'Version') + ' ' + comment.datasetVersion}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default TrackCommentsList
