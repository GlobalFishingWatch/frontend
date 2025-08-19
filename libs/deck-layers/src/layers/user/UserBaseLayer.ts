import type { DefaultProps, LayerContext, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { DataFilterExtension } from '@deck.gl/extensions'
import type { GeoBoundingBox, TileLayerProps } from '@deck.gl/geo-layers'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'

import type { DeckLayerProps } from '../../types'
import { getFeatureInFilter } from '../../utils'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import type { ContextFeature } from '../context'
import { getContextId } from '../context/context.utils'

import type {
  BaseUserLayerProps,
  UserLayerFeature,
  UserLayerPickingInfo,
  UserLayerPickingObject,
  UserPointsLayerProps,
  UserPolygonsLayerProps,
  UserTrackLayerProps,
} from './user.types'
import { getPropertiesList } from './user.utils'

type _UserBaseLayerProps =
  | (TileLayerProps & UserPointsLayerProps)
  | UserTrackLayerProps
  | UserPointsLayerProps

export const POINT_SIZES_DEFAULT_RANGE = [3, 15]
const defaultProps: DefaultProps<_UserBaseLayerProps> = {
  pickable: true,
  maxRequests: 100,
  debounceTime: 500,
  minPointSize: 3,
  maxPointSize: 15,
}

// update this in Sat Nov 20 2286 as deck gl does not support Infinity
const INFINITY_TIMERANGE_LIMIT = 9999999999999

export type UserBaseLayerState = {
  highlightedFeatures?: UserLayerPickingObject[]
}

type UserBaseLayerProps = DeckLayerProps<BaseUserLayerProps>
export abstract class UserBaseLayer<
  PropsT extends UserBaseLayerProps,
> extends CompositeLayer<PropsT> {
  static layerName = 'UserBaseLayer'
  static defaultProps = defaultProps
  state!: UserBaseLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      highlightedFeatures: [],
    }
  }

  _getHighlightedFeatures() {
    return [...(this.props.highlightedFeatures || []), ...(this.state.highlightedFeatures || [])]
  }

  setHighlightedFeatures(highlightedFeatures: ContextFeature[]) {
    this.setState({ highlightedFeatures })
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<UserLayerFeature, { tile?: Tile2DHeader }>
  }): UserLayerPickingInfo => {
    // TODO: support multiple sublayers
    const idProperty = this.props.layers[0].idProperty
    const valueProperties = this.props.layers[0].valueProperties || []
    // TODO: once filtered with the filter extension this works as expected
    const filters = this.props.layers[0].sublayers?.flatMap((s) => Object.keys(s.filters || {}))
    const color = this.props.layers[0].sublayers?.[0]?.color
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
      title: this.props.id,
      color: color,
      layerId: this.props.id,
      datasetId: this.props.layers[0].datasetId,
      category: this.props.category,
      subcategory: this.props.subcategory,
    } as UserLayerPickingObject

    if (!getFeatureInFilter(object, filters)) {
      return { ...info, object: undefined }
    }

    if (!this.props.subcategory?.includes('draw')) {
      const properties = { ...((info.object as UserLayerFeature)?.properties || {}) }

      object.value =
        valueProperties?.length === 1
          ? properties[valueProperties[0]]
          : getPropertiesList(properties)
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
    const features = this._pickObjects(maxFeatures)
    const featureCache = new Set()
    const renderedFeatures: UserLayerFeature[] = []
    // TODO: support multiple sublayers
    const idProperty = this.props.layers[0].idProperty

    for (const f of features) {
      const featureId = getContextId(f.object as ContextFeature, idProperty)

      if (featureId === undefined) {
        // we have no id for the feature, we just add to the list
        renderedFeatures.push(f.object as UserLayerFeature)
      } else if (!featureCache.has(featureId)) {
        // Add removing duplicates
        featureCache.add(featureId)
        renderedFeatures.push(f.object as UserLayerFeature)
      }
    }

    return renderedFeatures
  }

  _getTilesUrl(tilesUrl: string) {
    const { startTimeProperty, endTimeProperty, layers } = this.props
    const valueProperties = layers.flatMap((l) => l.valueProperties || [])
    const filters = layers.flatMap((l) => l.sublayers?.flatMap((s) => Object.keys(s.filters || {})))
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

  _getTimeFilterProps() {
    const { startTime, endTime, startTimeProperty, endTimeProperty, timeFilterType } = this.props
    if (!timeFilterType || (!startTime && !endTime && !startTimeProperty && !endTimeProperty)) {
      return {}
    }
    // https://deck.gl/docs/api-reference/extensions/data-filter-extension#limitations
    // When using very large filter values, most commonly Epoch timestamps, 32-bit float representation could lead to an error margin of >1 minute.
    const offsetPrecision = 1000 * 60 * 30 // 30 minutes
    const startMatchRange = [0, endTime! - offsetPrecision]
    const endMatchRange = [startTime!, INFINITY_TIMERANGE_LIMIT]
    if (timeFilterType === 'date') {
      if (startTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) =>
            parseInt(d.properties[startTimeProperty as string]),
          filterRange: [startTime, endTime],
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
    return {}
  }
}
