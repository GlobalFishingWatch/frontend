import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useFourwingsLayers } from '@globalfishingwatch/deck-layers'
import { TileCell } from '@globalfishingwatch/deck-layers'
import { selectTimebarVisualisation } from 'features/app/app.selectors'
import { DECK_CATEGORY_BY_TIMEBAR_VISUALIZATION } from 'data/config'
import { getGraphFromGridCellsData } from './timebar.utils'

export const useHeatmapActivityGraph = () => {
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const fourwingsCategory = DECK_CATEGORY_BY_TIMEBAR_VISUALIZATION[timebarVisualisation]
  const fourwingsActivityLayer = useFourwingsLayers(fourwingsCategory)
  const loading = fourwingsActivityLayer?.some((layer) => !layer.loaded)
  const cellsData: TileCell[] = fourwingsActivityLayer?.[0]?.layerInstance?.getData()

  const heatmapActivity = useMemo(
    () => (cellsData?.length ? getGraphFromGridCellsData(cellsData) || [] : []),
    [cellsData]
  )
  return useMemo(() => ({ loading, heatmapActivity }), [loading, heatmapActivity])
}
