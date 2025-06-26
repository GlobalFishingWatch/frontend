import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'
import { fetchTrackIssuesThunk } from 'features/track-correction/track-correction.slice'
import {
  selectCurrentWorkspaceId,
  selectIsTurningTidesWorkspace,
} from 'features/workspace/workspace.selectors'
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

export function useFetchTrackCorrections() {
  const dispatch = useAppDispatch()
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const isTurningTidesWorkspace = useSelector(selectIsTurningTidesWorkspace)

  const fetchTrackCorrections = useCallback(
    async (workspaceId: string) => {
      if (!workspaceId) {
        return []
      }
      if (isTurningTidesWorkspace) {
        const response = await dispatch(fetchTrackIssuesThunk({ workspaceId: workspaceId }))
        if (fetchTrackIssuesThunk.fulfilled.match(response)) {
          return response.payload
        }
      }
      return []
    },
    [dispatch, isTurningTidesWorkspace]
  )

  useEffect(() => {
    if (currentWorkspaceId) {
      fetchTrackCorrections(currentWorkspaceId)
    }
  }, [currentWorkspaceId, fetchTrackCorrections])

  return fetchTrackCorrections
}
