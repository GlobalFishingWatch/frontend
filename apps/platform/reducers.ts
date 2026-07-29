import { combineSlices } from '@reduxjs/toolkit'
import { queriesApiReducers } from 'queries'

import printReducer from 'features/app/print.slice'
import areasReducer from 'features/data/areas/areas.slice'
import regionsReducer from 'features/data/regions/regions.slice'
import resourcesReducer from 'features/data/resources/resources.slice'
import debugReducer from 'features/debug/debug.slice'
import hintsReducer from 'features/hints/hints.slice'
import bigQueryReducer from 'features/map/bigquery/bigquery.slice'
import datasetsReducer from 'features/map/datasets/datasets.slice'
import dataviewsReducer from 'features/map/dataviews/dataviews.slice'
import downloadActivityReducer from 'features/map/download/downloadActivity.slice'
import downloadTrackReducer from 'features/map/download/downloadTrack.slice'
import editorReducer from 'features/map/editor/editor.slice'
import mapControlsReducer from 'features/map/map/controls/map-controls.slice'
import mapReducer from 'features/map/map/map.slice'
import timebarReducer from 'features/map/timebar/timebar.slice'
import workspaceReducer from 'features/map/workspace/workspace.slice'
import workspacesReducer from 'features/map/workspaces-list/workspaces-list.slice'
import modalsReducer from 'features/modals/modals.slice'
import vesselGroupReportReducer from 'features/reports/report-vessel-group/vessel-group-report.slice'
import reportsReducer from 'features/reports/reports.slice'
import reportReducer from 'features/reports/tabs/activity/reports-activity.slice'
import userReducer from 'features/user/user.slice'
import vesselGroupsReducer from 'features/user/vessel-groups/vessel-groups.slice'
import vesselGroupsModalReducer from 'features/user/vessel-groups/vessel-groups-modal.slice'
import searchReducer from 'features/vessels/search/search.slice'
import trackCorrectionReducer from 'features/vessels/track-correction/track-correction.slice'
import vesselReducer from 'features/vessels/vessel/vessel.slice'
import locationReducer from 'router/location.slice'

/**
 * Slices that are injected at runtime rather than registered here.
 *
 * Augment via `declare module 'reducers'` from store/lazy-slices.d.ts. Members land in the state type
 * as optional (`Partial`), which is what makes `strict` + `strictNullChecks` flag unguarded reads of a
 * slice whose route has not loaded yet.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LazyLoadedSlices {}

/**
 * combineSlices rather than combineReducers so slices can be `.inject()`ed later without a
 * replaceReducer: the returned reducer keeps a stable identity and closes over a mutable reducer map.
 *
 * Every slice is still registered eagerly here — this commit is behaviourally a no-op. Moving the map
 * slices behind a route boundary is the next step.
 */
export const rootReducer = combineSlices({
  ...queriesApiReducers,
  areas: areasReducer,
  bigQuery: bigQueryReducer,
  datasets: datasetsReducer,
  dataviews: dataviewsReducer,
  debug: debugReducer,
  downloadActivity: downloadActivityReducer,
  downloadTrack: downloadTrackReducer,
  editor: editorReducer,
  hints: hintsReducer,
  location: locationReducer,
  map: mapReducer,
  mapControls: mapControlsReducer,
  modals: modalsReducer,
  print: printReducer,
  regions: regionsReducer,
  report: reportReducer,
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
