import type { WithSlice } from '@reduxjs/toolkit'

import type { dataTerminologyApi } from './map/data-terminology-api'
import type { reportEventsStatsApi } from './map/report-events-stats-api'
import type { vesselSearchApi } from './map/search-api'
import type { dataviewStatsApi } from './map/stats-api'
import type { userGuideApi } from './map/user-guide-api'
import type { vesselEventsApi } from './map/vessel-events-api'
import type { vesselInsightApi } from './map/vessel-insight-api'
import type { assistantApi } from './assistant-api'

declare module 'reducers' {
  export interface LazyLoadedSlices
    extends
      WithSlice<typeof assistantApi>,
      WithSlice<typeof dataTerminologyApi>,
      WithSlice<typeof dataviewStatsApi>,
      WithSlice<typeof reportEventsStatsApi>,
      WithSlice<typeof userGuideApi>,
      WithSlice<typeof vesselEventsApi>,
      WithSlice<typeof vesselInsightApi>,
      WithSlice<typeof vesselSearchApi> {}
}
