import { useSelector, useDispatch } from 'react-redux'
import { Geometry } from 'geojson'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { InteractionEvent, useTilesLoading } from '@globalfishingwatch/react-hooks'
import { Generators, TimeChunks } from '@globalfishingwatch/layer-composer'
import { ContextLayerType, Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import type { Style } from '@globalfishingwatch/mapbox-gl'
import { DataviewCategory } from '@globalfishingwatch/api-types/dist'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import { MULTILAYER_SEPARATOR } from '@globalfishingwatch/dataviews-client'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import {
  selectDataviewInstancesResolved,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
import { selectEditing, editRuler } from 'features/map/controls/rulers.slice'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { HOME, USER, WORKSPACE, WORKSPACES_LIST } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import useMapInstance from 'features/map/map-context.hooks'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from 'data/config'
import {
  getGeneratorsConfig,
  selectGlobalGeneratorsConfig,
  WORKSPACE_GENERATOR_ID,
} from './map.selectors'
import {
  setClickedEvent,
  selectClickedEvent,
  fetch4WingInteractionThunk,
  MAX_TOOLTIP_VESSELS,
  fetchEncounterEventThunk,
  SliceInteractionEvent,
  selectFourWingsStatus,
  selectApiEventStatus,
  ExtendedFeatureVessel,
  ExtendedFeatureEvent,
} from './map.slice'
import useViewport from './map-viewport.hooks'
import { useMapSourceLoaded } from './map-features.hooks'

// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  return {
    generatorsConfig: useSelector(getGeneratorsConfig),
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
  }
}

export const useClickedEventConnect = () => {
  const map = useMapInstance()
  const dispatch = useDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const locationType = useSelector(selectLocationType)
  const locationCategory = useSelector(selectLocationCategory)
  const fourWingsStatus = useSelector(selectFourWingsStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const { dispatchLocation } = useLocationConnect()
  const { cleanFeatureState } = useFeatureState(map)
  const { setMapCoordinates } = useViewport()
  const encounterSourceLoaded = useMapSourceLoaded(ENCOUNTER_EVENTS_SOURCE_ID)
  const fourWingsPromiseRef = useRef<any>()
  const eventsPromiseRef = useRef<any>()

  const rulersEditing = useSelector(selectEditing)

  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    console.log(event)
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

    const clusterFeature = event?.features?.find(
      (f) => f.generatorType === Generators.Type.TileCluster
    )
    if (clusterFeature?.properties?.expansionZoom) {
      const { count, expansionZoom, lat, lng } = clusterFeature.properties
      if (count > 1) {
        if (encounterSourceLoaded) {
          setMapCoordinates({
            latitude: lat,
            longitude: lng,
            zoom: expansionZoom,
          })
          cleanFeatureState('click')
        }
        return
      }
    }

    if (fourWingsPromiseRef.current) {
      fourWingsPromiseRef.current.abort()
    }

    if (eventsPromiseRef.current) {
      eventsPromiseRef.current.abort()
    }

    if (!event || !event.features) {
      if (clickedEvent) {
        dispatch(setClickedEvent(null))
      }
      return
    }

    dispatch(setClickedEvent(event as SliceInteractionEvent))

    // get temporal grid clicked features and order them by sublayerindex
    const temporalGridFeatures = event.features
      .filter((feature) => feature.temporalgrid !== undefined && feature.temporalgrid.visible)
      .sort((feature) => feature.temporalgrid?.sublayerIndex ?? 0)
    if (temporalGridFeatures?.length) {
      fourWingsPromiseRef.current = dispatch(fetch4WingInteractionThunk(temporalGridFeatures))
    }

    const encounterFeature = event.features.find(
      (f) => f.generatorType === Generators.Type.TileCluster
    )
    if (encounterFeature) {
      eventsPromiseRef.current = dispatch(fetchEncounterEventThunk(encounterFeature))
    }
  }
  return { clickedEvent, fourWingsStatus, apiEventStatus, dispatchClickedEvent }
}

// TODO this could extend ExtendedFeature
export type TooltipEventFeature = {
  id?: string
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
  event?: ExtendedFeatureEvent
  category: DataviewCategory
}

export type TooltipEvent = {
  latitude: number
  longitude: number
  features: TooltipEventFeature[]
}

export const useMapTooltip = (event?: SliceInteractionEvent | null) => {
  const { t } = useTranslation()
  const dataviews = useSelector(selectDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectTemporalgridDataviews)
  if (!event || !event.features) return null

  const clusterFeature = event.features.find(
    (f) => f.generatorType === Generators.Type.TileCluster && parseInt(f.properties.count) > 1
  )

  // We don't want to show anything else when hovering a cluster point
  if (clusterFeature) {
    return {
      point: event.point,
      latitude: event.latitude,
      longitude: event.longitude,
      features: [
        {
          type: clusterFeature.generatorType,
          properties: clusterFeature.properties,
        } as TooltipEventFeature,
      ],
    }
  }

  const tooltipEventFeatures: TooltipEventFeature[] = event.features.flatMap((feature) => {
    let dataview
    if (feature.generatorId === MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID) {
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
        const cleanGeneratorId = (feature.generatorId as string)?.split(MULTILAYER_SEPARATOR)[0]
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
          // TODO: I have no idea wwhat to put here
          category: DataviewCategory.Context,
        }
        return tooltipWorkspaceFeature
      }
      return []
    }

    let title = dataview.name || dataview.id.toString()
    if (
      dataview.category === DataviewCategory.Context ||
      dataview.category === DataviewCategory.Events
    ) {
      const dataset = dataview.datasets?.[0]
      if (dataset) {
        if (dataview.config?.type === Generators.Type.UserContext) {
          title = dataset.name
        } else {
          title = t(`datasets:${dataset.id}.name` as any) as string
        }
      }
    }
    const tooltipEventFeature: TooltipEventFeature = {
      title,
      type: dataview.config?.type,
      color: dataview.config?.color || 'black',
      category: dataview.category || DataviewCategory.Context,
      ...feature,
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
  const map = useMapInstance()
  // Used to ensure the style is refreshed on load finish
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tilesLoading = useTilesLoading(map)

  if (!map) return null

  let style: Style
  try {
    style = map.getStyle()
  } catch (e) {
    return null
  }

  return style
}

export const useGeneratorStyleMetadata = (generatorId: string) => {
  const style = useMapStyle()
  return style?.metadata?.generatorsMetadata[generatorId] || {}
}
