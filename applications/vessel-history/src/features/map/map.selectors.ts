import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client/dist/api-client'
import {
  getDataviewsGeneratorConfigs,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
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

export const selectGlobalGeneratorsConfig = createSelector(
  [
    // selectViewport, selectTimeRange
  ],
  () =>
    // { zoom }, { start, end }
    ({
      zoom: DEFAULT_WORKSPACE.zoom,
      start: DEFAULT_WORKSPACE.start,
      end: DEFAULT_WORKSPACE.end,
      token: GFWAPI.getToken(),
    })
)

type GetGeneratorConfigParams = {
  dataviews: UrlDataviewInstance[] | undefined
  resources: ResourcesState
  rulers: Generators.Ruler[]
  highlightedTime?: Range
  staticTime: Range
  bivariate: boolean
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
      rulers: [],
      staticTime: {
        start: DEFAULT_WORKSPACE.start,
        end: DEFAULT_WORKSPACE.end,
      },
      bivariate: false,
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
