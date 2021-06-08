import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client/dist/api-client'
import {
  getDataviewsGeneratorConfigs,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  selectDataviewInstancesResolved,
  selectDefaultBasemapGenerator,
  selectDefaultOfflineDataviewsGenerators,
} from 'features/dataviews/dataviews.selectors'
import { selectVesselsStatus } from 'features/vessels/vessels.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { ResourcesState, selectResources } from 'features/resources/resources.slice'
import { DEFAULT_WORKSPACE } from 'data/config'
import { Range } from 'types'
import { selectTimeRange, selectViewport } from 'features/app/app.selectors'

export const selectGlobalGeneratorsConfig = createSelector(
  [selectViewport, selectTimeRange],
  ({ zoom }, { start, end }) => ({
    zoom,
    start,
    end,
    token: GFWAPI.getToken(),
  })
)

type GetGeneratorConfigParams = {
  dataviews: UrlDataviewInstance[] | undefined
  resources: ResourcesState
  staticTime: Range
}

const getGeneratorsConfig = ({
  dataviews = [],
  resources,
  staticTime,
}: GetGeneratorConfigParams) => {
  const generatorOptions = {
    timeRange: staticTime,
  }

  const generatorsConfig = getDataviewsGeneratorConfigs(dataviews, generatorOptions, resources)

  return generatorsConfig.reverse()
}

const selectMapGeneratorsConfig = createSelector(
  [selectDataviewInstancesResolved, selectResources],
  (dataviews = [], resources) => {
    return getGeneratorsConfig({
      dataviews,
      resources,
      staticTime: {
        start: DEFAULT_WORKSPACE.start,
        end: DEFAULT_WORKSPACE.end,
      },
    })
  }
)

export const selectDefaultMapGeneratorsConfig = createSelector(
  [
    selectVesselsStatus,
    selectDefaultBasemapGenerator,
    selectMapGeneratorsConfig,
    selectDefaultOfflineDataviewsGenerators,
  ],
  (vesselStatus, basemapGenerator, mapGeneratorsConfig, offlineDataviewsGenerators) => {
    return vesselStatus !== AsyncReducerStatus.Finished
      ? [...offlineDataviewsGenerators, basemapGenerator]
      : [...offlineDataviewsGenerators, ...mapGeneratorsConfig]
  }
)
