import { useSelector } from 'react-redux'
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
  const cellsData: TileCell[] = fourwingsActivityLayer?.[0]?.instance?.getData()

  const heatmapActivity = cellsData?.length ? getGraphFromGridCellsData(cellsData) || [] : []
  return { loading, heatmapActivity }
}
