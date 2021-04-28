import { createSelector } from 'reselect'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import {
  resolveDataviews,
  UrlDataviewInstance,
  // mergeWorkspaceUrlDataviewInstances,
  getGeneratorConfig,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasets, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { dataviewInstances } from './dataviews.config'
import { selectAllDataviews, selectDataviewsStatus } from './dataviews.slice'

export const selectDataviews = createSelector([selectAllDataviews], (dataviews) => {
  return dataviews
})

const defaultBasemapDataview = {
  id: 'basemap',
  config: {
    type: Generators.Type.Basemap,
    basemap: Generators.BasemapType.Default,
  },
}

export const selectBasemapDataview = createSelector([selectDataviews], (dataviews) => {
  const basemapDataview = dataviews.find((d) => d.config.type === GeneratorType.Basemap)
  return basemapDataview || defaultBasemapDataview
})

export const selectDefaultBasemapGenerator = createSelector(
  [selectBasemapDataview],
  (basemapDataview) => {
    const basemapGenerator = getGeneratorConfig(
      basemapDataview as UrlDataviewInstance<Type>
    ) as Generators.BasemapGeneratorConfig
    return basemapGenerator
  }
)

export const selectDataviewInstancesResolved = createSelector(
  [selectDataviewsStatus, selectDataviews, selectDatasets, selectDatasetsStatus],
  (dataviewsStatus, dataviews, datasets, datasetsStatus): UrlDataviewInstance[] | undefined => {
    if (
      dataviewsStatus !== AsyncReducerStatus.Finished ||
      datasetsStatus !== AsyncReducerStatus.Finished
    )
      return
    const dataviewInstancesResolved = resolveDataviews(dataviewInstances, dataviews, datasets)
    return dataviewInstancesResolved
  }
)

export const selectDataviewInstancesByType = (type: Generators.Type) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectDataviewInstancesByCategory = (category: DataviewCategory) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.category === category)
  })
}

export const selectDataviewInstancesByIds = (ids: string[]) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => ids.includes(dataview.id))
  })
}

export const selectVesselsDataviews = createSelector(
  [selectDataviewInstancesByType(Generators.Type.Track)],
  (dataviews) => dataviews
)

export const selectActiveVesselsDataviews = createSelector([selectVesselsDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

// export const selectEventsDataviews = createSelector(
//   [selectDataviewInstancesByCategory(DataviewCategory.Events)],
//   (dataviews) => dataviews
// )
