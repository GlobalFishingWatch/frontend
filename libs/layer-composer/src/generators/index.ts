import { GeneratorType } from './types'
import BackgroundGenerator from './background/background'
import BaseMapGenerator from './basemap/basemap'
import BasemapLabelsGenerator from './basemap-labels/basemap-labels'
import CartoGenerator, { CARTO_FISHING_MAP_API } from './carto-polygons/carto-polygons'
import ContextGenerator from './context/context'
import GLStyleGenerator from './gl/gl'
import HeatmapAnimatedGenerator from './heatmap/heatmap-animated'
import HeatmapGenerator from './heatmap/heatmap'
import PolygonsGenerator from './polygons/polygons'
import RulersGenerator from './rulers/rulers'
import TileClusterGenerator from './tile-cluster/tile-cluster'
import TrackGenerator from './track/track'
import UserContextGenerator from './user-context/user-context'
import UserPointsGenerator from './user-points/user-points'
import VesselEventsGenerator from './vessel-events/vessel-events'
import VesselsEventsShapesGenerator from './vessel-events/vessel-events-shapes'

export * from './heatmap/types'
export * from './heatmap/util'
export * from './heatmap/util/get-time-chunks-interval'
export * from './vessel-events/vessel-events.utils'
export { TRACK_HIGHLIGHT_SUFFIX } from './track/track'
export { HEATMAP_COLOR_RAMPS } from './heatmap/colors'
export { rgbaStringToComponents } from './heatmap/util/colors'
export { DEFAULT_BACKGROUND_COLOR } from './background/config'
export { DEFAULT_CONTEXT_SOURCE_LAYER } from './context/config'
export { DEFAULT_POINTS_SOURCE_LAYER, MAX_ZOOM_TO_CLUSTER_POINTS } from './tile-cluster/config'
export {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  DEFAULT_HEATMAP_INTERVALS,
  DEFAULT_ENVIRONMENT_INTERVALS,
  TEMPORALGRID_SOURCE_LAYER,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
  TEMPORALGRID_LAYER_INTERACTIVE_SUFIX,
} from './heatmap/config'

const GeneratorConfig = {
  [GeneratorType.Background]: new BackgroundGenerator(),
  [GeneratorType.Basemap]: new BaseMapGenerator(),
  [GeneratorType.BasemapLabels]: new BasemapLabelsGenerator(),
  [GeneratorType.CartoPolygons]: new CartoGenerator({ baseUrl: CARTO_FISHING_MAP_API }),
  [GeneratorType.Context]: new ContextGenerator(),
  [GeneratorType.GL]: new GLStyleGenerator(),
  [GeneratorType.Heatmap]: new HeatmapGenerator(),
  [GeneratorType.HeatmapAnimated]: new HeatmapAnimatedGenerator(),
  [GeneratorType.Polygons]: new PolygonsGenerator(),
  [GeneratorType.Rulers]: new RulersGenerator(),
  [GeneratorType.TileCluster]: new TileClusterGenerator(),
  [GeneratorType.Track]: new TrackGenerator(),
  [GeneratorType.UserContext]: new UserContextGenerator(),
  [GeneratorType.UserPoints]: new UserPointsGenerator(),
  [GeneratorType.VesselEvents]: new VesselEventsGenerator(),
  [GeneratorType.VesselEventsShapes]: new VesselsEventsShapesGenerator(),
}

export default GeneratorConfig
