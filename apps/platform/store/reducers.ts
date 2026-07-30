import { combineSlices } from '@reduxjs/toolkit'

import datasetsReducer from 'features/_map/datasets/datasets.slice'
import dataviewsReducer from 'features/_map/dataviews/dataviews.slice'
import downloadActivityReducer from 'features/_map/download/downloadActivity.slice'
import mapReducer from 'features/_map/map/map.slice'
import timebarReducer from 'features/_map/timebar/timebar.slice'
import workspaceReducer from 'features/_map/workspace/workspace.slice'
import workspacesReducer from 'features/_map/workspaces-list/workspaces-list.slice'
import vesselGroupReportReducer from 'features/_reports/report-vessel-group/vessel-group-report.slice'
import reportsReducer from 'features/_reports/reports.slice'
import userReducer from 'features/_user/user.slice'
import vesselGroupsReducer from 'features/_user/vessel-groups/vessel-groups.slice'
import vesselGroupsModalReducer from 'features/_user/vessel-groups/vessel-groups-modal.slice'
import searchReducer from 'features/_vessels/search/search.slice'
import trackCorrectionReducer from 'features/_vessels/track-correction/track-correction.slice'
import vesselReducer from 'features/_vessels/vessel/vessel.slice'
import areasReducer from 'features/data/areas/areas.slice'
import regionsReducer from 'features/data/regions/regions.slice'
import resourcesReducer from 'features/data/resources/resources.slice'
import debugReducer from 'features/debug/debug.slice'
import hintsReducer from 'features/hints/hints.slice'
import modalsReducer from 'features/modals/modals.slice'
import locationReducer from 'router/location.slice'

/**
 * Slices that are injected at runtime rather than registered here.
 *
 * Each lazy slice augments this interface from its own file, next to its `rootReducer.inject()` call —
 * see features/_map/map/controls/screenshot.slice.ts for the reference implementation.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LazyLoadedSlices {}

export const rootReducer = combineSlices({
  areas: areasReducer,
  datasets: datasetsReducer,
  dataviews: dataviewsReducer,
  debug: debugReducer,
  downloadActivity: downloadActivityReducer,
  hints: hintsReducer,
  location: locationReducer,
  map: mapReducer,
  modals: modalsReducer,
  regions: regionsReducer,
  reports: reportsReducer,
  resources: resourcesReducer,
  search: searchReducer,
  timebar: timebarReducer,
  trackCorrection: trackCorrectionReducer,
  user: userReducer,
  vessel: vesselReducer,
  vesselGroupModal: vesselGroupsModalReducer,
  vesselGroupReport: vesselGroupReportReducer,
  vesselGroups: vesselGroupsReducer,
  workspace: workspaceReducer,
  workspaces: workspacesReducer,
}).withLazyLoadedSlices<LazyLoadedSlices>()

export type RootState = ReturnType<typeof rootReducer>
