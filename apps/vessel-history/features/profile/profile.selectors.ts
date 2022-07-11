import { createSelector } from '@reduxjs/toolkit'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { APP_PROFILE_VIEWS, INSURER_PERMISSION } from 'data/config'
import { selectUserData } from 'features/user/user.slice'
import { selectWorkspaceProfileView } from 'features/workspace/workspace.selectors'

export const selectRiskSummaryTabVisible = createSelector(
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
