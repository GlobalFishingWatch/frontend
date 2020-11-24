import { useSelector, useDispatch } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { Map } from '@globalfishingwatch/mapbox-gl'
import { ExtendedFeatureVessel, InteractionEvent } from '@globalfishingwatch/react-hooks'
import { Generators } from '@globalfishingwatch/layer-composer'
import { ContextLayerType, Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import {
  selectDataviewInstancesResolved,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
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

    // get temporal grid clicked features and order them by sublayerindex
    const temporalGridFeatures = event.features
      .filter((feature) => feature.temporalgrid !== undefined)
      .sort((feature) => feature.temporalgrid?.sublayerIndex ?? 0)

    if (temporalGridFeatures?.length) {
      promiseRef.current = dispatch(fetch4WingInteractionThunk(temporalGridFeatures))
    }
  }
  return { clickedEvent, clickedEventStatus, dispatchClickedEvent }
}

export type TooltipEventFeature = {
  title: string
  type?: Type
  color?: string
  unit?: string
  layer?: ContextLayerType | null
  value: string
  properties: Record<string, string>
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
      dataview = dataviews.find((dataview) => {
        // Needed to get only the initial part to support multiple generator
        // from the same dataview, see map.selectors L137
        const cleanGeneratorId = (feature.generatorId as string)?.split('__')[0]
        return dataview.id === cleanGeneratorId
      })
    }
    if (!dataview) return []

    const tooltipEventFeature: TooltipEventFeature = {
      title: dataview.name || dataview.id.toString(),
      type: dataview.config?.type,
      color: dataview.config?.color || 'black',
      // unit: dataview.unit || '',
      value: feature.value,
      layer: feature.generatorContextLayer,
      properties: { ...feature.properties },
    }
    // Insert custom properties by each dataview configuration
    const properties = dataview.datasetsConfig
      ? dataview.datasetsConfig.flatMap((datasetConfig) => {
          if (!datasetConfig.query?.length) return []
          return datasetConfig.query.flatMap((query) =>
            query.id === 'properties' ? (query.value as string) : []
          )
        })
      : []
    properties.forEach((property) => {
      if (feature.properties[property]) {
        tooltipEventFeature.properties[property] = feature.properties[property]
      }
    })

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
