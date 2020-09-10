import uniqBy from 'lodash/uniqBy'
// import debounce from 'lodash/debounce'
import type { MapboxGeoJSONFeature } from 'mapbox-gl'
import { useCallback, useState /*, useEffect*/ } from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'

type FeatureStateSource = { source: string; sourceLayer: string }

export type ExtendedFeature = {
  properties: { [name: string]: any }
  generator: string | null
  generatorId: string | null
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
  clickCallback: (event: InteractionEvent) => any,
  hoverCallback: (event: InteractionEvent) => any,
  map: any
) => {
  const onMapClick = useCallback((event) => {
    console.log('click')
  }, [])

  // Keep a list of active feature state sources, so that we can turn them off when hovering away
  const [sourcesWithHoverState, setSourcesWithHoverState] = useState<FeatureStateSource[]>([])

  // const [debouncedHoverCallback, setDebouncedHoverCallback] = useState<any>(null)
  // useEffect(() => {
  //   // Set debouncedValue to value (passed in) after the specified delay
  //   const debounced = debounce(hoverCallback, 1000)
  //   setDebouncedHoverCallback(debounced)
  //   // return () => {
  //   //   debounced.cancel()
  //   // }
  //   // }, [delay, options, value])
  // }, [hoverCallback, debouncedHoverCallback])

  const onMapHover = useCallback(
    (event) => {
      // Turn all sources with active feature states off
      if (map) {
        sourcesWithHoverState.forEach((source: FeatureStateSource) => {
          map.removeFeatureState({ source: source.source, sourceLayer: source.sourceLayer })
        })
      }
      if (event.features && event.features.length) {
        const extendedFeatures = event.features
          .map((feature: MapboxGeoJSONFeature) => {
            const generator = feature.layer.metadata ? feature.layer.metadata.generator : null
            const generatorId = feature.layer.metadata ? feature.layer.metadata.generatorId : null
            const properties = feature.properties || {}
            let extendedFeature: ExtendedFeature | null = {
              properties,
              generator,
              generatorId,
              source: feature.source,
              sourceLayer: feature.sourceLayer,
              id: feature.id as number | undefined,
              value: properties.value,
            }
            switch (generator) {
              case Generators.Type.HeatmapAnimated:
                const frame = feature.layer.metadata.frame
                const valuesAtFrame = properties[frame.toString()]
                if (valuesAtFrame) {
                  extendedFeature.value = JSON.parse(valuesAtFrame)
                  if (extendedFeature.value === 0) {
                    extendedFeature = null
                  }
                } else {
                  extendedFeature = null
                }
            }
            return extendedFeature
          })
          .filter((f: ExtendedFeature) => f !== null)

        if (hoverCallback && extendedFeatures.length) {
          // hoverCallback.cancel()
          hoverCallback({
            features: extendedFeatures,
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
          })
        }

        const newSourcesWithHoverState: FeatureStateSource[] = []
        extendedFeatures.forEach((feature: ExtendedFeature) => {
          console.log(feature.id)
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
        // hoverCallback.cancel()
        hoverCallback({
          longitude: event.lngLat[0],
          latitude: event.lngLat[1],
        })
      }
    },
    [map, hoverCallback, sourcesWithHoverState]
  )

  return {
    onMapClick,
    onMapHover,
  }
}

export default useMapInteraction
