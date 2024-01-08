import { createSelector } from '@reduxjs/toolkit'
import { DEFAULT_TIME_RANGE } from 'data/config'
import { selectEnvironmentalDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { TimeRange } from 'features/timebar/timebar.slice'
import {
  selectWorkspaceStateProperty,
  selectWorkspaceTimeRange,
} from 'features/workspace/workspace.selectors'
import { selectIsAnyVesselLocation, selectUrlTimeRange } from 'routes/routes.selectors'
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

export const selectTimebarVisualisation = createSelector(
  [selectWorkspaceStateProperty('timebarVisualisation'), selectIsAnyVesselLocation],
  (timebarVisualisation, isAnyVesselLocation): TimebarVisualisations => {
    if (isAnyVesselLocation) return TimebarVisualisations.Vessel
    return timebarVisualisation
  }
)

export const selectTimebarSelectedEnvId = createSelector(
  [
    selectWorkspaceStateProperty('timebarSelectedEnvId'),
    selectTimebarVisualisation,
    selectEnvironmentalDataviews,
  ],
  (timebarSelectedEnvId, timebarVisualisation, envDataviews): string => {
    if (timebarVisualisation === TimebarVisualisations.Environment) {
      return timebarSelectedEnvId || envDataviews[0]?.id
    }
    return timebarSelectedEnvId
  }
)

export const selectTimebarGraph = createSelector(
  [selectWorkspaceStateProperty('timebarGraph'), selectActiveVesselsDataviews],
  (timebarGraph, vessels): TimebarGraphs => {
    return vessels && vessels.length ? timebarGraph : TimebarGraphs.None
  }
)
