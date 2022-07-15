import { useCallback, useEffect, useMemo, useRef } from 'react'
import { debounce } from 'lodash'
import {
  Interval,
  GeneratorType,
  ExtendedStyleMeta,
  CONFIG_BY_INTERVAL,
  pickActiveTimeChunk,
  ExtendedLayer,
} from '@globalfishingwatch/layer-composer'
import { aggregateCell, SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import type { Map, GeoJSONFeature, MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { ExtendedFeature, InteractionEventCallback, InteractionEvent } from '.'

export type MaplibreGeoJSONFeature = GeoJSONFeature & {
  layer: ExtendedLayer
  source: string
  sourceLayer: string
  state: { [key: string]: any }
  properties: any
}

type FeatureStates = 'click' | 'hover' | 'highlight'
type FeatureStateSource = { source: string; sourceLayer: string; id: string; state?: FeatureStates }

export const filterUniqueFeatureInteraction = (features: ExtendedFeature[]) => {
  const uniqueLayerIdFeatures: Record<string, string> = {}
  const filtered = features?.filter(({ layerId, id, uniqueFeatureInteraction }) => {
    if (!uniqueFeatureInteraction) {
      return true
    }
    if (uniqueLayerIdFeatures[layerId] === undefined) {
      uniqueLayerIdFeatures[layerId] = id
      return true
    }
    return uniqueLayerIdFeatures[layerId] === id
  })
  return filtered
}

const getExtendedFeatures = (
  features: MaplibreGeoJSONFeature[],
  metadata?: ExtendedStyleMeta,
  debug = false
): ExtendedFeature[] => {
  const extendedFeatures: ExtendedFeature[] = features.flatMap((feature) => {
    const generatorType = feature.layer.metadata?.generatorType ?? null
    const generatorId = feature.layer.metadata?.generatorId ?? null

    // TODO: if no generatorMetadata is found, fallback to feature.layer.metadata, but the former should be prefered
    let generatorMetadata: any
    if (generatorId && metadata?.generatorsMetadata && metadata?.generatorsMetadata[generatorId]) {
      generatorMetadata = metadata?.generatorsMetadata[generatorId]
    } else {
      generatorMetadata = feature.layer.metadata
    }

    const uniqueFeatureInteraction = feature.layer?.metadata?.uniqueFeatureInteraction ?? false
    const properties = feature.properties || {}
    const extendedFeature: ExtendedFeature | null = {
      properties,
      generatorType,
      generatorId,
      layerId: feature.layer.id,
      source: feature.source,
      sourceLayer: feature.sourceLayer,
      uniqueFeatureInteraction,
      id: (feature.id as number) || feature.properties?.gfw_id || undefined,
      value: properties.value || properties.name || properties.id,
      tile: {
        x: (feature as any)._vectorTileFeature._x,
        y: (feature as any)._vectorTileFeature._y,
        z: (feature as any)._vectorTileFeature._z,
      },
    }
    switch (generatorType) {
      case GeneratorType.HeatmapAnimated:
        const timeChunks = generatorMetadata?.timeChunks
        const frame = timeChunks?.activeChunkFrame
        const activeTimeChunk = pickActiveTimeChunk(timeChunks)

        // This is used when querying the interaction endpoint, so that start begins at the start of the frame (ie start of a 10days interval)
        // This avoids querying a cell visible on the map, when its actual timerange is not included in the app-overall time range
        const getDate = CONFIG_BY_INTERVAL[timeChunks.interval as Interval].getDate
        const visibleStartDate = getDate(timeChunks.visibleStartFrame).toISOString()
        const visibleEndDate = getDate(timeChunks.visibleEndFrame).toISOString()
        const numSublayers = generatorMetadata?.numSublayers
        const values = aggregateCell({
          rawValues: properties.rawValues,
          frame,
          delta: Math.max(1, timeChunks.deltaInIntervalUnits),
          quantizeOffset: activeTimeChunk.quantizeOffset,
          sublayerCount:
            generatorMetadata?.sublayerCombinationMode === SublayerCombinationMode.TimeCompare
              ? 2
              : numSublayers,
          aggregationOperation: generatorMetadata?.aggregationOperation,
          sublayerCombinationMode: generatorMetadata?.sublayerCombinationMode,
          multiplier: generatorMetadata?.multiplier,
        })

        if (debug) {
          console.log(properties.rawValues)
        }

        // Clean values with 0 for sum aggregation and with NaN for avg aggregation layers
        if (!values || !values.filter((v: number) => v !== 0 && !isNaN(v)).length) return []
        const visibleSublayers = generatorMetadata?.visibleSublayers as boolean[]
        const sublayers = generatorMetadata?.sublayers
        return values.flatMap((value: any, i: number) => {
          if (value === 0) return []
          const temporalGridExtendedFeature: ExtendedFeature = {
            ...extendedFeature,
            temporalgrid: {
              sublayerIndex: i,
              sublayerId: sublayers[i].id,
              sublayerInteractionType: sublayers[i].interactionType,
              sublayerCombinationMode: generatorMetadata?.sublayerCombinationMode,
              visible: visibleSublayers[i] === true,
              col: properties._col as number,
              row: properties._row as number,
              interval: timeChunks.interval,
              visibleStartDate,
              visibleEndDate,
              unit: sublayers[i].legend.unit,
            },
            value,
          }
          return [temporalGridExtendedFeature]
        })
      case GeneratorType.Context:
      case GeneratorType.UserPoints:
      case GeneratorType.UserContext:
        return {
          ...extendedFeature,
          gfwId: feature.properties?.gfw_id,
          datasetId: feature.layer.metadata?.datasetId,
          generatorContextLayer: feature.layer.metadata?.layer,
          geometry: feature.geometry,
        }
      default:
        return extendedFeature
    }
  })
  return extendedFeatures
}

let sourcesWithFeatureState: FeatureStateSource[] = []

export const useFeatureState = (map?: Map) => {
  const cleanFeatureState = useCallback(
    (state: FeatureStates = 'hover') => {
      if (map) {
        sourcesWithFeatureState?.forEach((source: FeatureStateSource) => {
          const feature = map.getFeatureState(source)
          // https://github.com/mapbox/mapbox-gl-js/issues/9461
          if (feature?.hasOwnProperty(state)) {
            map.removeFeatureState(source, state)
          }
        })
      }
    },
    [map]
  )

  const updateFeatureState = useCallback(
    (extendedFeatures: FeatureStateSource[], state: FeatureStates = 'hover') => {
      const newSourcesWithClickState: FeatureStateSource[] = extendedFeatures.flatMap((feature) => {
        if (!map || feature.id === undefined) {
          return []
        }
        map.setFeatureState(
          {
            source: feature.source,
            sourceLayer: feature.sourceLayer,
            id: feature.id,
          },
          { [state]: true }
        )

        // Add source to active feature states
        return {
          state,
          id: feature.id,
          source: feature.source,
          sourceLayer: feature.sourceLayer,
        }
      })
      const previousSources = sourcesWithFeatureState.filter((source) => source.state !== state)
      sourcesWithFeatureState = [...previousSources, ...newSourcesWithClickState]
    },
    [map]
  )

  const featureState = useMemo(
    () => ({ cleanFeatureState, updateFeatureState }),
    [cleanFeatureState, updateFeatureState]
  )
  return featureState
}

export type MapInteractionType = 'deck' | 'maplibre'
export const useMapClick = (
  clickCallback: InteractionEventCallback,
  metadata: ExtendedStyleMeta,
  map?: Map
) => {
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const onMapClick = useCallback(
    (event: MapLayerMouseEvent, type: MapInteractionType = 'maplibre') => {
      console.log('TODO: handle intereaction by different type:', type)
      cleanFeatureState('click')
      if (!clickCallback) return
      const interactionEvent: InteractionEvent = {
        type: 'click',
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        point: event.point,
      }
      if (event.features?.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(
          event.features as MaplibreGeoJSONFeature[],
          metadata,
          false
        )
        const extendedFeaturesLimit = filterUniqueFeatureInteraction(extendedFeatures)

        if (extendedFeaturesLimit.length) {
          interactionEvent.features = extendedFeaturesLimit
          updateFeatureState(extendedFeaturesLimit, 'click')
        }
      }
      clickCallback(interactionEvent)
    },
    [cleanFeatureState, clickCallback, metadata, updateFeatureState]
  )

  return onMapClick
}

type MapHoverConfig = {
  debounced?: number
}

const parseHoverEvent = (event: MapLayerMouseEvent): InteractionEvent => {
  return {
    type: 'hover',
    point: event.point,
    longitude: event.lngLat.lng,
    latitude: event.lngLat.lat,
  }
}

export const useMapHover = (
  hoverCallbackImmediate?: InteractionEventCallback,
  hoverCallback?: InteractionEventCallback,
  map?: Map,
  metadata?: ExtendedStyleMeta,
  config?: MapHoverConfig
) => {
  const { debounced = 300 } = config || ({} as MapHoverConfig)
  // Keep a list of active feature state sources, so that we can turn them off when hovering away
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)

  const hoverCallbackDebounced = useRef<any>(null)
  useEffect(() => {
    const debouncedFn = debounce((e) => {
      if (hoverCallback) hoverCallback(e)
    }, debounced)

    hoverCallbackDebounced.current = debouncedFn
  }, [debounced, hoverCallback])

  const onMapHover = useCallback(
    (event: MapLayerMouseEvent) => {
      const hoverEvent = parseHoverEvent(event)
      // Turn all sources with active feature states off
      cleanFeatureState()
      if (event.features?.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(
          event.features as MaplibreGeoJSONFeature[],
          metadata
        )
        const extendedFeaturesLimit = filterUniqueFeatureInteraction(extendedFeatures)

        if (extendedFeaturesLimit.length) {
          hoverEvent.features = extendedFeaturesLimit
        }

        updateFeatureState(extendedFeaturesLimit, 'hover')
      }

      if (hoverCallbackDebounced?.current) {
        hoverCallbackDebounced.current.cancel()
        hoverCallbackDebounced.current(hoverEvent)
      }
      if (hoverCallbackImmediate) {
        hoverCallbackImmediate(hoverEvent)
      }
    },
    [cleanFeatureState, hoverCallbackImmediate, metadata, updateFeatureState]
  )

  return onMapHover
}

export const useSimpleMapHover = (hoverCallback: InteractionEventCallback) => {
  const onMapHover = useCallback(
    (event: MapLayerMouseEvent) => {
      const hoverEvent = parseHoverEvent(event)
      if (hoverCallback) {
        hoverCallback(hoverEvent)
      }
    },
    [hoverCallback]
  )

  return onMapHover
}
