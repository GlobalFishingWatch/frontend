import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectCurrentTrackCorrectionIssue } from 'features/track-correction/track-selection.selectors'

import styles from './TrackCorrection.module.css'

const TrackCorrectionHeader = () => {
  const { t } = useTranslation()
  const currentTrackCorrectionIssue = useSelector(selectCurrentTrackCorrectionIssue)

  return (
    <div className={styles.titleContainer}>
      <h1>
        {currentTrackCorrectionIssue?.issueId
          ? t('trackCorrection.issue', 'Issue {{issueId}}', {
              issueId: currentTrackCorrectionIssue.issueId,
            })
          : t('trackCorrection.newIssue', 'New issue')}
      </h1>
    </div>
  )
}

export default TrackCorrectionHeader
