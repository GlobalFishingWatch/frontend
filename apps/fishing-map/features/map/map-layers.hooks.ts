import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import {
  useDeckLayerComposer,
  useFourwingsLayers,
  useVesselLayers,
} from '@globalfishingwatch/deck-layer-composer'
import { useGeneratorsConnect } from 'features/map/map.hooks'
import { selectHighlightedTime } from 'features/timebar/timebar.slice'
import { useHighlightedEventsConnect } from 'features/timebar/timebar.hooks'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.selectors'

export const useMapDeckLayers = () => {
  const highlightedTime = useSelector(selectHighlightedTime)
  const dataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const { highlightedEvents } = useHighlightedEventsConnect()
  const params = useMemo(() => {
    return {
      highlightedTime,
      highlightEventIds: highlightedEvents,
    }
  }, [highlightedEvents, highlightedTime])
  const { layers } = useDeckLayerComposer({
    dataviews,
    globalConfig,
    params,
  })

  return layers
}

export const useMapVisibleLayers = () => {
  const fourwingsLayers = useFourwingsLayers()
  const vesselsLayers = useVesselLayers()
  const allLayers = [...fourwingsLayers, ...vesselsLayers]
  return allLayers.flatMap((l) => (l.layerInstance && l.layerInstance.props.visible ? l : []))
}

export const useMapLayersLoaded = () => useMapVisibleLayers().every((l) => l.loaded)
