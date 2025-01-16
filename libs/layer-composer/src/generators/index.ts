import { DataviewType } from '@globalfishingwatch/api-types'

import AnnotationsGenerator from './annotations/annotations'
import BackgroundGenerator from './background/background'
import BaseMapGenerator from './basemap/basemap'
import BasemapLabelsGenerator from './basemap-labels/basemap-labels'
import CartoGenerator, { CARTO_FISHING_MAP_API } from './carto-polygons/carto-polygons'
import ContextGenerator from './context/context'
import GLStyleGenerator from './gl/gl'
import HeatmapGenerator from './heatmap/heatmap'
import HeatmapAnimatedGenerator from './heatmap/heatmap-animated'
import HeatmapStaticGenerator from './heatmap/heatmap-static'
import PolygonsGenerator from './polygons/polygons'
import RulersGenerator from './rulers/rulers'
import TileClusterGenerator from './tile-cluster/tile-cluster'
import TrackGenerator from './track/track'
import UserContextGenerator from './user-context/user-context'
import UserPointsGenerator from './user-points/user-points'
import VesselEventsGenerator from './vessel-events/vessel-events'
import VesselsEventsShapesGenerator from './vessel-events/vessel-events-shapes'
import VesselPositionsGenerator from './vessel-positions/vessel-positions'

export * from './heatmap/types'
export * from './heatmap/util'
export * from './heatmap/util/get-time-chunks-interval'
export * from './vessel-events/vessel-events.utils'
export * from './user-points/user-points.utils'
export * from './rulers/rulers'
export { TRACK_HIGHLIGHT_SUFFIX } from './track/track'
export { HEATMAP_COLOR_RAMPS, HEATMAP_COLORS_BY_ID } from './heatmap/colors'
export { getHeatmapStaticSourceId, HEATMAP_STATIC_PROPERTY_ID } from './heatmap/heatmap-static'
export { rgbaStringToComponents, hexToComponents, rgbaToString } from './heatmap/util/colors'
export { DEFAULT_BACKGROUND_COLOR } from './background/config'
export { DEFAULT_CONTEXT_SOURCE_LAYER } from './context/config'
export { LINE_COLOR_BAR_OPTIONS, FILL_COLOR_BAR_OPTIONS } from './context/context.utils'
export { DEFAULT_POINTS_SOURCE_LAYER, MAX_ZOOM_TO_CLUSTER_POINTS } from './tile-cluster/config'
export {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  DEFAULT_HEATMAP_INTERVALS,
  DEFAULT_ENVIRONMENT_INTERVALS,
  TEMPORALGRID_SOURCE_LAYER,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
  TEMPORALGRID_LAYER_INTERACTIVE_SUFIX,
} from './heatmap/config'
export { MIN_POINT_SIZE, MAX_POINT_SIZE, POINT_SIZES_DEFAULT_RANGE } from './user-points/config'
export type AnyGeneratorClass =
  | AnnotationsGenerator
  | BackgroundGenerator
  | BaseMapGenerator
  | BasemapLabelsGenerator
  | CartoGenerator
  | ContextGenerator
  | GLStyleGenerator
  | HeatmapGenerator
  | HeatmapStaticGenerator
  | HeatmapAnimatedGenerator
  | PolygonsGenerator
  | RulersGenerator
  | TileClusterGenerator
  | TrackGenerator
  | UserContextGenerator
  | UserPointsGenerator
  | VesselEventsGenerator
  | VesselsEventsShapesGenerator
  | VesselPositionsGenerator

export type GeneratorsRecord = Record<any, AnyGeneratorClass>

const GeneratorConfig: GeneratorsRecord = {
  [DataviewType.Annotation]: new AnnotationsGenerator(),
  [DataviewType.Background]: new BackgroundGenerator(),
  [DataviewType.Basemap]: new BaseMapGenerator(),
  [DataviewType.BasemapLabels]: new BasemapLabelsGenerator(),
  [DataviewType.CartoPolygons]: new CartoGenerator({ baseUrl: CARTO_FISHING_MAP_API }),
  [DataviewType.Context]: new ContextGenerator(),
  [DataviewType.GL]: new GLStyleGenerator(),
  [DataviewType.Heatmap]: new HeatmapGenerator(),
  [DataviewType.HeatmapStatic]: new HeatmapStaticGenerator(),
  [DataviewType.HeatmapAnimated]: new HeatmapAnimatedGenerator(),
  [DataviewType.Polygons]: new PolygonsGenerator(),
  [DataviewType.Rulers]: new RulersGenerator(),
  [DataviewType.TileCluster]: new TileClusterGenerator(),
  [DataviewType.Track]: new TrackGenerator(),
  [DataviewType.UserContext]: new UserContextGenerator(),
  [DataviewType.UserPoints]: new UserPointsGenerator(),
  [DataviewType.VesselEvents]: new VesselEventsGenerator(),
  [DataviewType.VesselEventsShapes]: new VesselsEventsShapesGenerator(),
  [DataviewType.VesselPositions]: new VesselPositionsGenerator(),
}

export default GeneratorConfig
