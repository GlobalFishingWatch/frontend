/** Map routes: get_workspace, get_map_view, get_clicked_feature, get_workspaces_list */

import type {
  AssistantBbox,
  AssistantDatedValue,
  AssistantLonLat,
  AssistantTimeRange,
  AssistantVesselRef,
} from './shared-context-tool.types.js'

export type AssistantWorkspaceDataviewInstance = {
  id: string
  dataviewId?: string | number
  config?: object
  datasetsConfig?: object[]
}

export type AssistantWorkspace = {
  id?: string
  name?: string
  /** Workspace settings the url state does not override */
  state: Record<string, unknown>
  /** Visible layers the url state does not list, with their full config */
  dataviewInstances?: AssistantWorkspaceDataviewInstance[]
}

/** What tells sublayers of the same layer apart, e.g. two AIS effort layers with different flags */
export type AssistantSublayerInfo = {
  dataviewId: string
  datasets: string[]
  /** SQL resolved from the dataview filters, e.g. "flag IN ('FRA')" */
  filter?: string
  vesselGroups?: string | string[]
  unit?: string
}

export type AssistantHeatmapSublayerView = AssistantSublayerInfo & {
  /** 0 = no data in this view */
  cellsWithData: number
  min?: number
  max?: number
  /** Sum layers */
  total?: number
  /** Average layers (e.g. environment) */
  mean?: number
  maxValueAt?: AssistantLonLat
  dataBbox?: AssistantBbox
}

type MapViewLayerBase = {
  category?: string
  /** false: the layer was still loading its tiles, its numbers are partial */
  loaded?: false
}

export type AssistantHeatmapLayerView = MapViewLayerBase & {
  mode: string
  dataviewIds: string[]
  sublayers: AssistantHeatmapSublayerView[]
}

export type AssistantPositionsLayerView = MapViewLayerBase & {
  mode: string
  dataviewIds: string[]
  positionsInView: number
  vesselsInView: number
  topVessels: { id: string; name?: string; value: number }[]
}

export type AssistantClustersLayerView = MapViewLayerBase & {
  dataviewId: string
  eventType?: string
  clustersInView: number
  eventsInView: number
}

export type AssistantContextAreasLayerView = MapViewLayerBase & {
  dataviewIds: string[]
  areasInView: number
  closestToCenter: { id?: string | number; label?: string }[]
}

/** Track points drawn inside the viewport for the current time range */
export type AssistantTrackInView = {
  /** 0 = no data here for this time range */
  pointsInView: number
  bboxInView?: AssistantBbox
  firstInView?: string
  lastInView?: string
  /** [min, max] */
  speedKnotsInView?: number[]
}

export type AssistantVesselTrackLayerView = MapViewLayerBase &
  AssistantTrackInView & {
    dataviewId: string
    name?: string
    /** Whole track, any date */
    trackBbox?: AssistantBbox
    /** Vessel events in view by event type */
    eventsInView: Record<string, number>
  }

export type AssistantUserTrackLayerView = MapViewLayerBase &
  AssistantTrackInView & {
    dataviewId: string
    /** Whole track, any date */
    trackBbox?: AssistantBbox
  }

export type AssistantMapLayerView =
  | AssistantHeatmapLayerView
  | AssistantPositionsLayerView
  | AssistantClustersLayerView
  | AssistantContextAreasLayerView
  | AssistantVesselTrackLayerView
  | AssistantUserTrackLayerView

export type AssistantMapView = {
  /** Ocean / EEZ name at the map center */
  areaName?: string
  bounds?: AssistantBbox
  layers: AssistantMapLayerView[]
}

/** Events grouped by vessel, e.g. port visits in one port */
export type AssistantGroupedEvent = {
  id: string
  type: string
  port?: string
  totalVessels: number
  vessels: (AssistantVesselRef & { events?: number })[]
}

type AssistantRfmoAuthorization = { rfmo: string; authorized: boolean }

/** Encounters: public authorizations by the RFMOs of the event area */
export type AssistantEventAuthorization = {
  /** Main vessel: authorized (by every RFMO), partially or unmatched (no known authorization) */
  status?: string
  /** Main vessel, per RFMO */
  rfmos?: AssistantRfmoAuthorization[]
  /** Each vessel of the encounter, by vessel `id` */
  vessels?: { id: string; rfmos: AssistantRfmoAuthorization[] }[]
}

