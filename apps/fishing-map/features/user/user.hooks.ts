import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { parse } from 'qs'

import { ACCESS_TOKEN_STRING, GFWAPI } from '@globalfishingwatch/api-client'
import { trackEvent } from '@globalfishingwatch/react-hooks'

import { TrackCategory } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectLoginSource, selectUserData } from 'features/user/selectors/user.selectors'
import { fetchUserThunk, setLoginSource } from 'features/user/user.slice'
import {
  selectIncludeRelatedIdentities,
  selectVesselDatasetId,
} from 'features/vessel/vessel.config.selectors'
import { fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
import { useFetchWorkspace } from 'features/workspace/workspace.hook'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import {
  selectIsAnyVesselLocation,
  selectVesselId,
  selectWorkspaceId,
} from 'router/routes.selectors'
import { getIsBrowser } from 'utils/dom'

const SUCCESS_LOGIN_MESSAGE = 'LOGIN_SUCCESS'

export function usePopupLogin() {
  const dispatch = useAppDispatch()

  return (e?: React.MouseEvent) => {
    if (!getIsBrowser()) {
      return
    }
    e?.preventDefault()
    e?.stopPropagation()
    dispatch(setWorkspaceSuggestSave(false))
    const params = new URLSearchParams({ isPopup: 'true', hideHeader: 'true' })

    const { origin, pathname } = window.location
    const loginUrl = GFWAPI.getLoginUrl(`${origin}${pathname}?${params.toString()}`, {
      hideHeader: true,
    })

    const width = 500
    const height = 750
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    // This works because we have useLoginMessage hook initialized in the app listening to messages
    window.open(loginUrl, 'SSO Login', `width=${width},height=${height},left=${left},top=${top}`)
  }
}

export function useLoginPopupListener() {
  const dispatch = useAppDispatch()
  const fetchWorkspace = useFetchWorkspace()
  const isAnyVesselProfileLocation = useSelector(selectIsAnyVesselLocation)
  const vesselId = useSelector(selectVesselId)
  const loginSource = useSelector(selectLoginSource)
  const workspace = useSelector(selectWorkspace)
  const workspaceId = useSelector(selectWorkspaceId)
  const datasetId = useSelector(selectVesselDatasetId)
  const includeRelatedIdentities = useSelector(selectIncludeRelatedIdentities)

  const reloadDataAfterLogin = useCallback(async () => {
    if (isAnyVesselProfileLocation && vesselId) {
      await dispatch(
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
        try {
          const user = await dispatch(
            fetchUserThunk({ accessToken: event.data.accessToken })
          ).unwrap()
          await reloadDataAfterLogin()
          if (user) {
            trackEvent({
              category: TrackCategory.User,
              action: 'login_success',
              label: loginSource ?? '',
              other: {
                user_id: user.id,
                // email: user.email,
              },
            })
          }
          dispatch(setLoginSource(null))
        } catch (e) {
          console.warn(e)
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [dispatch, reloadDataAfterLogin, loginSource])

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
