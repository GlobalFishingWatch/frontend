import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { GFWApiClient } from 'http-client/http-client'
import type { WorkspaceProfileViewParam } from 'types'

import { getAccessTokenFromUrl } from '@globalfishingwatch/api-client'

import {
  APP_PROFILE_VIEWS,
  FLRM_PERMISSION,
  INSURER_PERMISSION,
  IS_STANDALONE_APP,
  PORT_INSPECTOR_PERMISSION,
  RISK_SUMMARY_IDENTITY_INDICATORS_PERMISSION,
} from 'data/config'
import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { initializeDataviews } from 'features/dataviews/dataviews.utils'
import { useWorkspace } from 'features/workspace/workspace.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import {
  fetchUserThunk,
  logoutUserThunk,
  selectUserData,
  selectUserLogged,
  selectUserStatus,
} from './user.slice'

export const useUser = () => {
  const dispatch = useAppDispatch()

  const logged = useSelector(selectUserLogged)
  const user = useSelector(selectUserData)
  const status = useSelector(selectUserStatus)

  const {
    updateProfileView,
    workspace: { profileView: currentProfileView },
  } = useWorkspace()

  const accessToken = getAccessTokenFromUrl()
  const token = GFWApiClient.getToken()
  const refreshToken = GFWApiClient.getRefreshToken()

  const authorizedInspector = useMemo(() => {
    return user && checkExistPermissionInList(user.permissions, PORT_INSPECTOR_PERMISSION)
  }, [user])

  const authorizedInsurer = useMemo(() => {
    return user && checkExistPermissionInList(user.permissions, INSURER_PERMISSION)
  }, [user])

  const authorizedFLRM = useMemo(() => {
    return user && checkExistPermissionInList(user.permissions, FLRM_PERMISSION)
  }, [user])

  const authorizedIdentityIndicators = useMemo(() => {
    return (
      user &&
      checkExistPermissionInList(user.permissions, RISK_SUMMARY_IDENTITY_INDICATORS_PERMISSION)
    )
  }, [user])

  const availableViews = useMemo(() => {
    return APP_PROFILE_VIEWS.filter((view) => {
      return (
        (IS_STANDALONE_APP && view.id === 'standalone') ||
        (user &&
          view.required_permission &&
          checkExistPermissionInList(user?.permissions, view.required_permission))
      )
    })
  }, [user])

  // Setup default app profile view based on permissions
  useEffect(() => {
    const firstProfileView = availableViews.slice().shift()?.id as WorkspaceProfileViewParam

    if ((logged && !currentProfileView && firstProfileView) || IS_STANDALONE_APP) {
      updateProfileView(firstProfileView)
    }
  }, [availableViews, currentProfileView, dispatch, logged, updateProfileView])

  const logout = useCallback(() => {
    trackEvent({
      category: TrackCategory.GeneralVVFeatures,
      action: 'Logout',
    })
    dispatch(logoutUserThunk({ redirectTo: 'home' }))
  }, [dispatch])

  useEffect(() => {
    const fetchUser = async () => {
      if (!logged && (token || refreshToken || accessToken)) {
        const action = await dispatch(fetchUserThunk())
        if (fetchUserThunk.fulfilled.match(action)) {
          initializeDataviews(dispatch)
        }
      }
    }
    fetchUser()
  }, [accessToken, dispatch, logged, refreshToken, token])

  return {
    authorized: authorizedInspector || authorizedInsurer,
    authorizedIdentityIndicators,
    authorizedInspector,
    authorizedInsurer,
    authorizedFLRM,
    availableViews,
    loading: status !== AsyncReducerStatus.Finished && status !== AsyncReducerStatus.Idle,
    logged,
    logout,
    user,
  }
}
