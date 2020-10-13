import uniqBy from 'lodash/uniqBy'
import debounce from 'lodash/debounce'
import { isArray } from 'lodash'
import { useCallback, useState, useEffect, useRef } from 'react'
import type { Map, MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import { Generators } from '@globalfishingwatch/layer-composer'
import { ExtendedFeature, InteractionEventCallback } from '.'

type FeatureStateSource = { source: string; sourceLayer: string }

const getExtendedFeatures = (features: MapboxGeoJSONFeature[]): ExtendedFeature[] => {
  const extendedFeatures: ExtendedFeature[] = features.flatMap((feature: MapboxGeoJSONFeature) => {
    const generatorType = feature.layer.metadata ? feature.layer.metadata.generatorType : null
    const generatorId = feature.layer.metadata ? feature.layer.metadata.generatorId : null
    const properties = feature.properties || {}
    const extendedFeature: ExtendedFeature | null = {
      properties,
      generatorType,
      generatorId,
      source: feature.source,
      sourceLayer: feature.sourceLayer,
      id: (feature.id as number) || undefined,
      value: properties.value || properties.name || properties.id,
      tile: {
        x: (feature as any)._vectorTileFeature._x,
        y: (feature as any)._vectorTileFeature._y,
        z: (feature as any)._vectorTileFeature._z,
      },
    }
    switch (generatorType) {
      case Generators.Type.HeatmapAnimated:
        const frame = feature.layer.metadata.frame
        const valuesAtFrame = properties[frame.toString()]
        if (valuesAtFrame) {
          let parsed = JSON.parse(valuesAtFrame)
          if (extendedFeature.value === 0) break
          if (!isArray(parsed)) parsed = [parsed]
          return parsed.map((value: any, i: number) => {
            return {
              ...extendedFeature,
              temporalgrid: {
                sublayerIndex: i,
                col: properties._col,
                row: properties._row,
              },
              value,
            }
          })
        }
        return []
      default:
        return extendedFeature
    }
  })
  return extendedFeatures
}

export const useMapClick = (clickCallback: InteractionEventCallback) => {
  const onMapClick = useCallback(
    (event) => {
      if (!clickCallback) return
      if (event.features && event.features.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(event.features)

        if (extendedFeatures.length) {
          clickCallback({
            features: extendedFeatures,
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
          })
        } else clickCallback(null)
      } else clickCallback(null)
    },
    [clickCallback]
  )

  return onMapClick
}

type MapHoverConfig = {
  debounced: number
}
export const useMapHover = (
  hoverCallback: InteractionEventCallback,
  map: Map,
  config?: MapHoverConfig
) => {
  const { debounced = 500 } = config || ({} as MapHoverConfig)
  // Keep a list of active feature state sources, so that we can turn them off when hovering away
  const [sourcesWithHoverState, setSourcesWithHoverState] = useState<FeatureStateSource[]>([])

  const hoverCallbackDebounced = useRef<any>(null)
  useEffect(() => {
    const debouncedFn =
      debounced > 0
        ? debounce((e) => {
            hoverCallback(e)
          }, debounced)
        : hoverCallback
    hoverCallbackDebounced.current = debouncedFn
  }, [debounced, hoverCallback])

  const onMapHover = useCallback(
    (event) => {
      if (hoverCallback) hoverCallback(null)
      // Turn all sources with active feature states off
      if (map) {
        sourcesWithHoverState.forEach((source: FeatureStateSource) => {
          map.removeFeatureState({ source: source.source, sourceLayer: source.sourceLayer })
        })
      }
      if (event.features && event.features.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(event.features)

        if (hoverCallbackDebounced && hoverCallbackDebounced.current && extendedFeatures.length) {
          if (hoverCallbackDebounced.current.cancel) {
            hoverCallbackDebounced.current.cancel()
          }
          hoverCallbackDebounced.current({
            features: extendedFeatures,
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
          })
        }

        const newSourcesWithHoverState: FeatureStateSource[] = extendedFeatures.flatMap(
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
              { hover: true }
            )

            // Add source to active feature states
            return {
              source: feature.source,
              sourceLayer: feature.sourceLayer,
            }
          }
        )

        // Updates sources on which to turn feature state off, only if it really changed
        // this allows keeping the onMapHover reference, avoiding unnecesary map renders
        const uniqNewSourcesWithHoverState = uniqBy(newSourcesWithHoverState, JSON.stringify)
        if (
          JSON.stringify(sourcesWithHoverState) !== JSON.stringify(uniqNewSourcesWithHoverState)
        ) {
          setSourcesWithHoverState(newSourcesWithHoverState)
        }
      } else {
        if (hoverCallbackDebounced?.current?.cancel) {
          hoverCallbackDebounced.current.cancel()
        }
        if (hoverCallback) {
          hoverCallback({
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
          })
        }
      }
    },
    [map, hoverCallback, hoverCallbackDebounced, sourcesWithHoverState]
  )

  return onMapHover
}

const useMapInteraction = (
  clickCallback: InteractionEventCallback,
  hoverCallback: InteractionEventCallback,
  map: Map
) => {
  const onMapClick = useMapClick(clickCallback)
  const onMapHover = useMapHover(hoverCallback, map)

  return {
    onMapClick,
    onMapHover,
  }
}

export default useMapInteraction
