import { EventTypes } from '@globalfishingwatch/api-types'

export enum DataviewConfigType {
  Annotation = 'ANNOTATION',
  Background = 'BACKGROUND',
  Basemap = 'BASEMAP',
  BasemapLabels = 'BASEMAP_LABELS',
  CartoPolygons = 'CARTO_POLYGONS',
  Context = 'CONTEXT',
  GL = 'GL',
  Heatmap = 'HEATMAP',
  HeatmapStatic = 'HEATMAP_STATIC',
  HeatmapAnimated = 'HEATMAP_ANIMATED',
  Polygons = 'POLYGONS',
  Rulers = 'RULERS',
  TileCluster = 'TILE_CLUSTER',
  Track = 'TRACK',
  UserContext = 'USER_CONTEXT',
  UserPoints = 'USER_POINTS',
  VesselEvents = 'VESSEL_EVENTS',
  VesselEventsShapes = 'VESSEL_EVENTS_SHAPES',
}

export type GlobalConfig = {
  start?: string
  end?: string
  // hoveredFeatures: PickingInfo[]
  // clickedFeatures: PickingInfo[]
  // highlightedTime?: { start: string; end: string }
  // visibleEvents?: EventTypes[]
}
