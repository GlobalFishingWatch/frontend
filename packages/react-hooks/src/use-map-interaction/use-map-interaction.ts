import { useCallback, useEffect, useMemo, useRef } from 'react'
import debounce from 'lodash/debounce'
import { Generators, ExtendedStyleMeta } from '@globalfishingwatch/layer-composer'
import type { Map, MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import { ExtendedFeature, InteractionEventCallback, InteractionEvent } from '.'

type FeatureStates = 'click' | 'hover'
type FeatureStateSource = { source: string; sourceLayer: string; state: FeatureStates }

const aggregateCell = (
  rawValues: string,
  frame: number,
  delta: number,
  quantizeOffset: number,
  numSublayers: number
) => {
  // Raw values come as a single string (MVT limitation), turn into an array of ints first
  const rawValuesArr: number[] = rawValues.split(',').map((v) => parseInt(v))

  // First two values for a cell are the overall start and end time offsets for all the cell values (in days/hours/10days from start of time)
  const minCellOffset = rawValuesArr[0]
  const maxCellOffset = rawValuesArr[1]

  // When we should start counting in terms of days/hours/10days from start of time
  const startOffset = quantizeOffset + frame

  // Where we sould start looking up in the array (minCellOffset, maxCellOffset, sublayer0valueAt0, sublayer1valueAt0, sublayer0valueAt1, sublayer1valueAt1, ...)
  const startAt = 2 + (startOffset - minCellOffset) * numSublayers

  // Where we should stop looking up, using the current timebar delta
  const endAt = startAt + delta * numSublayers

  // One aggregated value per sublayer
  const values = new Array(numSublayers).fill(0)

  for (let i = startAt; i < endAt; i++) {
    const sublayerIndex = i % numSublayers
    const rawValue = rawValuesArr[i]
    if (rawValue) {
      values[sublayerIndex] += rawValue
    }
  }

  // Raw 4w API values come without decimals, multiplied by 100
  const VALUE_MULTIPLIER = 100
  const realValues = values.map((v) => v / VALUE_MULTIPLIER)

  return realValues
}

const getExtendedFeatures = (
  features: MapboxGeoJSONFeature[],
  metatada?: ExtendedStyleMeta
): ExtendedFeature[] => {
  const timeChunks = metatada?.temporalgrid?.timeChunks
  const frame = timeChunks?.activeChunkFrame
  const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active)
  const numSublayers = metatada?.temporalgrid?.numSublayers

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
        const values = aggregateCell(
          properties.rawValues,
          frame,
          timeChunks.deltaInIntervalUnits,
          activeTimeChunk.quantizeOffset,
          numSublayers
        )
        if (!values.filter((v) => v > 0).length) return []

        return values.flatMap((value: any, i: number) => {
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
    (extendedFeatures: ExtendedFeature[], state: FeatureStates = 'hover') => {
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
            state,
            id: feature.id,
            source: feature.source,
            sourceLayer: feature.sourceLayer,
          }
        }
      )
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
