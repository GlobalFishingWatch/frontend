import { Dataview } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { InteractionEvent, ExtendedFeature } from '../use-map-interaction'

export type TooltipEventFeature = {
  title: string
  color?: string
  unit?: string
  value: string
}

export type TooltipEvent = {
  latitude: number
  longitude: number
  features: TooltipEventFeature[]
}

const findDataviewForFeature = (dataviews: Dataview[], feature: ExtendedFeature) => {
  if (feature.generator === Generators.Type.HeatmapAnimated) {
    if (!feature.temporalgrid || feature.temporalgrid.sublayerIndex === undefined) {
      return null
    }
    const allTemporalgridDataviews = dataviews.filter(
      (dataview) => dataview.config.type === Generators.Type.HeatmapAnimated
    )
    // TODO We assume here that temporalgrid dataviews appear in the same order as sublayers are set in the generator, ie indices will match feature.temporalgrid.sublayerIndex
    const dataview = allTemporalgridDataviews[feature.temporalgrid?.sublayerIndex]
    return dataview
  } else {
    return dataviews.find((dataview: Dataview) => dataview.id === feature.generatorId)
  }
}

export const getTooltipEvent = (
  dataviews?: Dataview[],
  event?: InteractionEvent | null
): TooltipEvent | null => {
  if (!event || !event.features || !dataviews) return null
  const tooltipEventFeatures: TooltipEventFeature[] = event.features.flatMap((feature) => {
    const dataview = findDataviewForFeature(dataviews, feature)
    if (!dataview) return []
    return {
      title: dataview.name || dataview.id.toString(),
      color: dataview.config.color || 'black',
      // unit: dataview.unit || '',
      value: feature.value,
    }
  })
  if (!tooltipEventFeatures.length) return null
  return {
    latitude: event.latitude,
    longitude: event.longitude,
    features: tooltipEventFeatures,
  }
}

const useMapTooltip = (dataviews?: Dataview[], interactionEvent?: InteractionEvent | null) => {
  const tooltipEvent = getTooltipEvent(dataviews, interactionEvent)
  return tooltipEvent
}

export default useMapTooltip
