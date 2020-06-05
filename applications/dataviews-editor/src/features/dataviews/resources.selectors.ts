import { createSelector } from '@reduxjs/toolkit'
import { selectResources } from './resources.slice'

export const selectResourcesLoaded = createSelector([selectResources], (resources) => {
  return resources.every((resource) => resource.loaded)
})
