import { useSelector, useDispatch } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { Map } from '@globalfishingwatch/mapbox-gl'
import { ExtendedFeatureVessel, InteractionEvent } from '@globalfishingwatch/react-hooks'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Dataset, DataviewDatasetConfig } from '@globalfishingwatch/api-types'
import {
  selectDataviewInstancesResolved,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
import { selectTimeRange } from 'features/timebar/timebar.selectors'
import { FISHING_DATASET_TYPE } from 'data/datasets'
import { selectEditing, editRuler } from 'features/map/controls/rulers.slice'
import {
  setClickedEvent,
  selectClickedEvent,
  selectClickedEventStatus,
  fetch4WingInteractionThunk,
  MAX_TOOLTIP_VESSELS,
} from './map.slice'
import { getGeneratorsConfig, selectGlobalGeneratorsConfig } from './map.selectors'

export function useMapImage(map: Map) {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    if (map) {
      map.once('render', () => {
        const canvas = map.getCanvas()
        setImage(canvas.toDataURL())
      })
      // trigger render
      map.setBearing(map.getBearing())
    } else {
      setImage(null)
    }
  }, [map])

  return image
}

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
  const { start, end } = useSelector(selectTimeRange)
  const rulersEditing = useSelector(selectEditing)

  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    if (rulersEditing === true && event) {
      dispatch(
        editRuler({
          longitude: event.longitude,
          latitude: event.latitude,
        })
      )
      return
    }

    if (promiseRef.current) {
      promiseRef.current.abort()
    }

    if (!event || !event.features) {
      if (clickedEvent) {
        dispatch(setClickedEvent(null))
      }
      return
    }

    dispatch(setClickedEvent(event))

    if (!temporalgridDataviews) return

    // get temporal grid clicked features and order them by sublayerindex
    const features = event.features
      .filter((feature) => feature.temporalgrid !== undefined)
      .sort((feature) => feature.temporalgrid?.sublayerIndex ?? 0)

    // get corresponding dataviews
    const featuresDataviews = features.flatMap((feature) => {
      return feature.temporalgrid ? temporalgridDataviews[feature.temporalgrid.sublayerIndex] : []
    })

    // get corresponding datasets
    const featuresDataviewsDatasets = featuresDataviews.map((dv) => {
      // TODO We should take into account user selection here (ie a sublayer could have fishing_v4 and another vms:whatever)
      //     - not just what datasets are available
      const datasets = dv.datasets?.filter(
        (dataset: Dataset) => dataset.type === FISHING_DATASET_TYPE
      )
      return datasets || []
    })

    // use the first feature/dv for common parameters
    const mainFeature = features[0]
    const datasetConfig = {
      endpoint: '4wings-interaction',
      params: [
        { id: 'z', value: mainFeature.tile.z },
        { id: 'x', value: mainFeature.tile.x },
        { id: 'y', value: mainFeature.tile.y },
        { id: 'rows', value: mainFeature.temporalgrid?.row },
        { id: 'cols', value: mainFeature.temporalgrid?.col },
      ],
      query: [
        { id: 'date-range', value: [start, end].join(',') },
        {
          id: 'datasets',
          value: featuresDataviewsDatasets.map((dataviewDatasets) =>
            dataviewDatasets.map((ds: Dataset) => ds.id).join(',')
          ),
        },
      ],
    }
    const filters = featuresDataviews.flatMap((dv) => dv.config?.filter || [])
    if (filters?.length) {
      datasetConfig.query.push({ id: 'filters', value: filters })
    }

    // TODO Not sure of this
    const mainDataset = featuresDataviewsDatasets[0].find(
      (dataset: Dataset) => dataset.type === FISHING_DATASET_TYPE
    )

    if (!mainDataset) return
    promiseRef.current = dispatch(
      fetch4WingInteractionThunk({
        dataset: mainDataset,
        datasetConfig: datasetConfig as DataviewDatasetConfig,
        sublayersIndices: features.map((feature) => feature.temporalgrid?.sublayerIndex || 0),
      })
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
