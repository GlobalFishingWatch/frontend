import {
  useFourwingsActivityLayer,
  useFourwingsLayersLoaded,
} from '@globalfishingwatch/deck-layers'
import { getGraphFromGridCellsData } from './timebar.utils'

export const useHeatmapActivityGraph = () => {
  const fourwingsLayersLoaded = useFourwingsLayersLoaded()
  const loading = !fourwingsLayersLoaded.find((l) => l.id === 'activity')?.loaded
  const fourwingsActivityLayer = useFourwingsActivityLayer()
  console.log(
    '🚀 ~ file: TimebarActivityGraph.hooks.ts:11 ~ useHeatmapActivityGraph ~ fourwingsActivityLayer:',
    fourwingsActivityLayer
  )
  const activityData = fourwingsActivityLayer?.instance?.getData()
  const visibleSublayersIds = fourwingsActivityLayer?.instance?.props?.visibleSublayersIds

  const heatmapActivity = activityData?.length
    ? getGraphFromGridCellsData(activityData, visibleSublayersIds!) || []
    : []
  return { loading, heatmapActivity }
}
