import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { FourwingsDeckSublayer, FourwingsLayerProps } from '@globalfishingwatch/deck-layers'
import { FourwingsDataviewCategory } from '@globalfishingwatch/deck-layer-composer'
import { GROUP_ORDER, Group } from '@globalfishingwatch/layer-composer'
import { getUTCDateTime } from '../utils/dates'
import { GlobalConfig } from './types'

export const resolveDeckFourwingsLayerProps = (
  dataview: UrlDataviewInstance,
  { start, end }: GlobalConfig
): FourwingsLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity
  const category = dataview.category as FourwingsDataviewCategory | undefined

  const visibleSublayers = dataview.config?.sublayers?.filter((sublayer) => sublayer?.visible)
  const sublayers: FourwingsDeckSublayer[] = (visibleSublayers || []).map((sublayer) => ({
    id: sublayer.id,
    visible: sublayer?.visible ?? true,
    datasets: sublayer?.datasets,
    config: {
      color: (sublayer?.color || dataview.config?.color) as string,
      colorRamp: sublayer?.colorRamp,
      visible: sublayer?.visible,
    },
  }))
  return {
    id: dataview.id,
    category,
    minFrame: startTime,
    maxFrame: endTime,
    visible: true,
    // mode: activityMode,
    mode: 'heatmap',
    debug: false,
    zIndex: GROUP_ORDER.indexOf(Group.Heatmap),
    // category: dataview.category || DataviewCategory.Activity,
    sublayers,
    colorRampWhiteEnd: sublayers.length === 1,
  }
}
