import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { ExtendedFeatureVessel, InteractionEvent } from '@globalfishingwatch/react-hooks'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Dataset } from '@globalfishingwatch/api-types'
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
  MAX_TOOLTIP_VESSELS,
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
  const promiseRef = useRef<any>()

  const temporalgridDataviews = useSelector(selectTemporalgridDataviews)
  const { start, end } = useSelector(selectTimerange)

  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    if (promiseRef.current) {
      promiseRef.current.abort()
    }
    if (event === null) {
      dispatch(setClickedEvent(null))
    }
    if (!event || !event.features) return
    dispatch(setClickedEvent(event))

    if (!temporalgridDataviews) return

    // get temporal grid clicked features and order them by sublayerindex
    const features = event.features
      .filter((feature) => feature.temporalgrid !== undefined)
      .sort((feature) => feature.temporalgrid!.sublayerIndex || 0)

    // get corresponding dataviews
    const featuresDataviews = features.map(
      (feature) => temporalgridDataviews[feature.temporalgrid!.sublayerIndex]
    )

    // get corresponding datasets
    const featuresDataviewsDatasets = featuresDataviews.map((dv) => {
      // TODO We should take into acocunt user selection here - not just what datasets are available
      const datasets = dv.datasets?.filter(
        (dataset: Dataset) => dataset.type === FISHING_DATASET_TYPE
      )
      return datasets
    })

    // use the first feature/dv for common parameters
    const mainFeature = features[0]

    const datasetConfig = {
      endpoint: '4wings-interaction',
      params: [
        { id: 'z', value: mainFeature.tile.z },
        { id: 'x', value: mainFeature.tile.x },
        { id: 'y', value: mainFeature.tile.y },
        { id: 'rows', value: mainFeature.temporalgrid!.row },
        { id: 'cols', value: mainFeature.temporalgrid!.col },
      ],
      query: [
        { id: 'date-range', value: [start, end].join(',') },
        {
          id: 'datasets',
          value: featuresDataviewsDatasets.map((dataviewDatasets) =>
            dataviewDatasets.map((ds: Dataset) => ds.id).join(',')
          ),
        },
        { id: 'filters', value: featuresDataviews.map((dv) => dv.config.filter) },
        // { id: 'limit', value: 11 },
      ],
    }

    // TODO Not sure of this
    const mainDataset = featuresDataviewsDatasets[0][0]
    console.log(mainDataset, datasetConfig)
    promiseRef.current = dispatch(
      fetch4WingInteractionThunk({ dataset: mainDataset, datasetConfig })
    )
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
      tooltipEventFeature.vesselsInfo = {
        vessels: feature.vessels.slice(0, MAX_TOOLTIP_VESSELS),
        numVessels: feature.vessels.length,
        overflow: feature.vessels.length > MAX_TOOLTIP_VESSELS,
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
