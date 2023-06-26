import {
  useFourwingsActivityLayer,
  useFourwingsLayersLoaded,
} from '@globalfishingwatch/deck-layers'
import { getGraphFromGridCellsData } from './timebar.utils'

export const useHeatmapActivityGraph = () => {
  const fourwingsLayersLoaded = useFourwingsLayersLoaded()
  const loading = !fourwingsLayersLoaded.find((l) => l.id === 'activity')?.loaded
  const fourwingsActivityLayer = useFourwingsActivityLayer()
  const activityData = fourwingsActivityLayer?.instance?.getData()

  const heatmapActivity = activityData?.length ? getGraphFromGridCellsData(activityData) || [] : []
  return { loading, heatmapActivity }
}
