import { useSelector, useDispatch } from 'react-redux'
import GFWAPI from '@globalfishingwatch/api-client'
import { ExtendedFeature, InteractionEvent } from '@globalfishingwatch/react-hooks'
import { resolveEndpoint, Dataview } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  selectWorkspaceDataviews,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
import { selectTimerange } from 'routes/routes.selectors'
import { setClickedEvent, selectClickedEvent } from './map-features.slice'

export const useClickedEventConnect = () => {
  const dispatch = useDispatch()
  const clickedEvent = useSelector(selectClickedEvent)

  const dataviews = useSelector(selectWorkspaceDataviews)
  const temporalgridDataviews = useSelector(selectTemporalgridDataviews)
  const { start, end } = useSelector(selectTimerange)

  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    if (!event || !event.features) return
    // TODO should work for multiple features
    const feature: ExtendedFeature = event.features[0]
    if (!dataviews || !feature || !feature.temporalgrid) return

    // TODO We assume here that temporalgrid dataviews appear in the same order as sublayers are set in the generator, ie indices will match feature.temporalgrid.sublayerIndex
    const dataview = temporalgridDataviews[feature.temporalgrid.sublayerIndex]
    // TODO How to get the proper id? Should be fishing_v4
    const DATASET_ID = 'dgg_fishing_galapagos'
    const dataset = dataview.datasets?.find((dataset) => dataset.id === DATASET_ID)
    if (!dataset) return []
    const datasetConfig = {
      endpoint: '4wings-interaction',
      datasetId: DATASET_ID,
      params: [
        { id: 'z', value: feature.tile.z },
        { id: 'x', value: feature.tile.x },
        { id: 'y', value: feature.tile.y },
        { id: 'rows', value: feature.temporalgrid.row },
        { id: 'cols', value: feature.temporalgrid.col },
        { id: 'cols', value: feature.temporalgrid.col },
      ],
      query: [
        // TODO remove hardcoded dataset ID
        { id: 'datasets', value: ['fishing_v4'] },
        { id: 'date-range', value: [start, end].join(',') },
        // { id: 'limit', value: 11 },
      ],
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      GFWAPI.fetch(url).then((vessels) => {
        console.log(vessels)
      })
    }

    dispatch(setClickedEvent(event))
  }
  return { clickedEvent, dispatchClickedEvent }
}

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

export const useMapTooltip = (event?: InteractionEvent | null) => {
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
