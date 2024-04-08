import { useCallback, useEffect, useMemo, useRef } from 'react'
import { debounce } from 'lodash'
import {
  Interval,
  ExtendedStyleMeta,
  CONFIG_BY_INTERVAL,
  pickActiveTimeChunk,
  ExtendedLayer,
  Group,
} from '@globalfishingwatch/layer-composer'
import {
  ContextLayer,
  FourwingsLayer,
  FourwingsPickingObject,
  ContextPickingInfo,
  ContextPickingObject,
} from '@globalfishingwatch/deck-layers'
import {
  DeckLayerInteraction,
  DeckLayerInteractionFeature,
} from '@globalfishingwatch/deck-layer-composer'
import {
  aggregateCell,
  SublayerCombinationMode,
  VALUE_MULTIPLIER,
} from '@globalfishingwatch/fourwings-aggregate'
import type { Map, GeoJSONFeature, MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { DataviewType } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { ExtendedFeature, InteractionEventCallback, InteractionEvent } from '.'

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

const getExtendedFeature = (feature: DeckLayerInteractionFeature): ExtendedFeature[] => {
  // const generatorType = feature.layer.metadata?.generatorType ?? null
  // const generatorId = feature.layer.metadata?.generatorId ?? null

  // TODO: if no generatorMetadata is found, fallback to feature.layer.metadata, but the former should be prefered
  // let generatorMetadata: any
  // if (generatorId && metadata?.generatorsMetadata && metadata?.generatorsMetadata[generatorId]) {
  //   generatorMetadata = metadata?.generatorsMetadata[generatorId]
  // } else {
  //   generatorMetadata = feature.layer.metadata
  // }

  // TODO:deck implement the uniqueFeatureInteraction feature inside the getPickingInfo
  // const uniqueFeatureInteraction = feature?.metadata?.uniqueFeatureInteraction ?? false
  // TODO:deck implement the stopPropagation feature
  // const stopPropagation = feature.layer?.metadata?.stopPropagation ?? false

  const extendedFeature: ExtendedFeature = {
    ...feature.object,
    layerId: feature.layer.id,
    // uniqueFeatureInteraction,
    // stopPropagation,
  }

  if (feature.layer instanceof FourwingsLayer) {
    const object = feature.object as FourwingsPickingObject
    if (feature.layer?.props.static) {
      return [
        {
          ...extendedFeature,
          value: extendedFeature.value / VALUE_MULTIPLIER,
          unit: object.sublayers[0].unit,
        },
      ]
    } else {
      // const values = object.sublayers.map((sublayer) => sublayer.value!)

      // This is used when querying the interaction endpoint, so that start begins at the start of the frame (ie start of a 10days interval)
      // This avoids querying a cell visible on the map, when its actual timerange is not included in the app-overall time range
      // const getDate = CONFIG_BY_INTERVAL[timeChunks.interval as Interval].getDate
      const layer = feature.layer as FourwingsLayer
      const visibleStartDate = getUTCDate(layer?.props?.startTime).toISOString()
      const visibleEndDate = getUTCDate(layer?.props?.endTime).toISOString()
      return object.sublayers.flatMap((sublayer, i) => {
        if (sublayer.value === 0) return []
        const temporalGridExtendedFeature: ExtendedFeature = {
          ...extendedFeature,
          temporalgrid: {
            sublayerIndex: i,
            sublayerId: sublayer.id,
            sublayerInteractionType: object.category,
            sublayerCombinationMode: layer.props.comparisonMode,
            visible: true,
            col: object.properties.col as number,
            row: object.properties.row as number,
            interval: layer.getInterval(),
            visibleStartDate,
            visibleEndDate,
            unit: sublayer.unit,
          },
          value: sublayer.value,
        }
        return [temporalGridExtendedFeature]
      })
    }
  } else if (feature.layer instanceof ContextLayer) {
    // TODO: deck add support for these layers
    // case DataviewType.Context:
    // case DataviewType.UserPoints:
    // case DataviewType.UserContext:
    const object = feature.object as ContextPickingObject
    return [
      {
        ...extendedFeature,
        datasetId: object.datasetId,
        promoteId: object.promoteId,
        generatorContextLayer: object?.layerId,
        geometry: object.geometry,
      },
    ]
  }

  return [extendedFeature]
}

const getExtendedFeatures = (features: DeckLayerInteractionFeature[]): ExtendedFeature[] => {
  // TODO: deck implement the stopPropagation feature
  // const stopPropagationFeature = features.find((f) => f.layer.metadata?.stopPropagation)
  // if (stopPropagationFeature) {
  //   return getExtendedFeature(stopPropagationFeature, metadata, debug)
  // }
  const extendedFeatures: ExtendedFeature[] = features.flatMap((feature) => {
    return getExtendedFeature(feature) || []
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

export const useMapClick = (clickCallback: InteractionEventCallback) => {
  // const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const onMapClick = useCallback(
    (event: DeckLayerInteraction) => {
      // cleanFeatureState('click')
      if (!clickCallback) return

      const interactionEvent: InteractionEvent = {
        type: 'click',
        longitude: event.longitude,
        latitude: event.latitude,
        point: event.point,
      }
      if (event.features?.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(event.features)
        const extendedFeaturesLimit = filterUniqueFeatureInteraction(extendedFeatures)

        if (extendedFeaturesLimit.length) {
          interactionEvent.features = extendedFeaturesLimit
          // updateFeatureState(extendedFeaturesLimit, 'click')
        }
      }
      clickCallback(interactionEvent)
    },
    [clickCallback]
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
