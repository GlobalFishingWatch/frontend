import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { FourwingsDataviewCategory, TileCell } from '@globalfishingwatch/deck-layers'
import { useFourwingsLayers } from '@globalfishingwatch/deck-layers'
import { DECK_CATEGORY_BY_TIMEBAR_VISUALIZATION } from 'data/config'
import { selectTimebarVisualisation } from 'features/app/selectors/app.timebar.selectors'
import { getGraphFromGridCellsData } from './timebar.utils'

export const useHeatmapActivityGraph = () => {
  // const timebarVisualisation = useSelector(selectTimebarVisualisation)
  // const fourwingsCategory = DECK_CATEGORY_BY_TIMEBAR_VISUALIZATION[
  //   timebarVisualisation
  // ] as FourwingsDataviewCategory
  // const fourwingsActivityLayer = useFourwingsLayers(fourwingsCategory)
  // const loading = fourwingsActivityLayer?.some((layer) => !layer.loaded)
  // const cellsData: TileCell[] = fourwingsActivityLayer?.[0]?.layerInstance?.getData()

  // const heatmapActivity = useMemo(
  //   () => (cellsData?.length ? getGraphFromGridCellsData(cellsData) || [] : []),
  //   [cellsData]
  // )

  return useMemo(() => ({ loading: false, heatmapActivity: [] }), [])
}
