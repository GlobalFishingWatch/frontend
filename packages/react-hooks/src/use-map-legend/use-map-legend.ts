import { useMemo } from 'react'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { ExtendedStyle } from '@globalfishingwatch/layer-composer/dist/types'
import { InteractionEvent } from '../use-map-interaction'
import { LegendLayer } from '.'

export function mergeStyleDataview(
  style: ExtendedStyle,
  dataviews: Dataview[]
): LegendLayer[] | undefined {
  if (!style.layers) return
  return style?.layers?.flatMap((layer) => {
    if (!layer.metadata?.legend) return []
    debugger
    const dataview = dataviews.find(
      (dataview: Dataview) => dataview.id === (layer?.metadata?.generatorId as any)
    )

    return {
      ...layer.metadata.legend,
      color: dataview?.config?.color || 'red',
    }
  })
}

export function mergeLegendLayersEvent(layers: LegendLayer[], event?: InteractionEvent) {
  if (!event) return layers
  return []
}

export function getLegendConfig(
  style: ExtendedStyle,
  dataviews: Dataview[],
  event?: InteractionEvent
): LegendLayer[] | undefined {
  const layersConfig = mergeStyleDataview(style, dataviews)
  return event ? mergeLegendLayersEvent(layersConfig as any, event) : layersConfig
}

function useMapLegend(
  style?: ExtendedStyle,
  dataviews?: Dataview[],
  interactionEvent?: InteractionEvent
) {
  const legendLayers = useMemo(() => {
    if (!style || !dataviews) return
    const legendLayers = getLegendConfig(style, dataviews, interactionEvent)
    console.log('legendLayers -> legendLayers', legendLayers)
    return [] as LegendLayer[]
  }, [dataviews, interactionEvent, style])
  return legendLayers
}
export default useMapLegend
