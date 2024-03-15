import { PickingInfo } from '@deck.gl/core/typed'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  FourwingsDeckSublayer,
  FourwingsLayerProps,
  getUTCDateTime,
} from '@globalfishingwatch/deck-layers'
import { ResolverGlobalConfig } from './types'

// TODO: decide if include static here or create a new one
export const resolveDeckFourwingsLayerProps = (
  dataview: UrlDataviewInstance,
  { start, end }: ResolverGlobalConfig,
  interactions: PickingInfo[]
): FourwingsLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  const visibleSublayers = dataview.config?.sublayers?.filter((sublayer) => sublayer?.visible)
  const sublayers: FourwingsDeckSublayer[] = (visibleSublayers || []).map((sublayer) => ({
    id: sublayer.id,
    visible: sublayer?.visible ?? true,
    datasets: sublayer?.datasets,
    config: {
      color: (sublayer?.color || dataview.config?.color) as string,
      colorRamp: sublayer?.colorRamp,
      visible: sublayer?.visible,
      unit: sublayer?.legend.unit,
    },
  }))
  return {
    id: dataview.id,
    // category: dataview.id,
    hoveredFeatures: interactions,
    minFrame: startTime,
    maxFrame: endTime,
    visible: true,
    comparisonMode: dataview.config?.mode,
    mode: 'heatmap',
    debug: false,
    // category: dataview.category || DataviewCategory.Activity,
    sublayers,
    colorRampWhiteEnd: dataview.config?.colorRampWhiteEnd,
  }
}
