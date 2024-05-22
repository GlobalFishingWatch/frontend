import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import {
  useDeckLayerComposer,
  useDeckLayerLoadedState,
} from '@globalfishingwatch/deck-layer-composer'
import { useGlobalConfigConnect } from 'features/map/map.hooks'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.selectors'
import { selectMapReportBufferDataviews } from './map.selectors'

export const useMapDeckLayers = () => {
  const workspaceDataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const bufferDataviews = useSelector(selectMapReportBufferDataviews)
  const globalConfig = useGlobalConfigConnect()
  const dataviews = useMemo(() => {
    if (bufferDataviews?.length) {
      return [...workspaceDataviews, ...bufferDataviews]
    }
    return workspaceDataviews
  }, [bufferDataviews, workspaceDataviews])
  const { layers } = useDeckLayerComposer({
    dataviews: dataviews as DataviewInstance[],
    globalConfig,
  })

  return layers
}

export const useMapLayersLoaded = () => {
  const layerStatus = useDeckLayerLoadedState()
  return Object.values(layerStatus).every((l) => l.loaded)
}
