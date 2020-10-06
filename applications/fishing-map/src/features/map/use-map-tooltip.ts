import { useSelector } from 'react-redux'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import {
  selectWorkspaceDataviews,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'

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

const useMapTooltip = (event?: InteractionEvent | null) => {
  const dataviews = useSelector(selectWorkspaceDataviews)
  const temporalgridDataviews = useSelector(selectTemporalgridDataviews)
  if (!event || !event.features || !dataviews) return null
  const tooltipEventFeatures: TooltipEventFeature[] = event.features.flatMap((feature) => {
    let dataview
    if (feature.generator === Generators.Type.HeatmapAnimated) {
      if (!feature.temporalgrid || feature.temporalgrid.sublayerIndex === undefined) {
        return []
      }

      // TODO We assume here that temporalgrid dataviews appear in the same order as sublayers are set in the generator, ie indices will match feature.temporalgrid.sublayerIndex
      dataview = temporalgridDataviews[feature.temporalgrid?.sublayerIndex]
    } else {
      dataview = dataviews.find((dataview: Dataview) => dataview.id === feature.generatorId)
    }
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

export default useMapTooltip
