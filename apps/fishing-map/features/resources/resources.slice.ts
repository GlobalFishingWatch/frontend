import {
  resourcesReducer,
  ResourcesState as CommonResourcesState,
} from '@globalfishingwatch/dataviews-client'

export {
  setResource,
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

export type ResourcesState = CommonResourcesState
export default resourcesReducer
