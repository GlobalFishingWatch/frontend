import { FeatureCollection } from 'geojson'
import { Group } from '../../types'
import { GeneratorType, MergedGeneratorConfig } from '../types'

export interface VesselPositionsGeneratorConfig {
  id: string
  data: FeatureCollection
  colorMode?: 'all' | 'content' | 'labels'
  highlightedTime?: number
  ruleColors?: any[]
  projectColors?: Record<string, string>
}

export type GlobalVesselPositionsGeneratorConfig =
  MergedGeneratorConfig<VesselPositionsGeneratorConfig>

class VesselPositionsGenerator {
  type = GeneratorType.VesselPositions

  _getStyleSources = (config: GlobalVesselPositionsGeneratorConfig) => {
    const { id, data } = config

    if (!data) {
      return []
    }

    return [
      {
        id: `${id}`,
        type: 'geojson',
        data,
      },
    ]
  }

  _getStyleLayers = (config: GlobalVesselPositionsGeneratorConfig) => {
    if (!config.data) {
      return []
    }

    const { id, colorMode, ruleColors = [], projectColors } = config
    const onlyContent = colorMode === 'content'
    const onlyLabels = colorMode === 'labels'
    const outlineVisible = colorMode === 'all' || onlyLabels

    const fillColor = [
      'interpolate',
      ['linear'],
      ['get', 'speed'],
      0,
      '#FF6B6B',
      6,
      '#CC4AA9',
      12,
      '#185AD0',
    ]

    return [
      {
        id: `${id}`,
        type: 'symbol',
        source: `${id}`,
        layout: {
          'icon-allow-overlap': true,
          'icon-image': 'arrow-inner',
          'icon-rotate': ['get', 'course'],
          'icon-offset': [1.5, 0],
          visibility: 'visible',
        },
        paint: {
          'icon-color': outlineVisible ? ['case', ...ruleColors, 'black'] : fillColor,
          'icon-halo-color': outlineVisible ? ['case', ...ruleColors, 'black'] : fillColor,
          'icon-halo-width': 2,
        },
        metadata: {
          group: Group.Track,
          generatorId: id,
        },
      } as any,
    ]
  }

  getStyle = (config: GlobalVesselPositionsGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default VesselPositionsGenerator
