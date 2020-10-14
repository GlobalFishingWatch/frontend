import { useSelector, useDispatch } from 'react-redux'
import {
  ExtendedFeature,
  ExtendedFeatureVessel,
  InteractionEvent,
} from '@globalfishingwatch/react-hooks'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Dataset } from '@globalfishingwatch/dataviews-client'
import {
  selectDataviewInstancesResolved,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
import { selectTimerange } from 'routes/routes.selectors'
import { FISHING_DATASET_TYPE } from 'features/workspace/workspace.mock'
import {
  setClickedEvent,
  selectClickedEvent,
  selectClickedEventStatus,
  fetch4WingInteractionThunk,
} from './map.slice'
import { getGeneratorsConfig, selectGlobalGeneratorsConfig } from './map.selectors'

// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  return {
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
    generatorsConfig: useSelector(getGeneratorsConfig),
  }
}

export const useClickedEventConnect = () => {
  const dispatch = useDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const clickedEventStatus = useSelector(selectClickedEventStatus)

  const dataviews = useSelector(selectDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectTemporalgridDataviews)
  const { start, end } = useSelector(selectTimerange)

  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    if (event === null) {
      dispatch(setClickedEvent(null))
    }
    if (!event || !event.features) return
    dispatch(setClickedEvent(event))
    // TODO should work for multiple features
    const feature: ExtendedFeature = event.features[0]
    if (!dataviews || !feature || !feature.temporalgrid || !feature.generatorId) return

    // TODO We assume here that temporalgrid dataviews appear in the same order as sublayers are set in the generator, ie indices will match feature.temporalgrid.sublayerIndex
    const dataview = temporalgridDataviews?.[feature.temporalgrid.sublayerIndex]
    const dataset = dataview?.datasets?.find((dataset) => dataset.type === FISHING_DATASET_TYPE)
    if (!dataset) return []
    const datasetConfig = {
      endpoint: '4wings-interaction',
      datasetId: dataset.id,
      generatorId: feature.generatorId as string,
      params: [
        { id: 'z', value: feature.tile.z },
        { id: 'x', value: feature.tile.x },
        { id: 'y', value: feature.tile.y },
        { id: 'rows', value: feature.temporalgrid.row },
        { id: 'cols', value: feature.temporalgrid.col },
      ],
      query: [
        // TODO remove hardcoded dataset ID
        { id: 'datasets', value: [dataset.id] },
        { id: 'date-range', value: [start, end].join(',') },
        // { id: 'limit', value: 11 },
      ],
    }
    dispatch(fetch4WingInteractionThunk({ dataset, datasetConfig }))
  }
  return { clickedEvent, clickedEventStatus, dispatchClickedEvent }
}

export type TooltipEventFeature = {
  title: string
  color?: string
  unit?: string
  value: string
  // TODO decide if we embed the entire dataset or just the id
  dataset?: Dataset
  vesselsInfo?: {
    overflow: boolean
    numVessels: number
    vessels: ExtendedFeatureVessel[]
  }
}

export type TooltipEvent = {
  latitude: number
  longitude: number
  features: TooltipEventFeature[]
}

export const useMapTooltip = (event?: InteractionEvent | null) => {
  const dataviews = useSelector(selectDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectTemporalgridDataviews)
  if (!event || !event.features || !dataviews) return null
  const tooltipEventFeatures: TooltipEventFeature[] = event.features.flatMap((feature) => {
    let dataview
    if (feature.generatorType === Generators.Type.HeatmapAnimated) {
      if (!feature.temporalgrid || feature.temporalgrid.sublayerIndex === undefined) {
        return []
      }

      // TODO We assume here that temporalgrid dataviews appear in the same order as sublayers are set in the generator, ie indices will match feature.temporalgrid.sublayerIndex
      dataview = temporalgridDataviews?.[feature.temporalgrid?.sublayerIndex]
    } else {
      dataview = dataviews.find((dataview) => dataview.id === feature.generatorId)
    }
    if (!dataview) return []
    const tooltipEventFeature: TooltipEventFeature = {
      title: dataview.name || dataview.id.toString(),
      color: dataview.config?.color || 'black',
      // unit: dataview.unit || '',
      value: feature.value,
      ...(feature.dataset && { dataset: feature.dataset }),
    }
    if (feature.vessels) {
      const MAX_VESSELS = 5
      tooltipEventFeature.vesselsInfo = {
        vessels: feature.vessels.slice(0, MAX_VESSELS),
        numVessels: feature.vessels.length,
        overflow: feature.vessels.length > MAX_VESSELS,
      }
    }
    return tooltipEventFeature
  })
  if (!tooltipEventFeatures.length) return null
  return {
    latitude: event.latitude,
    longitude: event.longitude,
    features: tooltipEventFeatures,
  }
}
