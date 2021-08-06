import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client/dist/api-client'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
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
import { DEBUG_MODE, DEFAULT_WORKSPACE } from 'data/config'
import { Range } from 'types'
import { selectTimeRange, selectViewport } from 'features/app/app.selectors'
import { selectHighlightedEvent, selectHighlightedTime } from './map.slice'

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
  highlightedTime?: Range
  highlightedEvent?: ApiEvent
}

const getGeneratorsConfig = ({
  dataviews = [],
  resources,
  staticTime,
  highlightedTime,
  highlightedEvent,
}: GetGeneratorConfigParams) => {
  const generatorOptions = {
    timeRange: staticTime,
    highlightedEvent,
    highlightedTime,
    debug: DEBUG_MODE,
  }

  const generatorsConfig = getDataviewsGeneratorConfigs(dataviews, generatorOptions, resources)

  return generatorsConfig.reverse()
}

const selectMapGeneratorsConfig = createSelector(
  [selectDataviewInstancesResolved, selectResources, selectHighlightedTime, selectHighlightedEvent],
  (dataviews = [], resources, highlightedTime, highlightedEvent) => {
    return getGeneratorsConfig({
      dataviews,
      resources,
      staticTime: {
        start: DEFAULT_WORKSPACE.start,
        end: DEFAULT_WORKSPACE.end,
      },
      highlightedTime,
      highlightedEvent,
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
