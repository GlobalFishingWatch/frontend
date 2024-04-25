import { useSelector } from 'react-redux'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import {
  useDeckLayerComposer,
  useDeckLayerLoadedState,
} from '@globalfishingwatch/deck-layer-composer'
import { useGlobalConfigConnect } from 'features/map/map.hooks'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.selectors'
import { useDrawLayer } from './overlays/draw/draw.hooks'

export const useMapDeckLayers = () => {
  const dataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const globalConfig = useGlobalConfigConnect()
  const { layers } = useDeckLayerComposer({
    dataviews: dataviews as DataviewInstance[],
    globalConfig,
  })

  return layers
}

export const useMapOverlayLayers = () => {
  const { instance: drawLayerInstance } = useDrawLayer()
  return [drawLayerInstance]
}

export const useMapLayersLoaded = () => {
  const layerStatus = useDeckLayerLoadedState()
  return Object.values(layerStatus).every((l) => l.loaded)
}
