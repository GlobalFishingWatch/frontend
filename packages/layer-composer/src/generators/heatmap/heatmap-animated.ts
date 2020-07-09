import { Type, HeatmapAnimatedGeneratorConfig, GlobalGeneratorConfig } from '../types'
import { Group } from '../../types'
import {
  API_TILES_URL,
  API_ENDPOINTS,
  HEATMAP_GEOM_TYPES,
  HEATMAP_DEFAULT_MAX_ZOOM,
  HEATMAP_GEOM_TYPES_GL_TYPES,
} from './config'
import { getServerSideFilters } from './utils'

type GlobalHeatmapAnimatedGeneratorConfig = HeatmapAnimatedGeneratorConfig & GlobalGeneratorConfig

class HeatmapAnimatedGenerator {
  type = Type.HeatmapAnimated
  fastTilesAPI: string

  constructor({ fastTilesAPI = API_TILES_URL }) {
    this.fastTilesAPI = fastTilesAPI
  }

  _getStyleSources = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    if (!config.start || !config.end || !config.tileset) {
      throw new Error(
        `Heatmap generator must specify start, end and tileset parameters in ${config}`
      )
    }

    const tilesUrl = `${this.fastTilesAPI}/${config.tileset}/${API_ENDPOINTS.tiles}`
    const url = new URL(tilesUrl)
    url.searchParams.set('geomType', config.geomType || HEATMAP_GEOM_TYPES.GRIDDED)
    url.searchParams.set('singleFrame', 'false')
    url.searchParams.set('serverSideFilters', getServerSideFilters(config.start, config.end))

    return [
      {
        id: config.id,
        type: 'temporalgrid',
        tiles: [decodeURI(url.toString())],
        maxzoom: config.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM,
      },
    ]
  }

  _getStyleLayers = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    return [
      {
        id: config.id,
        source: config.id,
        'source-layer': 'temporalgrid',
        type: HEATMAP_GEOM_TYPES_GL_TYPES[config.geomType || HEATMAP_GEOM_TYPES.GRIDDED],
        paint: {
          'fill-color': 'red',
        },
        metadata: {
          group: Group.Heatmap,
        },
      },
    ]
  }

  getStyle = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default HeatmapAnimatedGenerator
