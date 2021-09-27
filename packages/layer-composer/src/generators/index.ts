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

export { COLOR_RAMP_DEFAULT_NUM_STEPS } from './heatmap/config'
export { HEATMAP_COLOR_RAMPS } from './heatmap/colors'
export { DEFAULT_HEATMAP_INTERVALS } from './heatmap/config'
export { CONFIG_BY_INTERVAL } from './heatmap/util/time-chunks'
export { Interval } from './heatmap/types'
export { TEMPORALGRID_SOURCE_LAYER } from './heatmap/modes/gridded'
export { DEFAULT_BACKGROUND_COLOR, DEFAULT_CONTEXT_SOURCE_LAYER, GeneratorType }

const GeneratorConfig = {
  [Type.Background]: new BackgroundGenerator(),
  [Type.Basemap]: new BaseMapGenerator(),
  [Type.GL]: new GLStyleGenerator(),
  [Type.CartoPolygons]: new CartoGenerator({ baseUrl: CARTO_FISHING_MAP_API }),
  [Type.Context]: new ContextGenerator(),
  [Type.TileCluster]: new TileClusterGenerator(),
  [Type.UserContext]: new UserContextGenerator(),
  [Type.HeatmapAnimated]: new HeatmapAnimatedGenerator(),
  [Type.Heatmap]: new HeatmapGenerator(),
  [Type.Track]: new TrackGenerator(),
  [Type.VesselEvents]: new VesselEventsGenerator(),
  [Type.Rulers]: new RulersGenerator(),
}

export default GeneratorConfig
