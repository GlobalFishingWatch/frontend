import { createSelector } from '@reduxjs/toolkit'
import {
  getDatasetConfigByDatasetType,
  getDatasetConfigsByDatasetType,
  resolveDataviewDatasetResources,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DatasetTypes, DataviewDatasetConfig } from '@globalfishingwatch/api-types'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
import { selectVisibleEvents } from 'features/app/app.selectors'
import { selectResources } from './resources.slice'

export const selectVisibleResources = createSelector(
  [selectResources, selectVisibleEvents],
  (resources, visibleEvents) => {
    if (visibleEvents === 'all') {
      return resources
    }
    return Object.fromEntries(
      Object.entries(resources).filter(([url, resource]) => {
        return url.includes('events') && resource.dataset?.configuration?.type
          ? visibleEvents.includes(resource.dataset.configuration.type)
          : true
      })
    )
  }
)

/**
 * Prepare dataviews for querying resources, by altering dataset configs
 * - Filter out non track dvs
 * - Add thinning query params
 * - Add extra dataset config for track speed, if needed
 * - Filter events dataset configs
 */
export const selectDataviewsForResourceQuerying = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => {
    const trackDataviewsInstances = dataviewInstances.filter(
      (dataviewInstance) => dataviewInstance.config?.type === Generators.Type.Track
    )
    const preparedDataviews = trackDataviewsInstances.map((dataview) => {
      const infoDatasetConfig = getDatasetConfigByDatasetType(dataview, DatasetTypes.Vessels)

      const trackDatasetType =
        dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
          ? DatasetTypes.UserTracks
          : DatasetTypes.Tracks
      const trackDatasetConfig = getDatasetConfigByDatasetType(dataview, trackDatasetType)
      // TODO alter thinning parameters here
      // TODO duplicate dataset Config with only speed field if needed by timebar

      const eventsDatasetConfigs = getDatasetConfigsByDatasetType(
        dataview,
        DatasetTypes.Events
      ).filter((datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value) // Loitering

      const preparedDatasetConfigs = [
        trackDatasetConfig,
        infoDatasetConfig,
        ...eventsDatasetConfigs,
      ] as DataviewDatasetConfig[]
      const preparedDataview = {
        ...dataview,
      }
      preparedDataview.datasetsConfig = preparedDatasetConfigs
      return preparedDataview
    })
    return preparedDataviews
  }
)

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewsForResourceQuerying],
  (dataviewInstances) => resolveDataviewDatasetResources(dataviewInstances ?? [])
)
