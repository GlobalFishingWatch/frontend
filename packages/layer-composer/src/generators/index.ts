import { Type } from './types'
import BackgroundGenerator, { DEFAULT_BASEMAP_COLOR } from './background/background'
import BaseMapGenerator from './basemap/basemap'
import GLStyleGenerator from './gl/gl'
import CartoGenerator, { CARTO_FISHING_MAP_API } from './carto-polygons/carto-polygons'
import HeatmapAnimatedGenerator from './heatmap/heatmap-animated'
import HeatmapGenerator from './heatmap/heatmap'
import UserContextGenerator from './user-context/user-context'
import TrackGenerator from './track/track'
import VesselEventsGenerator from './vessel-events/vessel-events'
import RulersGenerator from './rulers/rulers'

export { DEFAULT_BASEMAP_COLOR }
export { HEATMAP_GEOM_TYPES, HEATMAP_COLOR_RAMPS } from './heatmap/config'

export default {
  [Type.Background]: new BackgroundGenerator(),
  [Type.Basemap]: new BaseMapGenerator(),
  [Type.GL]: new GLStyleGenerator(),
  [Type.CartoPolygons]: new CartoGenerator({ baseUrl: CARTO_FISHING_MAP_API }),
  [Type.UserContext]: new UserContextGenerator(),
  [Type.HeatmapAnimated]: new HeatmapAnimatedGenerator(),
  [Type.Heatmap]: new HeatmapGenerator(),
  [Type.Track]: new TrackGenerator(),
  [Type.VesselEvents]: new VesselEventsGenerator(),
  [Type.Rulers]: new RulersGenerator(),
}
