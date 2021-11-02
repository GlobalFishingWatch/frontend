import { GeneratorType } from './types'
import BackgroundGenerator, { DEFAULT_BACKGROUND_COLOR } from './background/background'
import BaseMapGenerator from './basemap/basemap'
import GLStyleGenerator from './gl/gl'
import CartoGenerator, { CARTO_FISHING_MAP_API } from './carto-polygons/carto-polygons'
import HeatmapAnimatedGenerator from './heatmap/heatmap-animated'
import HeatmapGenerator from './heatmap/heatmap'
import ContextGenerator, { DEFAULT_CONTEXT_SOURCE_LAYER } from './context/context'
import UserContextGenerator from './user-context/user-context'
import TrackGenerator from './track/track'
import VesselEventsGenerator from './vessel-events/vessel-events'
import RulersGenerator from './rulers/rulers'
import TileClusterGenerator from './tile-cluster/tile-cluster'

export * from './heatmap/types'
export { HEATMAP_COLOR_RAMPS } from './heatmap/colors'
export { COLOR_RAMP_DEFAULT_NUM_STEPS } from './heatmap/config'
export { DEFAULT_HEATMAP_INTERVALS } from './heatmap/config'
export { CONFIG_BY_INTERVAL } from './heatmap/util/time-chunks'
export {
  TEMPORALGRID_SOURCE_LAYER,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from './heatmap/heatmap-animated'
export { DEFAULT_BACKGROUND_COLOR, DEFAULT_CONTEXT_SOURCE_LAYER }

const GeneratorConfig = {
  [GeneratorType.Background]: new BackgroundGenerator(),
  [GeneratorType.Basemap]: new BaseMapGenerator(),
  [GeneratorType.GL]: new GLStyleGenerator(),
  [GeneratorType.CartoPolygons]: new CartoGenerator({ baseUrl: CARTO_FISHING_MAP_API }),
  [GeneratorType.Context]: new ContextGenerator(),
  [GeneratorType.TileCluster]: new TileClusterGenerator(),
  [GeneratorType.UserContext]: new UserContextGenerator(),
  [GeneratorType.HeatmapAnimated]: new HeatmapAnimatedGenerator(),
  [GeneratorType.Heatmap]: new HeatmapGenerator(),
  [GeneratorType.Track]: new TrackGenerator(),
  [GeneratorType.VesselEvents]: new VesselEventsGenerator(),
  [GeneratorType.Rulers]: new RulersGenerator(),
}

export default GeneratorConfig