export type AssistantSingleEvent = {
  id: string
  type: string
  start?: string
  end?: string
  position?: AssistantLonLat
  vessel?: AssistantVesselRef
  encounteredVessel?: AssistantVesselRef
  port?: string
  /** Port visit, loitering or gap duration */
  durationHrs?: number
  distanceFromShoreKm?: number
  /** Port the vessel visited next */
  nextPort?: string
  encounteredVesselNextPort?: string
  authorization?: AssistantEventAuthorization
}

export type AssistantEventSummary = AssistantGroupedEvent | AssistantSingleEvent

type ClickedFeatureBase = { category?: string; layerId?: string }

export type AssistantClickedCluster = ClickedFeatureBase & {
  eventType?: string
  eventsInCluster?: number
  event?: AssistantEventSummary
}

export type AssistantClickedEvent = ClickedFeatureBase & { event: AssistantEventSummary }

export type AssistantClickedCell = ClickedFeatureBase & {
  cellCenter: AssistantLonLat
  startTime?: string
  endTime?: string
  interval?: string
  sublayers: (AssistantSublayerInfo & {
    value?: number
    totalVessels?: number
    vessels?: (AssistantVesselRef & { hours?: number; detections?: number; events?: number })[]
  })[]
}

export type AssistantClickedPosition = ClickedFeatureBase & {
  vessel: { id?: string; name?: string }
  value?: number
}

/** A point of a vessel or user track */
export type AssistantClickedTrackPoint = ClickedFeatureBase & {
  trackPoint: {
    name?: string
    vesselId?: string
    timestamp?: string
    speedKnots?: number
    /** Negative: below sea level */
    depthM?: number
    courseDeg?: number
  }
}

/** Currents / winds cell */
export type AssistantClickedVector = ClickedFeatureBase & {
  cellCenter?: AssistantLonLat
  speed?: number
  /** Degrees the flow goes towards */
  directionDeg?: number
  unit?: string
}

export type AssistantClickedArea = ClickedFeatureBase & {
  id?: string | number
  label?: string
  /** Bathymetry contour */
  elevationM?: number
}

export type AssistantClickedFeatureSummary =
  | AssistantClickedCluster
  | AssistantClickedEvent
  | AssistantClickedCell
  | AssistantClickedTrackPoint
  | AssistantClickedVector
  | AssistantClickedPosition
  | AssistantClickedArea

/** null when nothing is clicked */
export type AssistantClickedFeature = {
  longitude: number
  latitude: number
  features: AssistantClickedFeatureSummary[]
} | null

/** Summary of a series: `series` when short, else `monthly` */
export type AssistantSeriesSummary = {
  points: number
  total: number
  mean?: number
  max?: AssistantDatedValue
  min?: AssistantDatedValue
  /** [date, value] */
  series?: [string, number][]
  monthly?: { month: string; total: number; mean: number }[]
}

export type AssistantTimebarTrack = {
  dataviewId: string
  name?: string
  loaded?: false
  /** Whole loaded track, any date */
  trackStart?: string
  trackEnd?: string
  /** Of the rows below: 'day' or 'month' */
  interval: string
  /** [date, mean, max] in knots */
  speedKnots?: [string, number, number][]
  /** [date, mean, deepest] in meters, negative below sea level */
  depthM?: [string, number, number][]
}

export type AssistantTimebar = {
  /** heatmap, heatmapDetections, vesselGroup, environment, events, points or vessel */
  visualisation: string
  timeRange: AssistantTimeRange
  interval?: string
  loading?: true
  /** Value on screen per interval, one entry per sublayer of the graph */
  layers?: (AssistantSeriesSummary & { id: string; unit?: string })[]
  /** vessel visualisation: the graph open under the tracks (speed, elevation or none) */
  trackGraph?: string
  tracks?: AssistantTimebarTrack[]
}

export type AssistantWorkspacesList = {
  category?: string
  status: string
  workspaces?: { id: string; name: string; description?: string; category?: string }[]
}
