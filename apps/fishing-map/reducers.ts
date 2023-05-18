import { combineReducers } from '@reduxjs/toolkit'
import { dataviewStatsApi } from 'queries/stats-api'
import descriptionReducer from 'routes/description.reducer'
import areasReducer from 'features/areas/areas.slice'
import bigQueryReducer from 'features/bigquery/bigquery.slice'
import connectedRoutes from 'routes/routes'
import datasetsReducer from 'features/datasets/datasets.slice'
import dataviewsReducer from 'features/dataviews/dataviews.slice'
import debugReducer from 'features/debug/debug.slice'
import downloadActivityReducer from 'features/download/downloadActivity.slice'
import downloadTrackReducer from 'features/download/downloadTrack.slice'
import editorReducer from 'features/editor/editor.slice'
import hintsReducer from 'features/help/hints.slice'
import mapReducer from 'features/map/map.slice'
import modalsReducer from 'features/modals/modals.slice'
import reportReducer from 'features/reports/report.slice'
import reportsReducer from 'features/reports/reports.slice'
import resourcesReducer from 'features/resources/resources.slice'
import rulersReducer from 'features/map/rulers/rulers.slice'
import searchReducer from 'features/search/search.slice'
import timebarReducer from 'features/timebar/timebar.slice'
import titleReducer from 'routes/title.reducer'
import userReducer from 'features/user/user.slice'
import vesselGroupsReducer from 'features/vessel-groups/vessel-groups.slice'
import workspaceReducer from 'features/workspace/workspace.slice'
import workspacesReducer from 'features/workspaces-list/workspaces-list.slice'

export const rootReducer = combineReducers({
  [dataviewStatsApi.reducerPath]: dataviewStatsApi.reducer,
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
  modals: modalsReducer,
  report: reportReducer,
  reports: reportsReducer,
  resources: resourcesReducer,
  rulers: rulersReducer,
  search: searchReducer,
  timebar: timebarReducer,
  title: titleReducer,
  user: userReducer,
  vesselGroups: vesselGroupsReducer,
  workspace: workspaceReducer,
  workspaces: workspacesReducer,
})

export type RootState = ReturnType<typeof rootReducer>
