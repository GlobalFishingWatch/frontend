import { CompositeLayer, DefaultProps, LayerContext, PickingInfo } from '@deck.gl/core'
import { GeoBoundingBox, TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { DataFilterExtension } from '@deck.gl/extensions'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import { ContextFeature } from '../context'
import { getContextId } from '../context/context.utils'
import { BaseLayerProps } from '../../types'
import {
  UserPointsLayerProps,
  UserLayerPickingInfo,
  UserLayerFeature,
  UserLayerPickingObject,
  BaseUserLayerProps,
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
  idProperty: 'gfw_id',
  pickable: true,
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
  minPointSize: 3,
  maxPointSize: 15,
  circleRadiusRange: POINT_SIZES_DEFAULT_RANGE,
}

// update this in Sat Nov 20 2286 as deck gl does not support Infinity
const INFINITY_TIMERANGE_LIMIT = 9999999999999

export type UserBaseLayerState = {
  highlightedFeatures?: UserLayerPickingObject[]
}

type UserBaseLayerProps = BaseLayerProps & BaseUserLayerProps
export abstract class UserBaseLayer<
  PropsT extends UserBaseLayerProps
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
    const { subcategory, valueProperties } = this.props
    const object = {
      ...(info.tile && {
        ...transformTileCoordsToWGS84(
          info.object as UserLayerFeature,
          info.tile.bbox as GeoBoundingBox,
          this.context.viewport
        ),
      }),
      value: info.object?.properties.value,
      title: this.props.id,
      color: this.props.color,
      layerId: this.props.id,
      datasetId: this.props.layers[0].datasetId,
      category: this.props.category,
      subcategory: this.props.subcategory,
    } as UserLayerPickingObject
    if (!subcategory?.includes('draw')) {
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

    for (const f of features) {
      const featureId = getContextId(f.object as ContextFeature, this.props.idProperty)

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
    const { filter, valueProperties, startTimeProperty, endTimeProperty } = this.props
    const stepsPickValue = (this.props as UserPolygonsLayerProps)?.stepsPickValue
    const circleRadiusProperty = (this.props as UserPointsLayerProps)?.circleRadiusProperty
    const tilesUrlObject = new URL(tilesUrl)
    if (filter) {
      tilesUrlObject.searchParams.set('filter', filter)
    }
    // Needed for invalidate caches on user changes
    const properties = [
      ...(valueProperties || []),
      startTimeProperty || '',
      endTimeProperty || '',
      stepsPickValue || '',
      circleRadiusProperty || '',
    ].filter((p) => !!p)
    if (properties.length) {
      properties.forEach((property, index) => {
        tilesUrlObject.searchParams.set(`properties[${index}]`, property)
      })
    }
    // Decode the url is needed to keep the {x|y|z} format in the coordinates tiles
    return decodeURI(tilesUrlObject.toString())
  }

  _getTimeFilterProps() {
    const { startTime, endTime, startTimeProperty, endTimeProperty, timeFilterType } = this.props
    if (!timeFilterType || (!startTime && !endTime && !startTimeProperty && !endTimeProperty))
      return {}
    if (timeFilterType === 'date') {
      if (startTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) => d.properties[startTimeProperty as string],
          filterRange: [startTime, endTime],
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      }
    } else if (timeFilterType === 'dateRange') {
      if (startTimeProperty && endTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) => [
            d.properties[startTimeProperty as string],
            d.properties[endTimeProperty as string],
          ],
          filterRange: [
            [0, endTime],
            [startTime, INFINITY_TIMERANGE_LIMIT],
          ],
          extensions: [new DataFilterExtension({ filterSize: 2 })],
        }
      } else if (endTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) => d.properties[endTimeProperty as string],
          filterRange: [startTime, INFINITY_TIMERANGE_LIMIT],
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      } else if (startTimeProperty) {
        return {
          getFilterValue: (d: UserLayerFeature) => d.properties[startTimeProperty as string],
          filterRange: [0, endTime],
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      }
    }
    return {}
  }
}
