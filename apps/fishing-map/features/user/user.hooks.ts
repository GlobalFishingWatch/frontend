import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getAccessTokenFromUrl, GFWAPI } from '@globalfishingwatch/api-client'
import { trackEvent } from '@globalfishingwatch/react-hooks'

import { PATH_BASENAME } from 'data/config'
import { TrackCategory } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  AUTH_CHANNEL_NAME,
  broadcastLogin,
  LOGIN_MESSAGE,
  LOGOUT_MESSAGE,
  TAB_ID,
} from 'features/user/auth-channel'
import { selectLoginSource } from 'features/user/selectors/user.selectors'
import {
  fetchUserThunk,
  logoutUserThunk,
  setLoggedUser,
  setLoginSource,
} from 'features/user/user.slice'
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
import { loginServerFn } from 'server-functions/auth.functions'
import { getIsBrowser } from 'utils/dom'

const IS_POPUP_KEY = 'isPopup'
const IS_POPUP_VALUE = 'true'

export const getIsLoginPopup = () => {
  if (!getIsBrowser()) {
    return false
  }
  const isPopupParam =
    new URLSearchParams(window.location.search).get(IS_POPUP_KEY) === IS_POPUP_VALUE
  return isPopupParam || Boolean(window.opener)
}

export function usePopupLogin() {
  const dispatch = useAppDispatch()

  return (e?: React.MouseEvent) => {
    if (!getIsBrowser()) {
      return
    }
    e?.preventDefault()
    e?.stopPropagation()
    dispatch(setWorkspaceSuggestSave(false))
    const params = new URLSearchParams({ [IS_POPUP_KEY]: IS_POPUP_VALUE, hideHeader: 'true' })

    const loginPath = `${PATH_BASENAME.replace(/\/$/, '')}/login`
    const callbackUrl = `${window.location.origin}${loginPath}?${params.toString()}`
    const loginUrl = GFWAPI.getLoginUrl(callbackUrl, {
      hideHeader: true,
    })

    const width = 500
    const height = 750
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    // The opener listens via useLoginPopupListener (BroadcastChannel); the popup completes
    // login with usePopupLoginCallback, broadcasts the session, and closes.
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
    if (getIsLoginPopup() || typeof BroadcastChannel === 'undefined') {
      return
    }
    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME)
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === LOGIN_MESSAGE) {
        try {
          const user = event.data.user ?? (await dispatch(fetchUserThunk({})).unwrap())
          if (event.data.user) {
            dispatch(setLoggedUser(event.data.user))
          }
          await reloadDataAfterLogin()
          if (user) {
            trackEvent({
              category: TrackCategory.User,
              action: 'login',
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
      if (event.data?.type === LOGOUT_MESSAGE) {
        if (event.data.senderId === TAB_ID) return
        await dispatch(logoutUserThunk({ local: true }))
        dispatch(fetchUserThunk({ guest: true }))
        return
      }
      return
    }
    channel.addEventListener('message', handleMessage)
    return () => {
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [dispatch, reloadDataAfterLogin, loginSource])
}

// avoid react strictMode calling loginServerFn twice
let popupLoginHandled = false

export function usePopupLoginCallback() {
  const login = useCallback(async () => {
    const accessToken = getAccessTokenFromUrl()
    try {
      const user = await loginServerFn({ data: { accessToken } })
      broadcastLogin(user)
    } catch (e) {
      console.warn('Popup login failed', e)
    } finally {
      window.close()
    }
  }, [])

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl()
    if (!popupLoginHandled && accessToken) {
      popupLoginHandled = true
      login()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
