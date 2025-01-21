import { useCallback, useEffect, useMemo, useRef } from 'react'
import { debounce } from 'es-toolkit'

import { DataviewType } from '@globalfishingwatch/api-types'
import { aggregateCell, SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import type {
  ExtendedLayer,  ExtendedStyleMeta,
  Interval} from '@globalfishingwatch/layer-composer';
import {
  CONFIG_BY_INTERVAL,
  Group,
  pickActiveTimeChunk,
} from '@globalfishingwatch/layer-composer'
import type { GeoJSONFeature, Map, MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'

import type { ExtendedFeature, InteractionEvent,InteractionEventCallback } from '.'

export type MaplibreGeoJSONFeature = GeoJSONFeature & {
  layer: ExtendedLayer
  source: string
  sourceLayer: string
  state: { [key: string]: any }
  properties: any
}

type FeatureStates = 'click' | 'hover' | 'highlight'
type FeatureStateSource = {
  id: string
  source: string
  sourceLayer?: string
  state?: FeatureStates
}

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

const getId = (feature: MaplibreGeoJSONFeature) => {
  const promoteIdValue =
    feature.layer.metadata?.promoteId && feature.properties[feature.layer.metadata?.promoteId]
  if (feature.id !== undefined) {
    return feature.id
  } else if (feature.properties?.gfw_id !== undefined) {
    return feature.properties?.gfw_id
  } else if (promoteIdValue !== undefined) {
    return promoteIdValue
  }
}

const getFeatureTile = (feature: MaplibreGeoJSONFeature) => {
  return {
    x: (feature as any)._vectorTileFeature._x,
    y: (feature as any)._vectorTileFeature._y,
    z: (feature as any)._vectorTileFeature._z,
  }
}

const getExtendedFeature = (
  feature: MaplibreGeoJSONFeature,
  metadata?: ExtendedStyleMeta,
  debug = false
): ExtendedFeature[] => {
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
  const stopPropagation = feature.layer?.metadata?.stopPropagation ?? false
  const properties = feature.properties || {}

  let value = properties.value || properties.name || properties?.count || properties.id
  const { valueProperties } = feature.layer.metadata || {}
  if (valueProperties?.length) {
    value =
      valueProperties.length === 1
        ? properties[valueProperties[0]]
        : valueProperties
            .flatMap((prop) => (properties[prop] ? `${prop}: ${properties[prop]}` : []))
            .join('<br/>')
  }

  const extendedFeature: ExtendedFeature | null = {
    properties,
    generatorType,
    generatorId,
    layerId: feature.layer.id,
    source: feature.source,
    sourceLayer: feature.sourceLayer,
    uniqueFeatureInteraction,
    stopPropagation,
    value,
    id: getId(feature),
    tile: getFeatureTile(feature),
  }
  switch (generatorType) {
    case DataviewType.HeatmapAnimated:
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
      if (
        !values ||
        !values.filter((v: number) => {
          const matchesMin =
            generatorMetadata?.minVisibleValue !== undefined
              ? v >= generatorMetadata?.minVisibleValue
              : true
          const matchesMax =
            generatorMetadata?.maxVisibleValue !== undefined
              ? v <= generatorMetadata?.maxVisibleValue
              : true
          return v !== 0 && !isNaN(v) && matchesMin && matchesMax
        }).length
      ) {
        return []
      }
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
    case DataviewType.HeatmapStatic: {
      return [
        {
          ...extendedFeature,
          value: extendedFeature.value,
          unit: generatorMetadata.legends[0]?.unit,
        },
      ]
    }
    case DataviewType.Context:
    case DataviewType.UserPoints:
    case DataviewType.UserContext: {
      return [
        {
          ...extendedFeature,
          datasetId: feature.layer.metadata?.datasetId,
          promoteId: feature.layer.metadata?.promoteId,
          generatorContextLayer: feature.layer.metadata?.layer,
          geometry: feature.geometry,
        },
      ]
    }
    default:
      return [extendedFeature]
  }
}

const getExtendedFeatures = (
  features: MaplibreGeoJSONFeature[],
  metadata?: ExtendedStyleMeta,
  debug = false
): ExtendedFeature[] => {
  const stopPropagationFeature = features.find((f) => f.layer.metadata?.stopPropagation)
  if (stopPropagationFeature) {
    return getExtendedFeature(stopPropagationFeature, metadata, debug)
  }
  const extendedFeatures: ExtendedFeature[] = features.flatMap((feature) => {
    return getExtendedFeature(feature, metadata, debug) || []
  })
  return extendedFeatures
}

let sourcesWithFeatureState: FeatureStateSource[] = []

const isMapReady = (map?: Map) => {
  return map && map.getStyle()
}

export const useFeatureState = (map?: Map) => {
  const cleanFeatureState = useCallback(
    (state: FeatureStates = 'hover', sourcesToClean = sourcesWithFeatureState) => {
      if (isMapReady(map)) {
        sourcesToClean?.forEach((source: FeatureStateSource) => {
          const feature = map?.getFeatureState(source)
          // https://github.com/mapbox/mapbox-gl-js/issues/9461
          if (map && feature?.hasOwnProperty(state)) {
            map.removeFeatureState(source, state)
          }
        })
      }
    },
    [map]
  )

  const updateFeatureState = useCallback(
    (extendedFeatures: FeatureStateSource[], state: FeatureStates = 'hover') => {
      if (isMapReady(map)) {
        const newSourcesWithClickState: FeatureStateSource[] = extendedFeatures.flatMap(
          (feature) => {
            if (!map || feature.id === undefined) {
              return []
            }
            map.setFeatureState(
              {
                source: feature.source,
                id: feature.id,
                ...(feature.sourceLayer && { sourceLayer: feature.sourceLayer }),
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
          }
        )
        const previousSources = sourcesWithFeatureState.filter((source) => source.state !== state)
        sourcesWithFeatureState = [...previousSources, ...newSourcesWithClickState]
      }
    },
    [map]
  )

  const featureState = useMemo(
    () => ({ cleanFeatureState, updateFeatureState }),
    [cleanFeatureState, updateFeatureState]
  )
  return featureState
}

export const useMapClick = (
  clickCallback: InteractionEventCallback,
  metadata: ExtendedStyleMeta,
  map?: Map
) => {
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const onMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
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
  styleMetadata?: ExtendedStyleMeta,
  config?: MapHoverConfig
) => {
  const { debounced = 300 } = config || ({} as MapHoverConfig)
  // Keep a list of active feature state sources, so that we can turn them off when hovering away
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const metadata = styleMetadata || (map?.getStyle()?.metadata as ExtendedStyleMeta)

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

export const getToolFeatures = (features: MaplibreGeoJSONFeature[]) => {
  const toolFeatures = features.filter((f) => f.layer.metadata?.group === Group.Tool)
  return toolFeatures.flatMap((f) => getExtendedFeature(f))
}

export const useSimpleMapHover = (hoverCallback: InteractionEventCallback) => {
  const onMapHover = useCallback(
    (event: MapLayerMouseEvent) => {
      const hoverEvent = parseHoverEvent(event)
      if (event.features?.length) {
        const extendedFeatures: ExtendedFeature[] = getToolFeatures(
          event.features as MaplibreGeoJSONFeature[]
        )
        if (extendedFeatures.length) {
          hoverEvent.features = extendedFeatures
        }
      }
      if (hoverCallback) {
        hoverCallback(hoverEvent)
      }
    },
    [hoverCallback]
  )

  return onMapHover
}
