import { createSelector } from 'reselect'
import {
  BackgroundGeneratorConfig,
  BasemapGeneratorConfig,
  BasemapType,
  GeneratorType,
  GlGeneratorConfig,
  HeatmapGeneratorConfig,
  TrackGeneratorConfig,
  VesselEventsGeneratorConfig,
} from '@globalfishingwatch/layer-composer'
import { getDataviewsGeneratorConfigs } from '@globalfishingwatch/dataviews-client'
import CONTEXT_DATAVIEWS from 'data/dataviews/context'
import {
  getEventsLoaded,
  getEventsLoading,
  getCurrentEventsPortsGeojson,
  getCurrentEventsListFilteredGeojson,
  getCurrentEventsCarriers,
} from 'redux-modules/events/events.selectors'
import {
  hasVesselSelected,
  getEventType,
  getRfmos,
  getLayers,
  getEezs,
  getHasVesselFilter,
} from 'redux-modules/router/route.selectors'
import {
  getTrackEventsGeojson,
  getEncounterVesselTrackGeojson,
  getVesselTrackGeojsonByDateRange,
} from 'redux-modules/tracks/tracks.selectors'
import {
  getEncounterEventVesselId,
  getCurrentEventByTimestamp,
  getCurrentEventDates,
} from 'redux-modules/vessel/vessel.selectors'
import {
  CONTEXT_LAYERS,
  BASEMAP_COLOR,
  EVENTS_COLORS,
  EVENT_TYPES,
  EVENTS_LAYERS,
  CONTEXT_LAYERS_IDS,
} from 'data/constants'
import { TYPES as CARRIER_TYPES } from 'components/map/layers/generators'
import { getMapDownloadVisible } from 'redux-modules/app/app.selectors'
import { AppState } from 'types/redux.types'
import { LayerTypes } from 'types/app.types'
import { ClusterEventsGeneratorConfig } from './layers/generators/clusters-events-generator'

const FILL_SELECTED_FEATURES_COLOR = 'rgba(0, 0, 0, 0.3)'
const background: BackgroundGeneratorConfig = {
  id: 'background',
  type: GeneratorType.Background,
}
const basemap: BasemapGeneratorConfig = {
  id: 'landmass',
  type: GeneratorType.Basemap,
  basemap: BasemapType.Default,
}

export const getEventMapLayer = (layerId: string) =>
  createSelector([getLayers, hasVesselSelected], (layersActive, hasVessel) => {
    const layer = EVENTS_LAYERS.find((l) => l.id === layerId)
    if (!layer) return null
    return {
      ...layer,
      active: layersActive !== null && layersActive.includes(layer.id),
      disabled: hasVessel,
    }
  })

export const getCurrentEventMapLayer = createSelector(
  [(state: AppState) => getEventMapLayer(getEventType(state))(state)],
  (currentEventLayer) => currentEventLayer
)

export const getEncounterEventsLayer = createSelector(
  [
    getCurrentEventsListFilteredGeojson,
    getEventsLoading,
    getEventMapLayer(EVENT_TYPES.encounter),
    hasVesselSelected,
  ],
  (
    geojson,
    eventsLoading,
    encountersEventLayer,
    hasVessel
  ): ClusterEventsGeneratorConfig | null => {
    const visible = geojson && !eventsLoading && !hasVessel && encountersEventLayer?.active

    if (!visible) return null

    const clusterColor = [
      'case',
      ['==', ['get', 'unmatched'], true],
      EVENTS_COLORS.unmatched,
      ['==', ['get', 'partially'], true],
      EVENTS_COLORS.partially,
      EVENTS_COLORS.encounter,
    ]
    const pointColor = [
      'case',
      ['==', ['get', 'authorizationStatus'], 'unmatched'],
      EVENTS_COLORS.unmatched,
      ['==', ['get', 'authorizationStatus'], 'partially'],
      EVENTS_COLORS.partially,
      EVENTS_COLORS.encounter,
    ]
    const pointIcon = 'carrier_portal_encounter'
    return {
      id: 'cp_encounters_clustering',
      type: CARRIER_TYPES.CLUSTER,
      data: { geojson, clusterColor, pointColor, pointIcon },
    }
  }
)

