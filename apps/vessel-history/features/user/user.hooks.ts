import { useCallback, useEffect, useMemo } from 'react'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { GFWAPI, getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import {
  PORT_INSPECTOR_PERMISSION,
  FLRM_PERMISSION,
  INSURER_PERMISSION,
  APP_PROFILE_VIEWS,
} from 'data/config'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { initializeDataviews } from 'features/dataviews/dataviews.utils'
import { useWorkspace } from 'features/workspace/workspace.hook'
import { WorkspaceProfileViewParam } from 'types'
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
  const token = GFWAPI.getToken()
  const refreshToken = GFWAPI.getRefreshToken()

  const authorizedInspector = useMemo(() => {
    return user && checkExistPermissionInList(user.permissions, PORT_INSPECTOR_PERMISSION)
  }, [user])

  const authorizedInsurer = useMemo(() => {
    return user && checkExistPermissionInList(user.permissions, INSURER_PERMISSION)
  }, [user])

  const authorizedFLRM = useMemo(() => {
    return user && checkExistPermissionInList(user.permissions, FLRM_PERMISSION)
  }, [user])

  const availableViews = useMemo(() => {
    return APP_PROFILE_VIEWS.filter(
      (view) => user && checkExistPermissionInList(user?.permissions, view.required_permission)
    )
  }, [user])

  // Setup default app profile view based on permissions
  useEffect(() => {
    const firstProfileView = availableViews.slice().shift()?.id as WorkspaceProfileViewParam
    if (logged && !currentProfileView && firstProfileView) {
      updateProfileView(firstProfileView)
    }
  }, [currentProfileView, dispatch, logged, updateProfileView])

  const logout = useCallback(() => {
    uaEvent({
      category: 'General VV features',
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
