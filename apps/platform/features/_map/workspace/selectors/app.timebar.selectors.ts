import { createSelector } from '@reduxjs/toolkit'

import { DEFAULT_TIME_RANGE } from 'data/map/config'
import {
  selectActiveUserPointsWithTimeRangeDataviews,
  selectActiveVesselsDataviews,
  selectVesselGroupDataviews,
} from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveHeatmapEnvironmentalDataviewsWithoutStatic } from 'features/_map/dataviews/selectors/dataviews.selectors'
import type { TimeRange } from 'features/_map/timebar/timebar.slice'
import {
  selectWorkspaceStateProperty,
  selectWorkspaceTimeRange,
} from 'features/_map/workspace/workspace.selectors'
import { selectIsAnyVesselLocation, selectUrlTimeRange } from 'router/routes.selectors'
import { TimebarGraphs, TimebarVisualisations } from 'types'

export const selectTimeRange = createSelector(
  [selectUrlTimeRange, selectWorkspaceTimeRange],
  (urlTimerange, workspaceTimerange) => {
    return {
      start: urlTimerange?.start || workspaceTimerange?.start || DEFAULT_TIME_RANGE.start,
      end: urlTimerange?.end || workspaceTimerange?.end || DEFAULT_TIME_RANGE.end,
    } as TimeRange
  }
)

const selectTimebarVisualisationSelector = selectWorkspaceStateProperty('timebarVisualisation')
export const selectTimebarVisualisation = createSelector(
  [selectTimebarVisualisationSelector, selectIsAnyVesselLocation],
  (timebarVisualisation, isAnyVesselLocation): TimebarVisualisations => {
    if (isAnyVesselLocation) return TimebarVisualisations.Vessel
    return timebarVisualisation as TimebarVisualisations
  }
)

const selectTimebarSelectedEnvIdSelector = selectWorkspaceStateProperty('timebarSelectedEnvId')
export const selectTimebarSelectedEnvId = createSelector(
  [
    selectTimebarSelectedEnvIdSelector,
    selectTimebarVisualisation,
    selectActiveHeatmapEnvironmentalDataviewsWithoutStatic,
  ],
  (timebarSelectedEnvId, timebarVisualisation, envDataviews): string => {
    if (timebarVisualisation === TimebarVisualisations.Environment) {
      const isAvailable = envDataviews.some((d) => d.id === timebarSelectedEnvId)
      return isAvailable ? timebarSelectedEnvId : envDataviews[0]?.id
    }
    return timebarSelectedEnvId
  }
)

const selectTimebarSelectedUserIdSelector = selectWorkspaceStateProperty('timebarSelectedUserId')
export const selectTimebarSelectedUserId = createSelector(
  [
    selectTimebarSelectedUserIdSelector,
    selectTimebarVisualisation,
    selectActiveUserPointsWithTimeRangeDataviews,
  ],
  (timebarSelectedUserId, timebarVisualisation, userPointsDataviews): string => {
    if (timebarVisualisation === TimebarVisualisations.Points) {
      const isAvailable = userPointsDataviews.some((d) => d.id === timebarSelectedUserId)
      return isAvailable ? timebarSelectedUserId : userPointsDataviews[0]?.id
    }
    return timebarSelectedUserId
  }
)
const selectTimebarSelectedVGIdSelector = selectWorkspaceStateProperty('timebarSelectedVGId')
export const selectTimebarSelectedVGId = createSelector(
  [selectTimebarSelectedVGIdSelector, selectTimebarVisualisation, selectVesselGroupDataviews],
  (timebarSelectedVGId, timebarVisualisation, vesselGroupDataviews): string => {
    if (timebarVisualisation === TimebarVisualisations.VesselGroup) {
      return timebarSelectedVGId || vesselGroupDataviews[0]?.id
    }
    return timebarSelectedVGId
  }
)

const selectTimebarGraphSelector = selectWorkspaceStateProperty('timebarGraph')
export const selectTimebarGraph = createSelector(
  [selectTimebarGraphSelector, selectActiveVesselsDataviews],
  (timebarGraph, vessels): TimebarGraphs => {
    return vessels && vessels.length ? timebarGraph : TimebarGraphs.None
  }
)
