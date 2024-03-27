import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import {
  useDeckLayerComposer,
  useDeckLayerLoadedState,
} from '@globalfishingwatch/deck-layer-composer'
import { useGlobalConfigConnect } from 'features/map/map.hooks'
import { selectHighlightedTime } from 'features/timebar/timebar.slice'
import { useHighlightedEventsConnect } from 'features/timebar/timebar.hooks'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.selectors'

export const useMapDeckLayers = () => {
  const highlightedTime = useSelector(selectHighlightedTime)
  const dataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const { globalConfig } = useGlobalConfigConnect()
  const { highlightedEvents } = useHighlightedEventsConnect()
  const params = useMemo(() => {
    return {
      highlightedTime,
      highlightEventIds: highlightedEvents,
    }
  }, [highlightedEvents, highlightedTime])
  const { layers } = useDeckLayerComposer({
    dataviews: dataviews as DataviewInstance[],
    globalConfig,
    // params,
  })

  return layers
}

export const useMapLayersLoaded = () => {
  const layerStatus = useDeckLayerLoadedState()
  return Object.values(layerStatus).every((l) => l.loaded)
}
