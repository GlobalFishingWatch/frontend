import { createSelector } from '@reduxjs/toolkit'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { selectUserData } from 'features/user/user.slice'
import { selectVesselsDatasets } from 'features/workspace/workspace.selectors'

export const selectAllowedVesselsDatasets = createSelector(
  [selectVesselsDatasets, selectUserData],
  (datasets, userData) => {
    if (!userData || !datasets?.length) return
    const datasetsWithPermissions = datasets.filter((dataset) => {
      const permission = { type: 'dataset', value: dataset.id, action: 'search' }
      return checkExistPermissionInList(userData?.permissions, permission)
    })
    return datasetsWithPermissions
  }
)

export const isSearchAllowed = createSelector([selectAllowedVesselsDatasets], (searchDatasets) => {
  return searchDatasets && searchDatasets.length > 0
})
