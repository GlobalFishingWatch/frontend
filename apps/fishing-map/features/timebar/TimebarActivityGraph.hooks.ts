import {
  useFourwingsActivityLayer,
  useFourwingsLayersLoaded,
} from '@globalfishingwatch/deck-layers'
import { TileCell } from '@globalfishingwatch/deck-layers'
import { getGraphFromGridCellsData } from './timebar.utils'

export const useHeatmapActivityGraph = () => {
  const fourwingsLayersLoaded = useFourwingsLayersLoaded()
  const loading = !fourwingsLayersLoaded.find((l) => l.id === 'activity')?.loaded
  const fourwingsActivityLayer = useFourwingsActivityLayer()
  const cellsData: TileCell[] = fourwingsActivityLayer?.instance?.getData()

  const heatmapActivity = cellsData?.length ? getGraphFromGridCellsData(cellsData) || [] : []
  return { loading, heatmapActivity }
}
