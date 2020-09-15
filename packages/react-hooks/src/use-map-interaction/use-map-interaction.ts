import uniqBy from 'lodash/uniqBy'
import debounce from 'lodash/debounce'
import { Cancelable, isArray } from 'lodash'
import type { MapboxGeoJSONFeature } from 'mapbox-gl'
import { useCallback, useState, useEffect, useRef } from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'

type FeatureStateSource = { source: string; sourceLayer: string }

export type ExtendedFeature = {
  properties: { [name: string]: any }
  generator: string | null
  generatorId: string | number | null
  source: string
  sourceLayer: string
  id?: number
  value: any
}

export type InteractionEvent = {
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
}

const useMapInteraction = (
  clickCallback: (event: InteractionEvent) => void,
  hoverCallback: (event: InteractionEvent | null) => void,
  map: any
) => {
  const onMapClick = useCallback((event) => {
    console.log('click')
  }, [])

  // Keep a list of active feature state sources, so that we can turn them off when hovering away
  const [sourcesWithHoverState, setSourcesWithHoverState] = useState<FeatureStateSource[]>([])

  const hoverCallbackDebounced = useRef<null | (Cancelable & ((e: InteractionEvent) => void))>(null)
  useEffect(() => {
    const debounced = debounce((e) => {
      hoverCallback(e)
    }, 500)
    hoverCallbackDebounced.current = debounced
  }, [hoverCallback])

  const onMapHover = useCallback(
    (event) => {
      hoverCallback(null)
      // Turn all sources with active feature states off
      if (map) {
        sourcesWithHoverState.forEach((source: FeatureStateSource) => {
          map.removeFeatureState({ source: source.source, sourceLayer: source.sourceLayer })
        })
      }
      if (event.features && event.features.length) {
        const extendedFeatures: ExtendedFeature[] = []
        event.features.forEach((feature: MapboxGeoJSONFeature) => {
          const generator = feature.layer.metadata ? feature.layer.metadata.generator : null
          const generatorId = feature.layer.metadata ? feature.layer.metadata.generatorId : null
          const properties = feature.properties || {}
          const extendedFeature: ExtendedFeature | null = {
            properties,
            generator,
            generatorId,
            source: feature.source,
            sourceLayer: feature.sourceLayer,
            id: (feature.id as number) || undefined,
            value: properties.value || properties.name || properties.id,
          }
          switch (generator) {
            case Generators.Type.HeatmapAnimated:
              const frame = feature.layer.metadata.frame
              const valuesAtFrame = properties[frame.toString()]
              if (valuesAtFrame) {
                let parsed = JSON.parse(valuesAtFrame)
                if (extendedFeature.value === 0) break
                if (!isArray(parsed)) parsed = [parsed]
                parsed.forEach((value: any, i: number) => {
                  extendedFeatures.push({
                    ...extendedFeature,
                    // TODO this should be sublayer id but it has to be carried in GeoJSON feature by aggregator
                    generatorId: i,
                    value,
                  })
                })
              }
              break
            default:
              extendedFeatures.push(extendedFeature)
          }
        })

        if (hoverCallbackDebounced && hoverCallbackDebounced.current && extendedFeatures.length) {
          hoverCallbackDebounced.current.cancel()
          hoverCallbackDebounced.current({
            features: extendedFeatures,
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
          })
        }

        const newSourcesWithHoverState: FeatureStateSource[] = []
        extendedFeatures.forEach((feature: ExtendedFeature) => {
          if (feature.id !== undefined && map) {
            map.setFeatureState(
              {
                source: feature.source,
                sourceLayer: feature.sourceLayer,
                id: feature.id,
              },
              { hover: true }
            )

            // Add source to active feature states
            newSourcesWithHoverState.push({
              source: feature.source,
              sourceLayer: feature.sourceLayer,
            })
          }
        })

        // Updates sources on which to turn feature state off, only if it really changed
        // this allows keeping the onMapHover reference, avoiding unnecesary map renders
        const uniqNewSourcesWithHoverState = uniqBy(newSourcesWithHoverState, JSON.stringify)
        if (
          JSON.stringify(sourcesWithHoverState) !== JSON.stringify(uniqNewSourcesWithHoverState)
        ) {
          setSourcesWithHoverState(newSourcesWithHoverState)
        }

        return
      }
      if (hoverCallback) {
        if (hoverCallbackDebounced && hoverCallbackDebounced.current) {
          hoverCallbackDebounced.current.cancel()
        }
        hoverCallback({
          longitude: event.lngLat[0],
          latitude: event.lngLat[1],
        })
      }
    },
    [map, hoverCallback, hoverCallbackDebounced, sourcesWithHoverState]
  )

  return {
    onMapClick,
    onMapHover,
  }
}

export default useMapInteraction
