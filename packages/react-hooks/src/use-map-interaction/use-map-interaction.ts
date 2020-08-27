import { useCallback } from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'

const useMapInteraction = (
  clickCallback: (feature: Generators.GeneratorFeature | null) => any,
  hoverCallback: (feature: Generators.GeneratorFeature | null) => any
) => {
  const onMapClick = useCallback(
    (event) => {
      if (event.features && event.features.length) {
        // TODO: Sort features by priority in order to only return a single feature. We could use metadata.group, or a new metadata.interactionPriority param?
        // for now just use the 1st one
        // TODO: add some cluster/not cluster logic here
        if (clickCallback) clickCallback(event.features[0])
      }
    },
    [clickCallback]
  )
  const onMapHover = useCallback(
    (event) => {
      if (event.features && event.features.length) {
        // TODO: Sort features by priority in order to only return a single feature. We could use metadata.group, or a new metadata.interactionPriority param?
        // for now just use the 1st one
        const feature = event.features[0]
        const featureData = {
          id: feature.properties.id,
          layerId: feature.layer.id,
          generator: feature.layer.metadata.generator,
        }
        // Then this should be used by LC to generate a distinct style for highlighted feature
        if (hoverCallback) hoverCallback(featureData)
        return
      }
      if (hoverCallback) hoverCallback(null)
    },
    [hoverCallback]
  )

  return {
    onMapClick,
    onMapHover,
  }
}

export default useMapInteraction
