import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { parse } from 'qs'

import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'
import { trackEvent } from '@globalfishingwatch/react-hooks'

import { TrackCategory } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { fetchUserThunk } from 'features/user/user.slice'
import {
  selectIncludeRelatedIdentities,
  selectVesselDatasetId,
} from 'features/vessel/vessel.config.selectors'
import { fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
import { useFetchWorkspace } from 'features/workspace/workspace.hook'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import {
  selectIsAnyVesselLocation,
  selectVesselId,
  selectWorkspaceId,
} from 'router/routes.selectors'

const SUCCESS_LOGIN_MESSAGE = 'LOGIN_SUCCESS'

export function useLoginPopupListener() {
  const dispatch = useAppDispatch()
  const fetchWorkspace = useFetchWorkspace()
  const isAnyVesselProfileLocation = useSelector(selectIsAnyVesselLocation)
  const vesselId = useSelector(selectVesselId)
  const user = useSelector(selectUserData)
  const workspace = useSelector(selectWorkspace)
  const workspaceId = useSelector(selectWorkspaceId)
  const datasetId = useSelector(selectVesselDatasetId)
  const includeRelatedIdentities = useSelector(selectIncludeRelatedIdentities)

  const reloadDataAfterLogin = useCallback(() => {
    if (isAnyVesselProfileLocation) {
      dispatch(
        fetchVesselInfoThunk({ vesselId, datasetId, includeRelatedIdentities, isRefresh: true })
      )
    }
    fetchWorkspace({ workspaceId: workspaceId || '', isRefresh: workspace !== null })
  }, [
    datasetId,
    dispatch,
    fetchWorkspace,
    includeRelatedIdentities,
    isAnyVesselProfileLocation,
    vesselId,
    workspaceId,
    workspace,
  ])

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === SUCCESS_LOGIN_MESSAGE) {
        await dispatch(fetchUserThunk({ accessToken: event.data.accessToken }))
        reloadDataAfterLogin()
        if (user) {
          trackEvent({
            category: TrackCategory.User,
            action: 'login',
            other: {
              user_id: user.id,
              // email: user.email,
            },
          })
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [dispatch, reloadDataAfterLogin, user])

  useEffect(() => {
    const currentQuery = parse(window.location.search, { ignoreQueryPrefix: true })
    const accessToken = currentQuery[ACCESS_TOKEN_STRING]

    if (window?.opener) {
      window.opener.postMessage(
        { type: SUCCESS_LOGIN_MESSAGE, accessToken },
        window.location.origin
      )
      window.close()
      return
    }
  }, [])
}
