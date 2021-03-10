import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { Geometry } from 'geojson'
import {
  ExtendedFeatureVessel,
  InteractionEvent,
  useTilesLoading,
} from '@globalfishingwatch/react-hooks'
import { Generators, TimeChunks } from '@globalfishingwatch/layer-composer'
import { ContextLayerType, Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Style } from '@globalfishingwatch/mapbox-gl'
import {
  selectDataviewInstancesResolved,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
import { selectEditing, editRuler } from 'features/map/controls/rulers.slice'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { HOME, USER, WORKSPACE, WORKSPACES_LIST } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import {
  getGeneratorsConfig,
  selectGlobalGeneratorsConfig,
  WORKSPACE_GENERATOR_ID,
} from './map.selectors'
import {
  setClickedEvent,
  selectClickedEvent,
  selectClickedEventStatus,
  fetch4WingInteractionThunk,
  MAX_TOOLTIP_VESSELS,
} from './map.slice'
import { useMapboxInstance } from './map.context'

// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  return {
    generatorsConfig: useSelector(getGeneratorsConfig),
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
  }
}

export const useClickedEventConnect = () => {
  const dispatch = useDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const locationType = useSelector(selectLocationType)
  const locationCategory = useSelector(selectLocationCategory)
  const clickedEventStatus = useSelector(selectClickedEventStatus)
  const { dispatchLocation } = useLocationConnect()
  const promiseRef = useRef<any>()

  const rulersEditing = useSelector(selectEditing)

  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    // Used on workspaces-list or user panel to go to the workspace detail page
    if (locationType === USER || locationType === WORKSPACES_LIST) {
      const workspace = event?.features?.find(
        (feature: any) => feature.properties.type === 'workspace'
      )
      if (workspace) {
        const isDefaultWorkspace = workspace.properties.id === DEFAULT_WORKSPACE_ID
        dispatchLocation(
          isDefaultWorkspace ? HOME : WORKSPACE,
          isDefaultWorkspace
            ? {}
            : {
                // TODO: grab category from workspace and use it before the fishing fallback
                category: locationCategory || WorkspaceCategories.FishingActivity,
                workspaceId: workspace.properties.id,
              },
          true
        )
        return
      }
    }

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
      .filter((feature) => feature.temporalgrid !== undefined && feature.temporalgrid.visible)
      .sort((feature) => feature.temporalgrid?.sublayerIndex ?? 0)

    if (temporalGridFeatures?.length) {
      promiseRef.current = dispatch(fetch4WingInteractionThunk(temporalGridFeatures))
    }
  }
  return { clickedEvent, clickedEventStatus, dispatchClickedEvent }
}

export type TooltipEventFeature = {
  title?: string
  type?: Type
  color?: string
  unit?: string
  source: string
  sourceLayer: string
  layerId: string
  contextLayer?: ContextLayerType | null
  geometry?: Geometry
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
  if (!event || !event.features) return null
  const tooltipEventFeatures: TooltipEventFeature[] = event.features.flatMap((feature) => {
    let dataview
    if (feature.generatorType === Generators.Type.HeatmapAnimated) {
      const { temporalgrid } = feature
      if (!temporalgrid || temporalgrid.sublayerIndex === undefined || !temporalgrid.visible) {
        return []
      }

      // TODO We assume here that temporalgrid dataviews appear in the same order as sublayers are set in the generator, ie indices will match feature.temporalgrid.sublayerIndex
      dataview = temporalgridDataviews?.[temporalgrid?.sublayerIndex]
    } else {
      dataview = dataviews?.find((dataview) => {
        // Needed to get only the initial part to support multiple generator
        // from the same dataview, see map.selectors L137
        const cleanGeneratorId = (feature.generatorId as string)?.split('__')[0]
        return dataview.id === cleanGeneratorId
      })
    }

    if (!dataview) {
      // Not needed to create a dataview just for the workspaces list interaction
      if (feature.generatorId && (feature.generatorId as string).includes(WORKSPACE_GENERATOR_ID)) {
        const tooltipWorkspaceFeature: TooltipEventFeature = {
          source: feature.source,
          sourceLayer: feature.sourceLayer,
          layerId: feature.layerId as string,
          type: Generators.Type.GL,
          value: feature.properties.label,
          properties: {},
        }
        return tooltipWorkspaceFeature
      }
      return []
    }

    const tooltipEventFeature: TooltipEventFeature = {
      title: dataview.name || dataview.id.toString(),
      type: dataview.config?.type,
      color: dataview.config?.color || 'black',
      unit: feature.unit,
      value: feature.value,
      source: feature.source,
      sourceLayer: feature.sourceLayer,
      geometry: feature.geometry,
      layerId: feature.layerId,
      contextLayer: feature.generatorContextLayer,
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
    point: event.point,
    latitude: event.latitude,
    longitude: event.longitude,
    features: tooltipEventFeatures,
  }
}

export const useMapStyle = () => {
  const mapInstance = useMapboxInstance()
  // Used to ensure the style is refreshed on load finish
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tilesLoading = useTilesLoading(mapInstance)

  if (!mapInstance) return null

  let style: Style
  try {
    style = mapInstance.getStyle()
  } catch (e) {
    return null
  }

  return style
}

export const useCurrentTimeChunkId = () => {
  const style = useMapStyle()
  const currentTimeChunks = style?.metadata?.temporalgrid?.timeChunks as TimeChunks
  const currentTimeChunkId = currentTimeChunks?.activeId
  return currentTimeChunkId
}