export const getLoiteringEventsLayer = createSelector(
  [
    getCurrentEventsListFilteredGeojson,
    getEventsLoading,
    getEventMapLayer(EVENT_TYPES.loitering),
    hasVesselSelected,
  ],
  (geojson, eventsLoading, loiteringEventLayer, hasVessel): ClusterEventsGeneratorConfig | null => {
    const visible = geojson && !eventsLoading && !hasVessel && loiteringEventLayer?.active

    if (!geojson || !visible) return null

    const color = EVENTS_COLORS.loitering
    return {
      id: 'cp_loitering_clustering',
      type: CARRIER_TYPES.CLUSTER,
      data: {
        geojson,
        pointColor: color,
        clusterColor: color,
        pointIcon: 'carrier_portal_loitering',
      },
    }
  }
)

export const getClusterLayers = createSelector(
  [getEncounterEventsLayer, getLoiteringEventsLayer],
  (encountersLayer, loiteringLayer): ClusterEventsGeneratorConfig[] => {
    const layers = []
    if (encountersLayer) layers.push(encountersLayer)
    if (loiteringLayer) layers.push(loiteringLayer)
    return layers
  }
)

export const getContextualLayerVisible = (layerId: string) =>
  createSelector([getLayers], (layersActive) => {
    const visible = layersActive !== null && layersActive.includes(layerId)
    return visible
  })

export const getContextualMapGenerator = (layerId: LayerTypes) =>
  createSelector([getLayers], (layersActive) => {
    const layer = CONTEXT_LAYERS.find((l) => l.id === layerId)
    if (!layer || !layer.id) return null

    const visible = layersActive !== null && layersActive.includes(layerId)

    // 👋 keep working from 📍 adding dataviews and datasets
    const layerDataview = CONTEXT_DATAVIEWS.find((l) => l.id === layer.id)

    if (!layerDataview) return null

    const generatorsConfig = getDataviewsGeneratorConfigs(
      [{ ...layerDataview, config: { ...layerDataview.config, id: layer.id, visible } }],
      generatorConfig
    )

    return generatorsConfig?.length > 1 ? generatorsConfig : generatorsConfig[0]
  })

export const getRFMOLayer = createSelector(
  [getContextualMapGenerator(CONTEXT_LAYERS_IDS.rfmo), getRfmos],
  (layer, selectedRfmos) => {
    if (!layer) return null

    return {
      ...layer,
      selectedFeatures: {
        values: selectedRfmos || [],
        fill: {
          color: FILL_SELECTED_FEATURES_COLOR,
          outlineColor: 'rgba(181,179,242,1)',
        },
      },
    }
  }
)

const generatorConfig = {}
export const getMPALayer = getContextualMapGenerator(CONTEXT_LAYERS_IDS.mpant)
export const getOtherRFMOSLayer = getContextualMapGenerator(CONTEXT_LAYERS_IDS.otherRfmos)
export const getEEZLayer = createSelector(
  [getContextualMapGenerator(CONTEXT_LAYERS_IDS.eez), getEezs],
  (layer, selectedEezs) => {
    return layer || null
    // TODO highlight selected eez with featureState
    return {
      ...layer,
      selectedFeatures: {
        values: selectedEezs || [],
        fill: {
          color: FILL_SELECTED_FEATURES_COLOR,
          outlineColor: 'rgba(207,239,223g,1)',
        },
      },
    }
  }
)
export const getBluefinLayer = getContextualMapGenerator(CONTEXT_LAYERS_IDS.bluefinRfmo)

export const getPortsLayer = createSelector(
  [
    getContextualLayerVisible(CONTEXT_LAYERS_IDS.nextPort),
    getCurrentEventsPortsGeojson,
    hasVesselSelected,
    getMapDownloadVisible,
  ],
  (layerVisible, eventPorts, vesselSelected, downloadVisible): GlGeneratorConfig => {
    return {
      id: CONTEXT_LAYERS_IDS.nextPort,
      type: GeneratorType.GL,
      visible: layerVisible && !vesselSelected && !downloadVisible,
      sources: [
        {
          type: 'geojson',
          data: (eventPorts || null) as any,
        },
      ],
      layers: [
        {
          id: CONTEXT_LAYERS_IDS.nextPort,
          type: 'circle',
          paint: {
            'circle-color': EVENTS_COLORS.port,
            'circle-stroke-width': 2,
            'circle-stroke-color': BASEMAP_COLOR,
            'circle-radius': ['interpolate', ['exponential', 0.5], ['zoom'], 2, 4, 7, 10],
          },
        } as any,
      ],
    }
  }
)

export const getEventsLayer = createSelector(
  [getTrackEventsGeojson, hasVesselSelected, getCurrentEventByTimestamp],
  (trackEvents, vesselSelected, currentEvent): VesselEventsGeneratorConfig[] => {
    if (!trackEvents || !vesselSelected) return []
    return [
      {
        id: 'cp_vessel_events',
        type: GeneratorType.VesselEvents,
        data: trackEvents,
        currentEventId: currentEvent?.id,
      },
    ]
  }
)

