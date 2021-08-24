import {
  AggregationOperation,
  GeomType,
  SublayerCombinationMode,
  TileAggregationSourceParams,
} from '@globalfishingwatch/fourwings-aggregate'
import { HeatmapAnimatedCurrentsPOCGeneratorConfig, Type } from '../types'
import {
  getSubLayersDatasets,
  getSubLayersVisible,
  getTilesUrl,
  serializeBaseSourceParams,
} from './util'
import getBaseLayers from './util/get-base-layer'

const FRAME = 18628

class HeatmapAnimatedCurrentsPOCGenerator {
  type = Type.HeatmapAnimatedCurrentsPOC
  _getStyleSources = (config: HeatmapAnimatedCurrentsPOCGeneratorConfig) => {
    const datasets = getSubLayersDatasets(config.sublayers)
    const filters = config.sublayers.map(() => '')
    const visible = getSubLayersVisible(config.sublayers)
    const tilesUrl = getTilesUrl(config)

    const baseSourceParams: TileAggregationSourceParams = {
      id: config.id,
      singleFrame: false,
      geomType: GeomType.point,
      // Set a minimum of 1 to avoid empty frames. See error thrown in getStyle() for edge case
      delta: 1,
      quantizeOffset: FRAME,
      interval: '10days',
      filters,
      datasets,
      aggregationOperation: AggregationOperation.Avg,
      sublayerCombinationMode: SublayerCombinationMode.Currents__POC,
      sublayerVisibility: visible,
      sublayerCount: config.sublayers.length,
      // sublayerBreaks: breaks.map((sublayerBreaks) =>
      //   sublayerBreaks.map((b) => b * config.breaksMultiplier)
      // ),
      interactive: config.interactive || false,
    }

    const serializedBaseSourceParams = serializeBaseSourceParams(baseSourceParams)

    const sourceParams = [serializedBaseSourceParams]

    return sourceParams.map((params: Record<string, string>) => {
      const url = new URL(`${tilesUrl}?${new URLSearchParams(params)}`)
      const urlString = decodeURI(url.toString())
      const source = {
        id: params.id,
        type: 'temporalgrid',
        tiles: [urlString],
        maxzoom: config.maxZoom,
      }
      return source
    })
  }
  _getStyleLayers = (config: HeatmapAnimatedCurrentsPOCGeneratorConfig) => {
    // const pickValueAt = timeChunk.frame.toString()
    const pickValueAt = FRAME.toString()
    // const exprPick = ['coalesce', ['get', pickValueAt], 0]
    const baseSlice = ['slice', ['get', pickValueAt]]
    const baseLayer = getBaseLayers(config)
    baseLayer.id = config.id
    baseLayer.source = config.id
    baseLayer.paint = {
      'circle-color': 'red',
      'circle-radius': ['to-number', [...baseSlice, 0, 6]],
    }

    return [baseLayer]
  }
  getStyle = (config: HeatmapAnimatedCurrentsPOCGeneratorConfig) => {
    const finalConfig = { ...config }
    const style = {
      id: finalConfig.id,
      sources: this._getStyleSources(finalConfig),
      layers: this._getStyleLayers(finalConfig),
      // metadata: {
      //   breaks,
      //   legends,
      //   temporalgrid: true,
      //   numSublayers: finalConfig.sublayers.length,
      //   sublayers: finalConfig.sublayers,
      //   visibleSublayers: getSubLayersVisible(finalConfig.sublayers),
      //   timeChunks,
      //   aggregationOperation: finalConfig.aggregationOperation,
      //   multiplier: finalConfig.breaksMultiplier,
      // },
    }
    return style
  }
}

export default HeatmapAnimatedCurrentsPOCGenerator
