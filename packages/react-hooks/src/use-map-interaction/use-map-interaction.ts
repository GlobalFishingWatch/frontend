import { useCallback, useEffect, useMemo, useRef } from 'react'
import debounce from 'lodash/debounce'
import { Generators, ExtendedStyleMeta } from '@globalfishingwatch/layer-composer'
import { aggregateCell } from '@globalfishingwatch/fourwings-aggregate'
import type { Map, MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import { ExtendedFeature, InteractionEventCallback, InteractionEvent } from '.'

type FeatureStates = 'click' | 'hover' | 'highlight'
type FeatureStateSource = { source: string; sourceLayer: string; id: string; state?: FeatureStates }

const getExtendedFeatures = (
  features: MapboxGeoJSONFeature[],
  metadata?: ExtendedStyleMeta,
  debug = false
): ExtendedFeature[] => {
  const timeChunks = metadata?.temporalgrid?.timeChunks
  const frame = timeChunks?.activeChunkFrame
  const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active)
  const numSublayers = metadata?.temporalgrid?.numSublayers

  const extendedFeatures: ExtendedFeature[] = features.flatMap((feature: MapboxGeoJSONFeature) => {
    const generatorType = feature.layer.metadata?.generatorType ?? null
    const generatorId = feature.layer.metadata?.generatorId ?? null
    const unit = feature.layer?.metadata?.legend?.unit ?? null
    const properties = feature.properties || {}
    const extendedFeature: ExtendedFeature | null = {
      properties,
      generatorType,
      generatorId,
      layerId: feature.layer.id,
      source: feature.source,
      sourceLayer: feature.sourceLayer,
      id: (feature.id as number) || feature.properties?.gfw_id || undefined,
      value: properties.value || properties.name || properties.id,
      unit,
      tile: {
        x: (feature as any)._vectorTileFeature._x,
        y: (feature as any)._vectorTileFeature._y,
        z: (feature as any)._vectorTileFeature._z,
      },
    }
    switch (generatorType) {
      case Generators.Type.HeatmapAnimated:
        const values = aggregateCell({
          rawValues: properties.rawValues,
          frame,
          delta: timeChunks.deltaInIntervalUnits,
          quantizeOffset: activeTimeChunk.quantizeOffset,
          sublayerCount: numSublayers,
        })
        if (!values || !values.filter((v) => v > 0).length) return []

        const visibleSublayers = metadata?.temporalgrid?.visibleSublayers as boolean[]
        return values.flatMap((value: any, i: number) => {
          if (value === 0) return []
          return [
            {
              ...extendedFeature,
              temporalgrid: {
                sublayerIndex: i,
                visible: visibleSublayers[i] === true,
                col: properties._col as number,
                row: properties._row as number,
              },
              value,
            },
          ]
        })
      case Generators.Type.Context:
        return {
          ...extendedFeature,
          gfwId: feature.properties?.gfw_id,
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

  const featureState = useMemo(() => ({ cleanFeatureState, updateFeatureState }), [
    cleanFeatureState,
    updateFeatureState,
  ])
  return featureState
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
        point: event.point,
      }
      if (event.features?.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(
          event.features,
          metadata,
          true
        )
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
        point: event.point,
        longitude: event.lngLat[0],
        latitude: event.lngLat[1],
      }
      if (event.features?.length) {
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
