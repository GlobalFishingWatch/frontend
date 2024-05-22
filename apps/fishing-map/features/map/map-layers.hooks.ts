import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import {
  useDeckLayerComposer,
  useDeckLayerLoadedState,
} from '@globalfishingwatch/deck-layer-composer'
import { useGlobalConfigConnect } from 'features/map/map.hooks'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.selectors'
import { selectMapReportBufferDataviews, selectWorkspacesListDataview } from './map.selectors'

export const useMapDeckLayers = () => {
  const workspaceDataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const bufferDataviews = useSelector(selectMapReportBufferDataviews)
  const workspacesListDataview = useSelector(selectWorkspacesListDataview)
  const globalConfig = useGlobalConfigConnect()
  const dataviews = useMemo(() => {
    const allDataviews = [...(workspaceDataviews || []), ...(bufferDataviews || [])]
    if (workspacesListDataview) {
      allDataviews.push(workspacesListDataview)
    }
    return allDataviews
  }, [bufferDataviews, workspaceDataviews, workspacesListDataview])
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
