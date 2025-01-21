import type { FeatureCollection } from 'geojson'
import memoizeOne from 'memoize-one'

import { filterTrackByCoordinateProperties } from '@globalfishingwatch/data-transforms'

import { Group } from '../../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import type { MergedGeneratorConfig } from '../types'
import { GeneratorType } from '../types'

export interface VesselPositionsGeneratorConfig {
  id: string
  data: FeatureCollection
  colorMode?: 'all' | 'content' | 'labels'
  highlightedTime?: {
    start: string
    end: string
  }
  hiddenLabels?: string[]
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

    memoizeByLayerId(id, {
      filterPositions: memoizeOne(filterTrackByCoordinateProperties),
    })

    const sources = [
      {
        id: `${id}`,
        type: 'geojson',
        data,
      },
    ]

    if (config.highlightedTime) {
      const highlightedData = memoizeCache[id].filterPositions(data, {
        filters: [
          {
            id: 'timestamp',
            min: new Date(config.highlightedTime.start).getTime(),
            max: new Date(config.highlightedTime.end).getTime(),
          },
        ],
      })
      sources.push({
        id: `${id}_highlighted`,
        type: 'geojson',
        data: highlightedData,
      })
    }

    return sources
  }

  _getStyleLayers = (config: GlobalVesselPositionsGeneratorConfig) => {
    if (!config.data) {
      return []
    }

    const { id, colorMode, ruleColors = [], hiddenLabels } = config
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

    const isHighlighted = config.highlightedTime
      ? [
          'all',
          [
            '>=',
            ['get', 'timestamp'],
            ['to-number', new Date(config.highlightedTime.start).getTime()],
          ],
          [
            '<=',
            ['get', 'timestamp'],
            ['to-number', new Date(config.highlightedTime.end).getTime()],
          ],
        ]
      : ['==', 1, 0] // Always false when no highlight time

    const layers = [
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
          'icon-color': [
            'case',
            isHighlighted,
            'white',
            onlyLabels ? ['case', ...ruleColors, 'black'] : fillColor,
          ],
          'icon-halo-color': [
            'case',
            isHighlighted,
            'white',
            outlineVisible ? ['case', ...ruleColors, 'black'] : fillColor,
          ],
          'icon-halo-width': 2,
          'icon-opacity': [
            'case',
            ['in', ['get', 'action'], ['literal', hiddenLabels || []]],
            0,
            1,
          ],
        },
        metadata: {
          group: Group.Track,
          generatorId: id,
        },
      } as any,
    ]

    return layers
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
