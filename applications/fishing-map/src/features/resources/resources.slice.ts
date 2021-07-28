import {
  ResourcesState as CommonResourcesState,
  resourcesSlice,
} from '@globalfishingwatch/dataviews-client'

export {
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

export type ResourcesState = CommonResourcesState
export default resourcesSlice.reducer
