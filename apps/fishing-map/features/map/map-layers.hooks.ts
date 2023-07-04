import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useDeckLayerComposer } from '@globalfishingwatch/deck-layers'
import { useGeneratorsConnect, useGeneratorsDictionaryConnect } from 'features/map/map.hooks'
import { selectHighlightedTime } from 'features/timebar/timebar.slice'
import { useHighlightedEventsConnect } from 'features/timebar/timebar.hooks'

export const useMapDeckLayers = () => {
  const generatorsDictionary = useGeneratorsDictionaryConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const { highlightedEvents } = useHighlightedEventsConnect()
  const params = useMemo(() => {
    return {
      highlightedTime,
      highlightEventIds: highlightedEvents,
    }
  }, [highlightedEvents, highlightedTime])
  const { layers } = useDeckLayerComposer({
    generatorsDictionary,
    generatorsConfig,
    globalGeneratorConfig: globalConfig,
    params,
  })

  return layers
}
