import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
  selectCurrentTrackCorrectionIssue,
  selectIsNewTrackCorrection,
} from 'features/track-correction/track-selection.selectors'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'

import styles from './TrackCorrection.module.css'

const TrackCorrectionHeader = () => {
  const { t } = useTranslation()
  const currentTrackCorrectionIssue = useSelector(selectCurrentTrackCorrectionIssue)
  const isNewTrackCorrection = useSelector(selectIsNewTrackCorrection)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)

  if (!isWorkspaceReady) return null

  return (
    <div className={styles.titleContainer}>
      <h1>
        {currentTrackCorrectionIssue?.issueId
          ? t('trackCorrection.issue', 'Issue {{issueId}}', {
              issueId: currentTrackCorrectionIssue.issueId,
            })
          : isNewTrackCorrection
            ? t('trackCorrection.newIssue', 'New issue')
            : ''}
      </h1>
    </div>
  )
}

export default TrackCorrectionHeader
