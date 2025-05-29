/**
 * Defines groups for layer order.
 */
export enum LayerGroup {
  Background = 'background', // Solid bg color
  Basemap = 'basemap', // Satellite tiles
  OutlinePolygonsBackground = 'outlinePolygonsBackground', // Polygons  that need to be rendered below landmass
  Bathymetry = 'bathymetry', // 4Wings Bathymetry layer
  HeatmapStatic = 'heatmapStatic', // Fill/gradient-based heatmaps
  Heatmap = 'heatmap', // Fill/gradient-based temporal heatmaps
  HeatmapFootprint = 'heatmapFootprint', // Fill/gradient-based temporal heatmaps
  OutlinePolygons = 'outlinePolygons', // Context layers with an outlined/hollow style such as RFMOs, MPAs, etc
  BasemapFill = 'basemapFill', // Landmass
  Default = 'default', // Default stack position when group is not specified
  CustomLayer = 'customLayer', // Context custom user layers
  Track = 'track', // Tracks
  Point = 'point', // Events, etc
  OutlinePolygonsHighlighted = 'outlinePolygonsHighlighted', // Context layers with selected features
  Label = 'label', // All non-basemap layers labels
  Cluster = 'cluster', // Cluster circles
  Tool = 'tool', // Tools such as rulers, etc
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
  LayerGroup.OutlinePolygons,
  LayerGroup.BasemapFill,
  LayerGroup.Default,
  LayerGroup.CustomLayer,
  LayerGroup.Track,
  LayerGroup.Point,
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
  return [0, -(LAYER_GROUP_ORDER.indexOf(group) * 100)]
}
