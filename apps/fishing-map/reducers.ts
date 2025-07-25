import { combineReducers } from '@reduxjs/toolkit'
import { queriesApiReducers } from 'queries'

import areasReducer from 'features/areas/areas.slice'
import bigQueryReducer from 'features/bigquery/bigquery.slice'
import datasetsReducer from 'features/datasets/datasets.slice'
import dataviewsReducer from 'features/dataviews/dataviews.slice'
import debugReducer from 'features/debug/debug.slice'
import downloadActivityReducer from 'features/download/downloadActivity.slice'
import downloadTrackReducer from 'features/download/downloadTrack.slice'
import editorReducer from 'features/editor/editor.slice'
import hintsReducer from 'features/help/hints.slice'
import mapControlsReducer from 'features/map/controls/map-controls.slice'
import screenshotReducer from 'features/map/controls/screenshot.slice'
import mapReducer from 'features/map/map.slice'
import modalsReducer from 'features/modals/modals.slice'
import regionsReducer from 'features/regions/regions.slice'
import vesselGroupReportReducer from 'features/reports/report-vessel-group/vessel-group-report.slice'
import reportsReducer from 'features/reports/reports.slice'
import reportReducer from 'features/reports/tabs/activity/reports-activity.slice'
import resourcesReducer from 'features/resources/resources.slice'
import searchReducer from 'features/search/search.slice'
import timebarReducer from 'features/timebar/timebar.slice'
import trackCorrectionReducer from 'features/track-correction/track-correction.slice'
import userReducer from 'features/user/user.slice'
import vesselReducer from 'features/vessel/vessel.slice'
import vesselGroupsReducer from 'features/vessel-groups/vessel-groups.slice'
import vesselGroupsModalReducer from 'features/vessel-groups/vessel-groups-modal.slice'
import workspaceReducer from 'features/workspace/workspace.slice'
import workspacesReducer from 'features/workspaces-list/workspaces-list.slice'
import descriptionReducer from 'routes/description.reducer'
import connectedRoutes from 'routes/routes'
import titleReducer from 'routes/title.reducer'

export const rootReducer = combineReducers({
  ...queriesApiReducers,
  areas: areasReducer,
  bigQuery: bigQueryReducer,
  datasets: datasetsReducer,
  dataviews: dataviewsReducer,
  debug: debugReducer,
  description: descriptionReducer,
  downloadActivity: downloadActivityReducer,
  downloadTrack: downloadTrackReducer,
  editor: editorReducer,
  hints: hintsReducer,
  location: connectedRoutes.reducer,
  map: mapReducer,
  mapControls: mapControlsReducer,
  modals: modalsReducer,
  regions: regionsReducer,
  report: reportReducer,
  reports: reportsReducer,
  resources: resourcesReducer,
  screenshot: screenshotReducer,
  search: searchReducer,
  timebar: timebarReducer,
  title: titleReducer,
  trackCorrection: trackCorrectionReducer,
  user: userReducer,
  vessel: vesselReducer,
  vesselGroupModal: vesselGroupsModalReducer,
  vesselGroupReport: vesselGroupReportReducer,
  vesselGroups: vesselGroupsReducer,
  workspace: workspaceReducer,
  workspaces: workspacesReducer,
})

export type RootState = ReturnType<typeof rootReducer>
