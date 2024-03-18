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
  { start, end, resolution }: ResolverGlobalConfig,
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
      colorRamp: sublayer?.colorRamp as any, // TODO: fix this
      visible: sublayer?.visible,
      unit: sublayer?.legend?.unit,
    },
  }))

  return {
    id: dataview.id,
    hoveredFeatures: interactions,
    minFrame: startTime,
    maxFrame: endTime,
    visible: true,
    resolution,
    comparisonMode: dataview.config?.comparisonMode,
    visualizationMode: dataview.config?.visualizationMode,
    debug: false,
    // category: dataview.category || DataviewCategory.Activity,
    sublayers,
    colorRampWhiteEnd: dataview.config?.colorRampWhiteEnd,
  }
}
