import { useCallback, useEffect, useRef } from 'react'
import debounce from 'lodash/debounce'
import isArray from 'lodash/isArray'
import { Generators, ExtendedStyleMeta } from '@globalfishingwatch/layer-composer'
import type { Map, MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import { ExtendedFeature, InteractionEventCallback, InteractionEvent } from '.'

type FeatureStateSource = { source: string; sourceLayer: string }

const getExtendedFeatures = (
  features: MapboxGeoJSONFeature[],
  metatada?: ExtendedStyleMeta
): ExtendedFeature[] => {
  const frame = metatada?.temporalgrid?.timeChunks?.activeChunkFrame

  const extendedFeatures: ExtendedFeature[] = features.flatMap((feature: MapboxGeoJSONFeature) => {
    const generatorType = feature.layer.metadata?.generatorType ?? null
    const generatorId = feature.layer.metadata?.generatorId ?? null
    const properties = feature.properties || {}
    const extendedFeature: ExtendedFeature | null = {
      properties,
      generatorType,
      generatorId,
      source: feature.source,
      sourceLayer: feature.sourceLayer,
      id: (feature.id as number) || feature.properties?.gfw_id || undefined,
      value: properties.value || properties.name || properties.id,
      tile: {
        x: (feature as any)._vectorTileFeature._x,
        y: (feature as any)._vectorTileFeature._y,
        z: (feature as any)._vectorTileFeature._z,
      },
    }
    switch (generatorType) {
      case Generators.Type.HeatmapAnimated:
        const valuesAtFrame = properties[frame?.toString()] || properties[frame]
        if (valuesAtFrame) {
          let parsed = JSON.parse(valuesAtFrame)
          if (extendedFeature.value === 0) break
          if (!isArray(parsed)) parsed = [parsed]
          return parsed.flatMap((value: any, i: number) => {
            if (value === 0) return []
            return [
              {
                ...extendedFeature,
                temporalgrid: {
                  sublayerIndex: i,
                  col: properties._col,
                  row: properties._row,
                },
                value,
              },
            ]
          })
        }
        return []
      case Generators.Type.Context:
        return {
          ...extendedFeature,
          generatorContextLayer: feature.layer.metadata?.layer,
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
    (state = 'hover') => {
      if (map) {
        sourcesWithFeatureState?.forEach((source: FeatureStateSource) => {
          map.removeFeatureState(source, state)
        })
      }
    },
    [map]
  )

  const updateFeatureState = useCallback(
    (extendedFeatures: ExtendedFeature[], state = 'hover') => {
      const newSourcesWithClickState: FeatureStateSource[] = extendedFeatures.flatMap(
        (feature: ExtendedFeature) => {
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
            source: feature.source,
            sourceLayer: feature.sourceLayer,
            id: feature.id,
          }
        }
      )
      sourcesWithFeatureState = [...sourcesWithFeatureState, ...newSourcesWithClickState]
    },
    [map]
  )

  return { sourcesWithFeatureState, cleanFeatureState, updateFeatureState }
}

export const useMapClick = (
  clickCallback: InteractionEventCallback,
  metadata: ExtendedStyleMeta,
  map?: Map
) => {
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const onMapClick = useCallback(
    (event) => {
      cleanFeatureState('click')
      if (!clickCallback) return
      const interactionEvent: InteractionEvent = {
        longitude: event.lngLat[0],
        latitude: event.lngLat[1],
      }
      if (event.features?.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(event.features, metadata)
        if (extendedFeatures.length) {
          interactionEvent.features = extendedFeatures
          updateFeatureState(extendedFeatures, 'click')
        }
      }
      clickCallback(interactionEvent)
    },
    [cleanFeatureState, clickCallback, metadata, updateFeatureState]
  )

  return onMapClick
}

type MapHoverConfig = {
  debounced: number
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
    (event) => {
      // Turn all sources with active feature states off
      cleanFeatureState()
      const hoverEvent: InteractionEvent = {
        longitude: event.lngLat[0],
        latitude: event.lngLat[1],
      }
      if (event.features && event.features.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(event.features, metadata)

        if (extendedFeatures.length) {
          hoverEvent.features = extendedFeatures
        }

        updateFeatureState(extendedFeatures, 'hover')
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
