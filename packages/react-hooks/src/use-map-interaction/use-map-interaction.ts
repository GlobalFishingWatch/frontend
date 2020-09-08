import { useCallback, useState } from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'

type FeatureStateSource = { source: string; sourceLayer: string }

const useMapInteraction = (
  clickCallback: (feature: Generators.GeneratorFeature | null) => any,
  hoverCallback: (feature: Generators.GeneratorFeature | null) => any,
  map: any
) => {
  const onMapClick = useCallback(
    (event) => {
      if (event.features && event.features.length) {
        if (
          event.features[0].layer.metadata &&
          event.features[0].layer.metadata.generator === 'HEATMAP_ANIMATED'
        ) {
          const props = event.features[0].properties
          const frame = event.features[0].layer.metadata.frame
          console.log(props[frame.toString()])
        }
        // TODO: Sort features by priority in order to only return a single feature. We could use metadata.group, or a new metadata.interactionPriority param?
        // for now just use the 1st one
        // TODO: add some cluster/not cluster logic here
        if (clickCallback) clickCallback(event.features[0])
      }
    },
    [clickCallback]
  )

  // Keep a list of active feature state sources, so that we can turn them off when hovering away
  const [sourcesWithHoverState, setSourcesWithHoverState] = useState<FeatureStateSource[]>([])

  const onMapHover = useCallback(
    (event) => {
      // Turn all sources with active feature states off
      if (map) {
        sourcesWithHoverState.forEach((source: FeatureStateSource) => {
          map.removeFeatureState({ source: source.source, sourceLayer: source.sourceLayer })
        })
      }
      if (event.features && event.features.length) {
        const newSourcesWithHoverState: FeatureStateSource[] = []
        event.features.forEach((feature: any) => {
          if (feature.id !== undefined && map) {
            map.setFeatureState(
              {
                source: feature.source,
                sourceLayer: feature.sourceLayer,
                id: feature.id,
              },
              { hover: true }
            )

            // Add source to active feature states only if not added yet
            if (
              !newSourcesWithHoverState
                .map((source) => `${source.source}${source.sourceLayer}`)
                .includes(`${feature.source}${feature.sourceLayer}`)
            ) {
              newSourcesWithHoverState.push({
                source: feature.source,
                sourceLayer: feature.sourceLayer,
              })
            }
          }
        })
        setSourcesWithHoverState(newSourcesWithHoverState)

        // TODO: Sort features by priority in order to only return a single feature. We could use metadata.group, or a new metadata.interactionPriority param?
        // for now just use the 1st one
        const feature = event.features[0]
        const featureData = {
          featureStateId: feature.id,
          source: feature.source,
          id: feature.properties.id,
          layerId: feature.layer.id,
          generator: feature.layer.metadata ? feature.layer.metadata.generator : null,
        }
        // Then this should be used by LC to generate a distinct style for highlighted feature
        if (hoverCallback) hoverCallback(featureData)
        return
      }
      if (hoverCallback) hoverCallback(null)
    },
    [hoverCallback, map, sourcesWithHoverState]
  )

  return {
    onMapClick,
    onMapHover,
  }
}

export default useMapInteraction
