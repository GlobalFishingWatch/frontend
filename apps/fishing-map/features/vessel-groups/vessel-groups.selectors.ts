import { createSelector } from '@reduxjs/toolkit'
import { isAdvancedSearchAllowed } from 'features/search/search.selectors'
import { isGFWUser } from 'features/user/user.slice'
import { RootState } from 'store'

// export const selectVesselGroups = (state: RootState) => state.vesselGroups.data

export const selectVessselGroupsAllowed = createSelector(
  [isAdvancedSearchAllowed, isGFWUser],
  (advancedSearchAllowed, gfwUser) => {
    return gfwUser || advancedSearchAllowed
  }
)
