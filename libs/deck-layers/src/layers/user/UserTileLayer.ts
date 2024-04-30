import { CompositeLayer, DefaultProps, PickingInfo } from '@deck.gl/core'
import { GeoBoundingBox, TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { DataFilterExtension } from '@deck.gl/extensions'
import { DataviewType } from '@globalfishingwatch/api-types'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import { ContextFeature } from '../context'
import { getContextId } from '../context/context.utils'
import { BaseLayerProps } from '../../types'
import {
  UserPointsLayerProps,
  UserContextPickingInfo,
  UserContextFeature,
  UserContextPickingObject,
  BaseUserLayerProps,
  UserContextLayerProps,
} from './user.types'

type _UserPointsLayerProps = TileLayerProps & UserPointsLayerProps

export const POINT_SIZES_DEFAULT_RANGE = [3, 15]
const defaultProps: DefaultProps<_UserPointsLayerProps> = {
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

type UserTileLayerProps = BaseLayerProps & BaseUserLayerProps
export abstract class UserTileLayer<
  PropsT extends UserTileLayerProps
> extends CompositeLayer<PropsT> {
  static layerName = 'UserTileLayer'
  static defaultProps = defaultProps

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<UserContextFeature, { tile?: Tile2DHeader }>
  }): UserContextPickingInfo => {
    const { idProperty, valueProperties } = this.props
    let title = this.props.id
    if (valueProperties) {
      const properties = { ...(info.object as UserContextFeature)?.properties }
      title =
        valueProperties?.length === 1
          ? properties[valueProperties[0]]
          : valueProperties
              .flatMap((prop) => (properties?.[prop] ? `${prop}: ${properties?.[prop]}` : []))
              .join('<br/>')
    }
    const object = {
      ...transformTileCoordsToWGS84(
        info.object as UserContextFeature,
        info.tile!.bbox as GeoBoundingBox,
        this.context.viewport
      ),
      title,
      color: this.props.color,
      layerId: this.props.layers[0].id,
      datasetId: this.props.layers[0].datasetId,
      category: this.props.category,
      // TODO:deck remove this hardcoded type here and make a decision how to handle it
      subcategory: DataviewType.UserContext,
    } as UserContextPickingObject

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

  getRenderedFeatures(maxFeatures: number | null = null): UserContextFeature[] {
    const features = this._pickObjects(maxFeatures)
    const featureCache = new Set()
    const renderedFeatures: UserContextFeature[] = []

    for (const f of features) {
      const featureId = getContextId(f.object as ContextFeature, this.props.idProperty)

      if (featureId === undefined) {
        // we have no id for the feature, we just add to the list
        renderedFeatures.push(f.object as UserContextFeature)
      } else if (!featureCache.has(featureId)) {
        // Add removing duplicates
        featureCache.add(featureId)
        renderedFeatures.push(f.object as UserContextFeature)
      }
    }

    return renderedFeatures
  }

  _getTilesUrl(tilesUrl: string) {
    const { filter, valueProperties, startTimeProperty, endTimeProperty } = this.props
    const stepsPickValue = (this.props as UserContextLayerProps)?.stepsPickValue
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
          getFilterValue: (d: UserContextFeature) => d.properties[startTimeProperty as string],
          filterRange: [startTime, endTime],
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      }
    } else if (timeFilterType === 'dateRange') {
      if (startTimeProperty && endTimeProperty) {
        return {
          getFilterValue: (d: UserContextFeature) => [
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
          getFilterValue: (d: UserContextFeature) => d.properties[endTimeProperty as string],
          filterRange: [startTime, INFINITY_TIMERANGE_LIMIT],
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      } else if (startTimeProperty) {
        return {
          getFilterValue: (d: UserContextFeature) => d.properties[startTimeProperty as string],
          filterRange: [0, endTime],
          extensions: [new DataFilterExtension({ filterSize: 1 })],
        }
      }
    }
    return {}
  }
}
