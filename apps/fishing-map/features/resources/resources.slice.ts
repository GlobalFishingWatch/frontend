import { resourcesReducer } from '@globalfishingwatch/dataviews-client'

export {
  setResource,
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

export type { ResourcesState } from '@globalfishingwatch/dataviews-client'

export default resourcesReducer
