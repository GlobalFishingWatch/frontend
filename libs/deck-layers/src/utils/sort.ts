/**
 * Defines groups for layer order.
 */
export enum LayerGroup {
  Background = 'background', // Solid bg color
  Basemap = 'basemap', // Satellite tiles
  Bathymetry = 'bathymetry', // 4Wings Bathymetry layer
  HeatmapStatic = 'heatmapStatic', // Fill/gradient-based heatmaps
  Heatmap = 'heatmap', // Fill/gradient-based temporal heatmaps
  HeatmapFootprint = 'heatmapFootprint', // Fill/gradient-based temporal heatmaps
  OutlinePolygons = 'outlinePolygons', // Context layers with an outlined/hollow style such as RFMOs, MPAs, etc
  OutlinePolygonsFill = 'outlinePolygonsFill', // User context layers with a filled styles, below OutlinePolygons
  BasemapFill = 'basemapFill', // Landmass
  OutlinePolygonsBackground = 'outlinePolygonsBackground', // Polygons  that need to be rendered below landmass
  OutlinePolygonsHighlighted = 'outlinePolygonsHighlighted', // Context layers with selected features
  CustomLayer = 'customLayer', // Context custom user layers
  Default = 'default', // Default stack position when group is not specified
  Track = 'track', // Tracks
  Point = 'point', // Events, etc
  TrackHighlightedEvent = 'trackHighlightedEvent', // Fixed highlight section normally used for a event duration
  TrackHighlighted = 'trackHighlighted', // Highlighted sections of tracks
  BasemapForeground = 'basemapForeground', // Graticule labels, bathymetry labels, etc
  Cluster = 'cluster', // Cluster circles
  Tool = 'tool', // Tools such as rulers, etc
  Label = 'label', // All non-basemap layers labels
  Overlay = 'overlay', // Popups, ruler tool, etc
}

export const LAYER_GROUP_ORDER = [
  LayerGroup.Background,
  LayerGroup.Basemap,
  LayerGroup.OutlinePolygonsBackground,
  LayerGroup.Bathymetry,
  LayerGroup.HeatmapStatic,
  LayerGroup.Heatmap,
  LayerGroup.HeatmapFootprint,
  LayerGroup.OutlinePolygonsFill,
  LayerGroup.OutlinePolygons,
  LayerGroup.BasemapFill,
  LayerGroup.Default,
  LayerGroup.Track,
  LayerGroup.TrackHighlightedEvent,
  LayerGroup.TrackHighlighted,
  LayerGroup.Point,
  LayerGroup.BasemapForeground,
  LayerGroup.CustomLayer,
  LayerGroup.OutlinePolygonsHighlighted,
  LayerGroup.Label,
  LayerGroup.Cluster,
  LayerGroup.Tool,
  LayerGroup.Overlay,
]

export function getLayerGroupOffset(
  group: LayerGroup,
  { layerIndex = 1 } = {} as { layerIndex: number }
): [number, number] {
  return [0, -(LAYER_GROUP_ORDER.indexOf(group) * 100 + layerIndex)]
}