export const HeatmapLayerId = 'fishing-heatmap'

const getHeatmapLayer = createSelector(
  [getLayers, getEventsLoaded, getCurrentEventsCarriers, getHasVesselFilter],
  (layersActive, eventsLoaded, eventsCarriers, hasVesselFilter): HeatmapGeneratorConfig => {
    const dataset = 'carriers_v8_hd'

    let filters = 'filters[0]=distance_from_port_m > 10000'

    let visible = eventsLoaded && layersActive !== null && layersActive.includes('heatmap')
    if (!visible) {
      return
    }
    if (hasVesselFilter === true && eventsCarriers !== null) {
      if (eventsCarriers.length === 0) {
        visible = false
      } else {
        const carrierIds = eventsCarriers.map((c) => c.id)
        const carrierIdsStr = carrierIds.join("', '")
        filters += ` AND vesselid IN ('${carrierIdsStr}')`
      }
    }

    return {
      type: GeneratorType.Heatmap,
      id: HeatmapLayerId,
      visible,
      numBreaks: 6,
      maxZoom: 8,
      scalePowExponent: 10,
      fetchStats: visible,
      filters,
      datasets: [dataset],
      tilesUrl: `/v1/4wings/tile/heatmap/{z}/{x}/{y}`,
      statsUrl: `/v1/4wings/legend`,
    }
  }
)

export const getContextualLayers = createSelector(
  [
    getRFMOLayer,
    getOtherRFMOSLayer,
    getMPALayer,
    getEEZLayer,
    getBluefinLayer,
    getHeatmapLayer,
    hasVesselSelected,
  ],
  (RFMOLayer, OtherRFMOSLayer, MPALayer, EEZLayer, BluefinLayer, Heatmap, hasVessel) => {
    let layers = []
    if (Heatmap && hasVessel === false) layers.push(Heatmap)
    if (RFMOLayer) layers.push(RFMOLayer)
    if (OtherRFMOSLayer) layers.push(OtherRFMOSLayer)
    if (MPALayer) layers.push(MPALayer)
    if (EEZLayer) layers = layers.concat(EEZLayer)
    if (BluefinLayer) layers.push(BluefinLayer)
    return layers
  }
)

export const getVesselTrackLayer = createSelector(
  [getVesselTrackGeojsonByDateRange, hasVesselSelected, getCurrentEventDates],
  (vesselTrack, hasVessel, currentEventDates): TrackGeneratorConfig => {
    return {
      id: 'cp_track',
      visible: hasVessel && vesselTrack !== null,
      data: vesselTrack,
      type: GeneratorType.Track,
      simplify: true,
      color: 'rgba(0, 193, 231, 1)',
      ...(currentEventDates && {
        highlightedEvent: {
          start: new Date(currentEventDates.start).toISOString(),
          end: new Date(currentEventDates.end).toISOString(),
        },
      }),
    }
  }
)

export const getEncounterVesselTrackLayer = createSelector(
  [
    getEncounterVesselTrackGeojson,
    hasVesselSelected,
    getCurrentEventDates,
    getEncounterEventVesselId,
  ],
  (vesselTrack, hasVessel, currentEventDates, encounterVessel): TrackGeneratorConfig | null => {
    if (!vesselTrack) return null
    return {
      type: GeneratorType.Track,
      id: 'cp_encounter_track',
      visible: hasVessel && encounterVessel !== null,
      data: vesselTrack,
      simplify: true,
      color: 'rgba(245, 158, 132, 1)',
      ...(currentEventDates && {
        highlightedEvent: {
          start: new Date(currentEventDates.start).toISOString(),
          end: new Date(currentEventDates.end).toISOString(),
        },
      }),
    }
  }
)

export const getTrackLayers = createSelector(
  [getVesselTrackLayer, getEncounterVesselTrackLayer],
  (vesselTrack, encounterTrack): TrackGeneratorConfig[] => {
    const tracks = [vesselTrack]
    if (encounterTrack) {
      tracks.push(encounterTrack)
    }
    return tracks
  }
)

export const getLayerComposerLayers = createSelector(
  [getPortsLayer, getEventsLayer, getContextualLayers, getClusterLayers, getTrackLayers],
  (portsLayer, eventsLayer, contextualLayers, clusterLayers, trackLayers) => {
    return [
      background,
      basemap,
      ...contextualLayers,
      portsLayer,
      ...clusterLayers,
      ...trackLayers,
      ...eventsLayer,
    ]
  }
)
