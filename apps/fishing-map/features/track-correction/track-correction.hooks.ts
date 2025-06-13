import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'
import { fetchTrackIssuesThunk } from 'features/track-correction/track-correction.slice'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import type { TrackCorrectionId } from 'types'

export const TURNING_TIDES_WORKSPACES_IDS = ['default-public']

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

  const fetchTrackCorrections = useCallback(
    async (workspaceId: string) => {
      if (!workspaceId) {
        return []
      }
      if (TURNING_TIDES_WORKSPACES_IDS.includes(workspaceId)) {
        const response = await dispatch(fetchTrackIssuesThunk({ workspaceId: workspaceId }))
        if (fetchTrackIssuesThunk.fulfilled.match(response)) {
          return response.payload
        }
      }
      return []
    },
    [dispatch]
  )

  useEffect(() => {
    if (currentWorkspaceId) {
      fetchTrackCorrections(currentWorkspaceId)
    }
  }, [currentWorkspaceId, fetchTrackCorrections])

  return fetchTrackCorrections
}
