import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client/dist/api-client'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import { SymbolLayer, SymbolLayout } from '@globalfishingwatch/mapbox-gl'
import {
  getDataviewsGeneratorConfigs,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  selectDataviewsForResourceQuerying,
  selectDefaultBasemapGenerator,
  selectDefaultOfflineDataviewsGenerators,
} from 'features/dataviews/dataviews.selectors'
import { selectVesselsStatus } from 'features/vessels/vessels.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { ResourcesState } from 'features/resources/resources.slice'
import { DEBUG_MODE, DEFAULT_WORKSPACE } from 'data/config'
import { Range } from 'types'
import { selectTimeRange, selectViewport } from 'features/app/app.selectors'
import { selectFilters } from 'features/event-filters/filters.slice'
import { selectVisibleResources } from 'features/resources/resources.selectors'
import { selectVesselLastPositionGEOJson } from 'features/vessels/activity/vessels-activity.selectors'
import { selectHighlightedEvent, selectHighlightedTime, selectMapVoyageTime } from './map.slice'

/**
 * get the start and end dates in timestamp format
 */
export const selectMapTimeRange = createSelector(
  [selectMapVoyageTime, selectFilters],
  (voyageTime, filters) =>
    voyageTime
      ? {
          start: voyageTime.start ?? filters.start,
          end: voyageTime.end ?? filters.end,
        }
      : undefined
)

export const selectGlobalGeneratorsConfig = createSelector(
  [selectViewport, selectMapTimeRange, selectTimeRange],
  ({ zoom }, selectMapTimeRange, { start, end }) => ({
    zoom,
    start: selectMapTimeRange?.start ?? start,
    end: selectMapTimeRange?.end ?? end,
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
  [
    selectDataviewsForResourceQuerying,
    selectVisibleResources,
    selectHighlightedTime,
    selectHighlightedEvent,
    selectMapVoyageTime,
  ],
  (dataviews = [], resources, highlightedTime, highlightedEvent, voyageTime) => {
    return getGeneratorsConfig({
      dataviews,
      resources,
      staticTime: {
        start: voyageTime?.start ?? DEFAULT_WORKSPACE.start,
        end: voyageTime?.end ?? DEFAULT_WORKSPACE.end,
      },
      highlightedTime,
      highlightedEvent,
    })
  }
)

export const selectVesselLastPositionGenerator = createSelector(
  [selectVesselLastPositionGEOJson],
  (lastPositionGEOJson) => {
    if (!lastPositionGEOJson) return

    const generator: Generators.GlGeneratorConfig = {
      id: 'last-position',
      type: Generators.Type.GL,
      sources: [lastPositionGEOJson],
      layers: [
        {
          id: 'last-position-symbol',
          type: 'symbol',
          layout: {
            'icon-allow-overlap': true,
            'icon-image': 'arrow-inner',
            'icon-size': 1.5,
            'icon-rotate': ['get', 'course'],
            visibility: 'visible',
          } as SymbolLayout,
        } as SymbolLayer,
      ],
    }

    return generator
  }
)

export const selectDefaultMapGeneratorsConfig = createSelector(
  [
    selectVesselsStatus,
    selectDefaultBasemapGenerator,
    selectMapGeneratorsConfig,
    selectDefaultOfflineDataviewsGenerators,
    selectVesselLastPositionGenerator,
  ],
  (
    vesselStatus,
    basemapGenerator,
    mapGeneratorsConfig,
    offlineDataviewsGenerators,
    vesselLastPositionGenerator
  ) => {
    return vesselStatus !== AsyncReducerStatus.Finished
      ? [...offlineDataviewsGenerators, basemapGenerator]
      : [...offlineDataviewsGenerators, ...mapGeneratorsConfig, vesselLastPositionGenerator]
  }
)
