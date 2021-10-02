import { useCallback } from 'react'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer/dist/generators'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import useMapInstance from '../map-context.hooks'

export const useHighlightArea = () => {
  const { updateFeatureState, cleanFeatureState } = useFeatureState(useMapInstance())
  return useCallback(
    (source: string, id: string) => {
      cleanFeatureState('highlight')
      const featureState = { source, sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER, id }
      updateFeatureState([featureState], 'highlight')
    },
    [cleanFeatureState, updateFeatureState]
  )
}
