import { createSelector } from '@reduxjs/toolkit'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'

import {
  APP_PROFILE_VIEWS,
  DOWNLOAD_ACTIVITY_PERMISSION,
  INSURER_PERMISSION,
  PORT_INSPECTOR_PERMISSION,
} from 'data/config'
import { selectUserData } from 'features/user/user.slice'
import { selectWorkspaceProfileView } from 'features/workspace/workspace.selectors'

export const selectCurrentUserProfileHasInsurerPermission = createSelector(
  [selectWorkspaceProfileView, selectUserData],
  (profileView, user) => {
    return (
      user &&
      checkExistPermissionInList(user.permissions, INSURER_PERMISSION) &&
      APP_PROFILE_VIEWS.filter((v) => v.id === profileView).shift()?.required_permission ===
        INSURER_PERMISSION
    )
  }
)

export const selectCurrentUserProfileHasPortInspectorPermission = createSelector(
  [selectWorkspaceProfileView, selectUserData],
  (profileView, user) => {
    return (
      user &&
      checkExistPermissionInList(user.permissions, PORT_INSPECTOR_PERMISSION) &&
      APP_PROFILE_VIEWS.filter((v) => v.id === profileView).shift()?.required_permission ===
        PORT_INSPECTOR_PERMISSION
    )
  }
)

export const selectCurrentUserHasDownloadPermission = createSelector([selectUserData], (user) => {
  return user && checkExistPermissionInList(user.permissions, DOWNLOAD_ACTIVITY_PERMISSION)
})
