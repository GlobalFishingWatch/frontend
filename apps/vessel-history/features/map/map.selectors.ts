import { createSelector } from '@reduxjs/toolkit'
import { GFWApiClient } from 'http-client/http-client'
import type { Range } from 'types'

import type { ApiEvent } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type {
  GlGeneratorConfig} from '@globalfishingwatch/layer-composer';
import {
  GeneratorType,
  getDataviewsGeneratorConfigs
} from '@globalfishingwatch/layer-composer'
import type { SymbolLayerSpecification } from '@globalfishingwatch/maplibre-gl'

import { DEBUG_MODE, DEFAULT_WORKSPACE, LAST_POSITION_LAYERS_PREFIX } from 'data/config'
import { selectTimeRange, selectViewport } from 'features/app/app.selectors'
import {
  selectDataviewsForResourceQuerying,
  selectDefaultBasemapGenerator,
  selectDefaultOfflineDataviewsGenerators,
} from 'features/dataviews/dataviews.selectors'
import { selectFilters } from 'features/event-filters/filters.slice'
import { selectVisibleResources } from 'features/resources/resources.selectors'
import type { ResourcesState } from 'features/resources/resources.slice'
import { selectVesselLastPositionGEOJson } from 'features/vessels/activity/vessels-activity.selectors'
import { selectVesselsStatus } from 'features/vessels/vessels.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

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
    token: GFWApiClient.getToken(),
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

    const generator: GlGeneratorConfig = {
      id: 'last-position',
      type: GeneratorType.GL,
      sources: [lastPositionGEOJson],
      layers: [
        {
          id: `${LAST_POSITION_LAYERS_PREFIX}-symbol-outline`,
          type: 'symbol',
          layout: {
            'icon-allow-overlap': true,
            'icon-image': 'arrow-outer',
            'icon-size': 2,
            'icon-rotate': ['get', 'course'],
            visibility: 'visible',
          } as SymbolLayerSpecification['layout'],
        } as SymbolLayerSpecification,
        {
          id: LAST_POSITION_LAYERS_PREFIX,
          type: 'symbol',
          layout: {
            'icon-allow-overlap': true,
            'icon-image': 'arrow-inner',
            'icon-size': 1.5,
            'icon-rotate': ['get', 'course'],
            visibility: 'visible',
          } as SymbolLayerSpecification['layout'],
        } as SymbolLayerSpecification,
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
    const generators =
      vesselStatus !== AsyncReducerStatus.Finished
        ? [...offlineDataviewsGenerators, basemapGenerator]
        : [...offlineDataviewsGenerators, ...mapGeneratorsConfig, vesselLastPositionGenerator]
    return generators.filter(Boolean)
  }
)
