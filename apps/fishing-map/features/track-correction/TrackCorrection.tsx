import { useSelector } from 'react-redux'

import { Spinner } from '@globalfishingwatch/ui-components'

import type { TrackCorrection } from 'features/track-correction/track-correction.slice'
import {
  selectIsNewTrackCorrection,
  selectTrackCorrectionStatus,
} from 'features/track-correction/track-selection.selectors'
import TrackCorrectionEdit from 'features/track-correction/TrackCorrectionEdit'
import TrackCorrectionNew from 'features/track-correction/TrackCorrectionNew'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

const TrackCorrection = () => {
  const userData = useSelector(selectUserData)
  const isGuestUser = useSelector(selectIsGuestUser)
  const isNewTrackCorrection = useSelector(selectIsNewTrackCorrection)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)
  const trackCorrectionStatus = useSelector(selectTrackCorrectionStatus)

  if (!isWorkspaceReady || trackCorrectionStatus !== AsyncReducerStatus.Finished) return <Spinner />

  if (isGuestUser || !userData)
    return (
      <p>TODO: Add a message to the user that they need to be logged in to use this feature.</p>
    )

  return isNewTrackCorrection ? <TrackCorrectionNew /> : <TrackCorrectionEdit />
}

export default TrackCorrection
