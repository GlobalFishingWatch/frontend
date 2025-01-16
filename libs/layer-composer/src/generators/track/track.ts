import { scaleLinear, scalePow } from 'd3-scale'
import type { FeatureCollection, LineString } from 'geojson'
import { uniq } from 'lodash'
import memoizeOne from 'memoize-one'

import type {
  TrackCoordinatesPropertyFilter} from '@globalfishingwatch/data-transforms';
import {
  filterByTimerangeMemoizeEqualityCheck,
  filterTrackByCoordinateProperties,
  segmentsToGeoJSON} from '@globalfishingwatch/data-transforms'
import type { FilterSpecification, LineLayerSpecification } from '@globalfishingwatch/maplibre-gl'

import { Group } from '../../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { HIGHLIGHT_LINE_COLOR, LINE_COLOR_BAR_OPTIONS } from '../context/context.utils'
import type { MergedGeneratorConfig,TrackGeneratorConfig } from '../types';
import { GeneratorType } from '../types'
import { isConfigVisible, isNumeric } from '../utils'

import { simplifyTrack } from './simplify-track'

export const TRACK_HIGHLIGHT_SUFFIX = '_highlighted'

const mapZoomToMinPosΔ = (zoomLoadLevel: number) => {
  // first normalize and invert z level
  const normalizedZoom = scaleLinear().clamp(true).range([1, 0]).domain([3, 12])(zoomLoadLevel)

  const MIN_POS_Δ_LOW_ZOOM = 0.1
  const MIN_POS_Δ_HIGH_ZOOM = 0.0005
  const DETAIL_INCREASE_RATE = 1.5 // Higher = min delta lower at intermediate zoom levels = more detail at intermediate zoom levels

  const minPosΔ = scalePow()
    .clamp(true)
    .exponent(DETAIL_INCREASE_RATE)
    .range([MIN_POS_Δ_HIGH_ZOOM, MIN_POS_Δ_LOW_ZOOM])
    .domain([0, 1])(normalizedZoom)

  return minPosΔ
}

const simplifyTrackWithZoomLevel = (
  data: FeatureCollection,
  zoomLoadLevel: number
): FeatureCollection => {
  const s = mapZoomToMinPosΔ(zoomLoadLevel)
  const simplifiedData = simplifyTrack(data as FeatureCollection<LineString>, s)
  return simplifiedData
}

const getTimeFilter = (start?: string, end?: string): TrackCoordinatesPropertyFilter[] => {
  if (!start || !end) {
    return []
  }
  return [
    {
      id: 'times',
      min: new Date(start).getTime(),
      max: new Date(end).getTime(),
    },
  ]
}

const getHighlightedLayer = (
  id: string,
  { group = Group.TrackHighlighted, paint = {} } = {}
): LineLayerSpecification => {
  return {
    id,
    type: 'line',
    source: id,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': 'white',
      'line-width': 1.5,
      'line-opacity': 1,
      ...paint,
    },
    metadata: { group },
  }
}

const DEFAULT_TRACK_COLOR = 'rgba(0, 193, 231, 1)'

export type GlobalTrackGeneratorConfig = MergedGeneratorConfig<TrackGeneratorConfig>

class TrackGenerator {
  type = GeneratorType.Track
  highlightSufix = TRACK_HIGHLIGHT_SUFFIX
  highlightEventSufix = `${TRACK_HIGHLIGHT_SUFFIX}_event`

  _getStyleSources = (config: GlobalTrackGeneratorConfig) => {
    const defaultGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    const source: Record<string, any> = {
      id: config.id,
      type: 'geojson',
      data: defaultGeoJSON,
      promoteId: config.promoteId || 'id',
    }
    const sources = [source]

    if (config.data) {
      if ((config.data as FeatureCollection).type) {
        source.data = config.data as FeatureCollection
      } else {
        source.data = memoizeCache[config.id].convertToGeoJSON(config.data)
      }
    }

    if (config.zoomLoadLevel && config.simplify) {
      source.data = memoizeCache[config.id].simplifyTrackWithZoomLevel(
        source.data,
        config.zoomLoadLevel
      )
    }

    const uniqIds: string[] = uniq(
      source.data.features
        .filter((f: any) => f.properties?.id !== undefined)
        .map((f: any) => f.properties?.id)
    )

    const coordinateFilters: TrackCoordinatesPropertyFilter[] = Object.entries(
      config.coordinateFilters || {}
    ).map(([id, values]) => {
      if (isNumeric(values[0]) && isNumeric(values[1])) {
        return {
          id,
          min: parseFloat(values[0] as string),
          max: parseFloat(values[1] as string),
        }
      }
      return { id, values }
    })

    source.data = memoizeCache[config.id].filterTrackByCoordinateProperties(source.data, {
      filters: [...getTimeFilter(config.start, config.end), ...coordinateFilters],
      includeNonTemporalFeatures: true,
    })

    // if (config.highlightedEvent) {
    //   const highlightedData = memoizeCache[config.id].getHighlightedEventData(
    //     source.data,
    //     config.highlightedEvent.start,
    //     config.highlightedEvent.end
    //   )
    //   const highlightedSource = {
    //     id: `${config.id}${this.highlightEventSufix}`,
    //     type: 'geojson',
    //     data: highlightedData,
    //   }
    //   sources.push(highlightedSource)
    // }

    if (config.highlightedTime) {
      const highlightedData = memoizeCache[config.id].filterTrackByCoordinatePropertiesHighlight(
        // using source.data here to avoid filtering the entire track again
        // this makes everything much faster but also harder because the filterTrackByCoordinateProperties
        // needs support to filter LineStrings and also
        source.data,
        {
          filters: [
            ...getTimeFilter(config.highlightedTime.start, config.highlightedTime.end),
            ...coordinateFilters,
          ],
        }
      )
      const highlightedSource = {
        id: `${config.id}${this.highlightSufix}`,
        type: 'geojson',
        data: highlightedData,
      }
      sources.push(highlightedSource)
    }

    return { sources, uniqIds }
  }

