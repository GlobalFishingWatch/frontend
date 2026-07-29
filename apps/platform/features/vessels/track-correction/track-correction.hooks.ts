import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectCurrentWorkspaceId,
  selectIsTurningTidesWorkspace,
} from 'features/map/workspace/workspace.selectors'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { fetchTrackIssuesThunk } from 'features/vessels/track-correction/track-correction.slice'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { TrackCorrectionId } from 'types'

export function useSetTrackCorrectionId() {
  const { replaceQueryParams } = useReplaceQueryParams()
  return useCallback((trackCorrectionId: TrackCorrectionId) => {
    replaceQueryParams({ trackCorrectionId })
  }, [replaceQueryParams])
}

export function useFetchTrackCorrections() {
  const dispatch = useAppDispatch()
  const isGuestUser = useSelector(selectIsGuestUser)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const isTurningTidesWorkspace = useSelector(selectIsTurningTidesWorkspace)

  const fetchTrackCorrections = useCallback(
    async (workspaceId: string) => {
      if (!workspaceId || isGuestUser || !isTurningTidesWorkspace) {
        return []
      }
      const response = await dispatch(fetchTrackIssuesThunk({ workspaceId: workspaceId }))
      if (fetchTrackIssuesThunk.fulfilled.match(response)) {
        return response.payload
      } else {
        return []
      }
    },
    [dispatch, isGuestUser, isTurningTidesWorkspace]
  )

  useEffect(() => {
    if (currentWorkspaceId) {
      fetchTrackCorrections(currentWorkspaceId)
    }
  }, [currentWorkspaceId, fetchTrackCorrections])

  return fetchTrackCorrections
}
