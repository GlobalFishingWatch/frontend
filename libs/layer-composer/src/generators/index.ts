import { GeneratorType } from './types'
import BackgroundGenerator from './background/background'
import BaseMapGenerator from './basemap/basemap'
import GLStyleGenerator from './gl/gl'
import CartoGenerator, { CARTO_FISHING_MAP_API } from './carto-polygons/carto-polygons'
import HeatmapAnimatedGenerator from './heatmap/heatmap-animated'
import HeatmapGenerator from './heatmap/heatmap'
import ContextGenerator from './context/context'
import UserContextGenerator from './user-context/user-context'
import UserPointsGenerator from './user-points/user-points'
import TrackGenerator from './track/track'
import VesselEventsGenerator from './vessel-events/vessel-events'
import RulersGenerator from './rulers/rulers'
import TileClusterGenerator from './tile-cluster/tile-cluster'
import VesselsEventsShapesGenerator from './vessel-events/vessel-events-shapes'

export * from './heatmap/types'
export * from './heatmap/util'
export { HEATMAP_COLOR_RAMPS } from './heatmap/colors'
export { DEFAULT_BACKGROUND_COLOR } from './background/config'
export { DEFAULT_CONTEXT_SOURCE_LAYER } from './context/config'
export { COLOR_RAMP_DEFAULT_NUM_STEPS } from './heatmap/config'
export {
  DEFAULT_HEATMAP_INTERVALS,
  TEMPORALGRID_SOURCE_LAYER,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from './heatmap/config'

const GeneratorConfig = {
  [GeneratorType.Background]: new BackgroundGenerator(),
  [GeneratorType.Basemap]: new BaseMapGenerator(),
  [GeneratorType.GL]: new GLStyleGenerator(),
  [GeneratorType.CartoPolygons]: new CartoGenerator({ baseUrl: CARTO_FISHING_MAP_API }),
  [GeneratorType.Context]: new ContextGenerator(),
  [GeneratorType.TileCluster]: new TileClusterGenerator(),
  [GeneratorType.UserContext]: new UserContextGenerator(),
  [GeneratorType.UserPoints]: new UserPointsGenerator(),
  [GeneratorType.HeatmapAnimated]: new HeatmapAnimatedGenerator(),
  [GeneratorType.Heatmap]: new HeatmapGenerator(),
  [GeneratorType.Track]: new TrackGenerator(),
  [GeneratorType.VesselEvents]: new VesselEventsGenerator(),
  [GeneratorType.VesselEventsShapes]: new VesselsEventsShapesGenerator(),
  [GeneratorType.Rulers]: new RulersGenerator(),
}

export default GeneratorConfig
