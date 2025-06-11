import { useCallback } from 'react'

import { useLocationConnect } from 'routes/routes.hook'
import type { TrackCorrectionId } from 'types'

export function useSetTrackCorrectionId() {
  const { dispatchQueryParams } = useLocationConnect()

  return useCallback(
    (trackCorrectionId: TrackCorrectionId) => {
      dispatchQueryParams({ trackCorrectionId })
    },
    [dispatchQueryParams]
  )
}
