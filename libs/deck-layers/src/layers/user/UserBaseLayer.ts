import type { DefaultProps, LayerContext, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { DataFilterExtensionProps } from '@deck.gl/extensions'
import { ClipExtension, DataFilterExtension } from '@deck.gl/extensions'
import type {
  _Tile2DHeader as Tile2DHeader,
  GeoBoundingBox,
  TileLayerProps,
} from '@deck.gl/geo-layers'
import type { GeoJsonProperties } from 'geojson'
import type { Entries } from 'type-fest'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { isFeatureInFilter, isFeatureInFilters } from '@globalfishingwatch/deck-loaders'

import type { DeckLayerProps } from '../../types'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import { DEFAULT_ID_PROPERTY } from '../../utils/layers'
import type { ContextFeature, ContextSubLayerConfig } from '../context'
import {
  getContextId,
  getValidSublayerFilters,
  hasSublayerFilters,
  mergePickedFeatures,
  supportDataFilterExtension,
} from '../context/context.utils'

import type {
  BaseUserLayerProps,
  FilterExtensionProps,
  UserLayerFeature,
  UserLayerPickingInfo,
  UserLayerPickingObject,
  UserPointsLayerProps,
  UserPolygonsLayerProps,
  UserTrackLayerProps,
} from './user.types'
import { getFilterExtensionSize } from './user.utils'

type _UserBaseLayerProps =
  | (TileLayerProps & UserPointsLayerProps)
  | UserTrackLayerProps
  | UserPointsLayerProps

const defaultProps: DefaultProps<_UserBaseLayerProps> = {
  pickable: true,
  maxRequests: 100,
  debounceTime: 500,
  minPointSize: 3,
  maxPointSize: 15,
}

// update this in Sat Nov 20 2286 as deck gl does not support Infinity
const INFINITY_TIMERANGE_LIMIT = 9999999999999

export type BoundsResponse = {
  bbox: Bbox
  minStartTime?: string
  maxEndTime?: string
}

export type UserBaseLayerState = {
  highlightedFeatures?: UserLayerPickingObject[]
}

type UserBaseLayerProps = DeckLayerProps<BaseUserLayerProps>

const emptyHighlightedFeatures = [] as UserLayerPickingObject[]
export abstract class UserBaseLayer<
  PropsT extends UserBaseLayerProps,
> extends CompositeLayer<PropsT> {
  static layerName = 'UserBaseLayer'
  static defaultProps = defaultProps
  declare state: UserBaseLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      highlightedFeatures: [],
    }
  }

  async getBbox(
    sublayerDataviewId: string,
    options?: { startDate?: number; endDate?: number }
  ): Promise<BoundsResponse | null> {
    const boundsUrl = this.props.layers?.find((l) => l.boundsUrl)?.boundsUrl

    if (!boundsUrl) {
      return null
    }

    const boundsFilter = this.props.layers?.flatMap((l) =>
      (l.sublayers || [])?.flatMap((sl) => (sl.dataviewId === sublayerDataviewId ? sl.filter : []))
    )?.[0]

    const { startTimeProperty, endTimeProperty, timeFilterType } = this.props
    const timeFilterParts: string[] = []
    if (options !== undefined) {
      if (timeFilterType === 'date') {
        if (startTimeProperty) {
          if (options.startDate !== undefined)
            timeFilterParts.push(`${startTimeProperty} >= ${options.startDate}`)
          if (options.endDate !== undefined)
            timeFilterParts.push(`${startTimeProperty} < ${options.endDate}`)
        }
      } else if (timeFilterType === 'dateRange') {
        if (startTimeProperty && endTimeProperty) {
          if (options.startDate !== undefined)
            timeFilterParts.push(`${endTimeProperty} >= ${options.startDate}`)
          if (options.endDate !== undefined)
            timeFilterParts.push(`${startTimeProperty} < ${options.endDate}`)
        } else if (endTimeProperty) {
          if (options.startDate !== undefined)
            timeFilterParts.push(`${endTimeProperty} >= ${options.startDate}`)
        } else if (startTimeProperty) {
          if (options.endDate !== undefined)
            timeFilterParts.push(`${startTimeProperty} < ${options.endDate}`)
        }
      }
    }
    const timeFilter = timeFilterParts.join(' AND ')
    const combinedFilter = [boundsFilter, timeFilter].filter(Boolean).join(' AND ')

    const urlWithFilters = combinedFilter
      ? `${boundsUrl}${boundsUrl.includes('?') ? '&' : '?'}filter=${encodeURIComponent(combinedFilter)}`
      : boundsUrl

    try {
      const data = await GFWAPI.fetch<BoundsResponse>(urlWithFilters)
      return data
    } catch (error) {
      this.setState({ error: (error as Error).message })
      return null
    }
  }

  _getHighlightedFeatures() {
    return this.state.highlightedFeatures || emptyHighlightedFeatures
  }

  setHighlightedFeatures(highlightedFeatures: ContextFeature[]) {
    if (!this.state) {
      return
    }
    this.setState({ highlightedFeatures })
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<
      UserLayerFeature,
      {
        tile?: Tile2DHeader
        sourceLayer?: any
        sourceTileSubLayer?: any
      }
    >
  }): UserLayerPickingInfo => {
    const layerId = info.sourceLayer.props.layerId
    const layer = this.props.layers.find((l) => l.id === layerId) || this.props.layers[0]
    const sublayerDataviewId = info.sourceTileSubLayer?.props.dataviewId
    const sublayer =
      layer?.sublayers.find((sublayer) => sublayer.dataviewId === sublayerDataviewId) ||
      (layer?.sublayers?.[0] as ContextSubLayerConfig)
    const idProperty = layer.idProperty || DEFAULT_ID_PROPERTY
    const valueProperties = layer.valueProperties || []

    const object = {
      ...(info.tile && {
        ...transformTileCoordsToWGS84(
          info.object as UserLayerFeature,
          info.tile.bbox as GeoBoundingBox,
          this.context.viewport
        ),
      }),
      id: getContextId(info.object as ContextFeature, idProperty),
      value: info.object?.properties.value,
      valueProperties,
      color: sublayer?.color,
      layerId: this.props.id,
      datasetId: layer.datasetId,
      dataviewId: sublayer?.dataviewId,
      category: this.props.category,
      subcategory: this.props.subcategory,
    } as UserLayerPickingObject

    if (sublayer && hasSublayerFilters(sublayer)) {
      if (
        !supportDataFilterExtension(sublayer, this._getTimeFilterProps()) &&
        !isFeatureInFilters(object, Object.keys(sublayer.filters || {}), sublayer?.filterOperators)
      ) {
        return { ...info, object: undefined }
      }
    }
    return { ...info, object }
  }

  _pickObjects(maxObjects: number | null): PickingInfo[] {
    const { deck, viewport } = this.context
    const width = viewport.width
    const height = viewport.height
    const x = viewport.x
    const y = viewport.y
    const layerIds = this.props.layers.map((l) => l.id)
    const features = deck!.pickObjects({ x, y, width, height, layerIds, maxObjects })
    return features
  }

  getRenderedFeatures(maxFeatures: number | null = null): UserLayerFeature[] {
    const idProperty = this.props.layers[0].idProperty || DEFAULT_ID_PROPERTY
    return mergePickedFeatures<UserLayerFeature>({
      pickedFeatures: this._pickObjects(maxFeatures),
      idProperty,
      layers: this.props.layers,
    })
  }

  _getTilesUrl(tilesUrl: string) {
    const { startTimeProperty, endTimeProperty, layers } = this.props
    const valueProperties = layers.flatMap((l) => l.valueProperties || [])
    const filters = layers.flatMap((l) => l.sublayers?.flatMap((s) => Object.keys(s.filters || {})))
    const aggregatedProperty = layers.flatMap((l) =>
      l.sublayers?.flatMap((s) => s.aggregateByProperty || [])
    )
    const stepsPickValue = (this.props as UserPolygonsLayerProps)?.stepsPickValue
    const circleRadiusProperty = (this.props as UserPointsLayerProps)?.circleRadiusProperty
    const tilesUrlObject = new URL(tilesUrl)
    // Needed for invalidate caches on user changes
    const properties = [
      ...(valueProperties || []),
      startTimeProperty || '',
      endTimeProperty || '',
      stepsPickValue || '',
      circleRadiusProperty || '',
      ...filters,
      ...aggregatedProperty,
    ].filter((p) => !!p)
    const uniqProperties = Array.from(new Set([...properties]))
    if (uniqProperties.length) {
      uniqProperties.forEach((property, index) => {
        tilesUrlObject.searchParams.set(`properties[${index}]`, property)
      })
    }
    // Decode the url is needed to keep the {x|y|z} format in the coordinates tiles
    return decodeURI(tilesUrlObject.toString())
  }

  _getTimeFilterProps(): FilterExtensionProps {
    const { startTime, endTime, startTimeProperty, endTimeProperty, timeFilterType } = this.props
    if (!timeFilterType || (!startTime && !endTime && !startTimeProperty && !endTimeProperty)) {
      return {} as ReturnType<typeof this._getTimeFilterProps>
    }
    // https://deck.gl/docs/api-reference/extensions/data-filter-extension#limitations
    // When using very large filter values, most commonly Epoch timestamps, 32-bit float representation could lead to an error margin of >1 minute.
    const offsetPrecision = 1000 * 60 * 30 // 30 minutes
    const startMatchRange = [0, endTime! - offsetPrecision] as [number, number]
    const endMatchRange = [startTime!, INFINITY_TIMERANGE_LIMIT] as [number, number]
    if (timeFilterType === 'date') {
      if (startTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) =>
            parseInt(d.properties[startTimeProperty as string]),
          filterRange: [startTime!, endTime! - offsetPrecision],
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      }
    } else if (timeFilterType === 'dateRange') {
      if (startTimeProperty && endTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) => {
            const start = d.properties[startTimeProperty as string]
            const end = d.properties[endTimeProperty as string]
            return [
              start ? parseInt(start) : -INFINITY_TIMERANGE_LIMIT,
              end ? parseInt(end) : INFINITY_TIMERANGE_LIMIT,
            ]
          },
          filterRange: [startMatchRange, endMatchRange],
          extensions: [new DataFilterExtension({ filterSize: 2 })],
        }
      } else if (endTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) =>
            parseInt(d.properties[endTimeProperty as string]),
          filterRange: endMatchRange,
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      } else if (startTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) =>
            parseInt(d.properties[startTimeProperty as string]),
          filterRange: startMatchRange,
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      }
    }
    return {} as ReturnType<typeof this._getTimeFilterProps>
  }

  _getSublayerFilterExtensionProps(sublayer: ContextSubLayerConfig): FilterExtensionProps {
    if (hasSublayerFilters(sublayer) && supportDataFilterExtension(sublayer)) {
      const filterEntries = Object.entries(getValidSublayerFilters(sublayer)) as Entries<
        typeof sublayer.filters
      >
      const hasMultipleFilters = filterEntries.length > 1

      return {
        extensions: [
          new DataFilterExtension({
            filterSize: filterEntries.length as DataFilterExtension['opts']['filterSize'],
          }),
        ],
        filterRange: hasMultipleFilters
          ? filterEntries.map(() => [1, 1] as [number, number])
          : ([1, 1] as [number, number]),
        getFilterValue: (d: UserLayerFeature) => {
          const filters = filterEntries.map(([id, values]) =>
            isFeatureInFilter(d, { id, values, operator: sublayer.filterOperators?.[id] }) ? 1 : 0
          )
          return hasMultipleFilters ? filters : filters[0]
        },
      }
    }
    return {} as ReturnType<typeof this._getSublayerFilterExtensionProps>
  }

  _combineFilterExtensionProps(
    timeFilterExtensionProps: ReturnType<typeof this._getTimeFilterProps>,
    filterExtensionProps: ReturnType<typeof this._getSublayerFilterExtensionProps>
  ): FilterExtensionProps {
    const hasFilters = Object.keys(filterExtensionProps).length > 0
    const hasTimeFilter = Object.keys(timeFilterExtensionProps).length > 0
    const timeFilterSize = getFilterExtensionSize(timeFilterExtensionProps)
    const sublayerFilterSize = getFilterExtensionSize(filterExtensionProps)

    const combinedFilterSize = Math.min(timeFilterSize + sublayerFilterSize, 4) as 1 | 2 | 3 | 4

    let combinedGetFilterValue: DataFilterExtensionProps['getFilterValue'] | undefined = undefined
    if (hasFilters || hasTimeFilter) {
      combinedGetFilterValue = (d: GeoJsonProperties) => {
        const timeFilterValue = hasTimeFilter
          ? (
              timeFilterExtensionProps.getFilterValue as (d: GeoJsonProperties) => number | number[]
            )(d)
          : null
        const sublayerFilterValue = hasFilters
          ? (filterExtensionProps.getFilterValue as (d: GeoJsonProperties) => number | number[])(d)
          : null

        const values: number[] = []
        if (hasTimeFilter) {
          if (Array.isArray(timeFilterValue)) {
            values.push(...timeFilterValue)
          } else if (timeFilterValue !== null && timeFilterValue !== undefined) {
            values.push(timeFilterValue)
          }
        }
        if (hasFilters) {
          if (Array.isArray(sublayerFilterValue)) {
            values.push(...sublayerFilterValue)
          } else if (sublayerFilterValue !== null && sublayerFilterValue !== undefined) {
            values.push(sublayerFilterValue)
          }
        }

        return combinedFilterSize === 1 ? values[0] : values
      }
    }

    let combinedFilterRange: DataFilterExtensionProps['filterRange'] = undefined
    if (hasFilters || hasTimeFilter) {
      const ranges: [number, number][] = []
      if (hasTimeFilter && timeFilterExtensionProps.filterRange) {
        const timeRange = timeFilterExtensionProps.filterRange
        if (Array.isArray(timeRange[0])) {
          ranges.push(...(timeRange as [number, number][]))
        } else {
          ranges.push(timeRange as [number, number])
        }
      }
      if (hasFilters && filterExtensionProps.filterRange) {
        const sublayerRange = filterExtensionProps.filterRange
        if (Array.isArray(sublayerRange[0])) {
          ranges.push(...(sublayerRange as [number, number][]))
        } else {
          ranges.push(sublayerRange as [number, number])
        }
      }
      combinedFilterRange = combinedFilterSize === 1 ? ranges[0] : ranges
    }

    const combinedExtensions = [
      ...(combinedFilterSize > 0
        ? [new DataFilterExtension({ filterSize: combinedFilterSize })]
        : []),
    ]

    return {
      extensions: combinedExtensions,
      filterRange: combinedFilterRange,
      getFilterValue: combinedGetFilterValue,
    }
  }

  _getExtensionFilterProps(
    sublayer: ContextSubLayerConfig,
    { clip = true } = {} as { clip?: boolean }
  ): {
    extensionFilterProps: FilterExtensionProps
    updateTrigger: { getFilterValue?: (number | string)[] }
  } {
    const timefilterProps = this._getTimeFilterProps()
    const filtersHash = Object.values(sublayer.filters || {})
      .flatMap((value) => value || [])
      .join('')
    const sublayerFilterExtensionProps = this._getSublayerFilterExtensionProps(sublayer)
    const hasFilters = Object.keys(sublayerFilterExtensionProps).length > 0
    const hasTimeFilter = Object.keys(timefilterProps).length > 0
    const combinedExtensions = this._combineFilterExtensionProps(
      timefilterProps,
      sublayerFilterExtensionProps
    )

    if (clip) {
      combinedExtensions.extensions.push(new ClipExtension())
    }

    const updateTrigger =
      hasFilters || hasTimeFilter
        ? {
            getFilterValue: [
              ...(hasFilters ? [filtersHash] : []),
              ...(hasTimeFilter ? [this.props.startTime!, this.props.endTime!] : []),
            ],
          }
        : {}

    return { extensionFilterProps: combinedExtensions, updateTrigger }
  }
}
