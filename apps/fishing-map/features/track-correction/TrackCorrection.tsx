import { useSelector } from 'react-redux'

import type { TrackCorrection } from 'features/track-correction/track-correction.slice'
import { selectIsNewTrackCorrection } from 'features/track-correction/track-selection.selectors'
import TrackCorrectionEdit from 'features/track-correction/TrackCorrectionEdit'
import TrackCorrectionNew from 'features/track-correction/TrackCorrectionNew'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'

const TrackCorrection = () => {
  const userData = useSelector(selectUserData)
  const isGuestUser = useSelector(selectIsGuestUser)
  const isNewTrackCorrection = useSelector(selectIsNewTrackCorrection)

  if (isGuestUser || !userData)
    return (
      <p>TODO: Add a message to the user that they need to be logged in to use this feature.</p>
    )

  return isNewTrackCorrection ? <TrackCorrectionNew /> : <TrackCorrectionEdit />
}

export default TrackCorrection