  _getStyleLayers = (
    config: GlobalTrackGeneratorConfig,
    uniqIds: string[]
  ): LineLayerSpecification[] => {
    const paint = {
      'line-color': config.color || DEFAULT_TRACK_COLOR,
      'line-width': 1.5,
      'line-opacity': 1,
    }
    let filters: any[] = []
    if (config?.filters && Object.keys(config?.filters).length > 0) {
      filters = ['all']
      Object.entries(config.filters).forEach(([key, values]) => {
        // TODO: fix this as the edge case of having a filter of two numeric ids will fail
        if (values.length === 2 && values.some(isNumeric)) {
          filters.push(['<=', ['to-number', ['get', key]], parseFloat(values[1] as string)])
          filters.push(['>=', ['to-number', ['get', key]], parseFloat(values[0] as string)])
        } else {
          filters.push(['match', ['get', key], values, true, false])
        }
      })
    }

    if (uniqIds.length > 1 && config.useOwnColor) {
      const getUniqColorsExpression = (uniqIds: string[]) => {
        const idsAndColors: string[] = []
        uniqIds.forEach((id: string, index: number) => {
          idsAndColors.push(id || '')
          idsAndColors.push(LINE_COLOR_BAR_OPTIONS[index % LINE_COLOR_BAR_OPTIONS.length].value)
        })
        return ['match', ['get', 'id'], ...idsAndColors, config.color]
      }
      paint['line-color'] = [
        'case',
        ['boolean', ['feature-state', 'highlight'], false],
        HIGHLIGHT_LINE_COLOR,
        getUniqColorsExpression(uniqIds),
      ] as any
    }
    const visibility = isConfigVisible(config)
    const layer: LineLayerSpecification = {
      id: config.id,
      source: config.id,
      type: 'line',
      layout: { visibility },
      ...(filters.length > 0 && { filter: filters as FilterSpecification }),
      paint,
      metadata: {
        group: config.id.includes('user-track') ? Group.TrackHighlighted : Group.Track,
      },
    }
    const layers = [layer]

    // if (visibility && config.highlightedEvent) {
    //   const id = `${config.id}${this.highlightEventSufix}`
    //   const paint = {
    //     'line-color': config.color || DEFAULT_TRACK_COLOR,
    //     'line-width': 5,
    //   }
    //   const highlightedEventLayer = getHighlightedLayer(id, {
    //     paint,
    //     group: Group.TrackHighlightedEvent,
    //   })
    //   layers.push(highlightedEventLayer)
    // }

    if (visibility && config.highlightedTime) {
      const id = `${config.id}${this.highlightSufix}`
      const highlightedLayer = getHighlightedLayer(id)
      layers.push({
        ...highlightedLayer,
        ...(filters.length > 0 && { filter: filters as FilterSpecification }),
      })
    }

    return layers
  }

  getStyle = (config: GlobalTrackGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      convertToGeoJSON: memoizeOne(segmentsToGeoJSON),
      simplifyTrackWithZoomLevel: memoizeOne(simplifyTrackWithZoomLevel),
      filterTrackByCoordinateProperties: memoizeOne(
        filterTrackByCoordinateProperties,
        filterByTimerangeMemoizeEqualityCheck
      ),
      filterTrackByCoordinatePropertiesHighlight: memoizeOne(
        filterTrackByCoordinateProperties,
        filterByTimerangeMemoizeEqualityCheck
      ),
    })

    const { sources, uniqIds } = this._getStyleSources(config)
    return {
      id: config.id,
      sources,
      layers: this._getStyleLayers(config, uniqIds),
    }
  }
}

export default TrackGenerator
