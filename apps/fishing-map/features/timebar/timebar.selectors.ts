import { createSelector } from '@reduxjs/toolkit'
import { getDatasetsExtent } from '@globalfishingwatch/dataviews-client'
import { TimebarVisualisations } from 'types'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import {
  selectTimebarSelectedEnvId,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import { AVAILABLE_END, AVAILABLE_START } from 'data/config'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'

export const selectDatasetsExtent = createSelector(
  [selectDataviewInstancesResolved, selectAllDatasets],
  (dataviews, datasets) => {
    const activeDataviewDatasets = getDatasetsInDataviews(dataviews)
    const activeDatasets = datasets.filter((d) => activeDataviewDatasets.includes(d.id))
    return getDatasetsExtent(activeDatasets, {
      format: 'timestamp',
    })
  }
)

export const selectAvailableStart = createSelector([selectDatasetsExtent], (datasetsExtent) => {
  const defaultAvailableStartMs = new Date(AVAILABLE_START).getTime()
  const availableStart = new Date(
    Math.min(defaultAvailableStartMs, (datasetsExtent.extentStart as number) || Infinity)
  ).toISOString()
  return availableStart
})

export const selectAvailableEnd = createSelector([selectDatasetsExtent], (datasetsExtent) => {
  const defaultAvailableEndMs = new Date(AVAILABLE_END).getTime()
  const availableEndMs = new Date(
    Math.max(defaultAvailableEndMs, (datasetsExtent.extentEnd as number) || -Infinity)
  ).toISOString()
  return availableEndMs
})

export const selectTimebarSelectedDataviews = createSelector(
  [
    selectTimebarVisualisation,
    selectTimebarSelectedEnvId,
    selectActiveDetectionsDataviews,
    selectActiveActivityDataviews,
    selectActiveEnvironmentalDataviews,
  ],
  (
    timebarVisualisation,
    timebarSelectedEnvId,
    detectionsDataviews,
    activityDataviews,
    environmentalDataviews
  ) => {
    if (!timebarVisualisation) return []
    if (timebarVisualisation === TimebarVisualisations.Environment) {
      return environmentalDataviews.filter((d) => d.id === timebarSelectedEnvId)
    }
    return timebarVisualisation === TimebarVisualisations.HeatmapDetections
      ? detectionsDataviews
      : activityDataviews
  }
)
