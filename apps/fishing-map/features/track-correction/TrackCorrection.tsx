import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import type { TrackCorrection } from 'features/track-correction/track-correction.slice'
import {
  selectIsNewTrackCorrection,
  selectTrackCorrectionStatus,
} from 'features/track-correction/track-selection.selectors'
import TrackCorrectionEdit from 'features/track-correction/TrackCorrectionEdit'
import TrackCorrectionNew from 'features/track-correction/TrackCorrectionNew'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './TrackCorrection.module.css'

const TrackCorrection = () => {
  const userData = useSelector(selectUserData)
  const isGuestUser = useSelector(selectIsGuestUser)
  const isNewTrackCorrection = useSelector(selectIsNewTrackCorrection)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)
  const trackCorrectionStatus = useSelector(selectTrackCorrectionStatus)
  const { t } = useTranslation()

  if (isGuestUser || !userData)
    return (
      <>
        <h1 className={styles.title}>{t((t) => t.trackCorrection.title)}</h1>
        <div className={styles.loginRequired}>
          <Icon type="default" icon="warning" />
          <Trans i18nKey={(t) => t.trackCorrection.loginRequired}>
            To suggest and view this correction, you must
            <LocalStorageLoginLink className={styles.link}> log in </LocalStorageLoginLink>
          </Trans>
        </div>
      </>
    )

  if (!isWorkspaceReady || trackCorrectionStatus !== AsyncReducerStatus.Finished) return <Spinner />

  return isNewTrackCorrection ? <TrackCorrectionNew /> : <TrackCorrectionEdit />
}

export default TrackCorrection
