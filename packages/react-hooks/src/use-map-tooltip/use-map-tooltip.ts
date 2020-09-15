import { InteractionEvent } from '../use-map-interaction/use-map-interaction'

// TODO use dataview type from dataview-client
type Dataview = {
  id: string | number
  title?: string
  color?: string
  unit?: string
}

type TooltipEventFeature = {
  title: string
  color?: string
  unit?: string
  value: string
}

type TooltipEvent = {
  latitude: number
  longitude: number
  features: TooltipEventFeature[]
}

export const getTooltipEvent = (
  dataviews: Dataview[],
  event?: InteractionEvent
): TooltipEvent | null => {
  if (!event || !event.features) return null
  const tooltipEventFeatures: TooltipEventFeature[] = event.features.flatMap((feature) => {
    const dataview = dataviews.find((dataview: Dataview) => dataview.id === feature.generatorId)
    if (!dataview) return []
    console.log(feature, dataview)
    return [
      {
        title: dataview.title || dataview.id.toString(),
        color: dataview.color || 'black',
        unit: dataview.unit || '',
        value: feature.value,
      },
    ]
  })
  return {
    latitude: event.latitude,
    longitude: event.longitude,
    features: tooltipEventFeatures,
  }
}

const useMapTooltip = (dataviews: Dataview[], interactionEvent?: InteractionEvent) => {
  const tooltipEvent = getTooltipEvent(dataviews, interactionEvent)
  return tooltipEvent
}

export default useMapTooltip
