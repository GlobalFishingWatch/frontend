import { CompositeLayer, Color, DefaultProps, PickingInfo } from '@deck.gl/core'
import { GeoBoundingBox, TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import { GeoJsonProperties } from 'geojson'
import { DataFilterExtension } from '@deck.gl/extensions'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { scaleLinear } from 'd3-scale'
import { DataviewType } from '@globalfishingwatch/api-types'
import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  hexToDeckColor,
  LayerGroup,
  getLayerGroupOffset,
  getPickedFeatureToHighlight,
  GFWMVTLoader,
  getMVTSublayerProps,
  rgbaStringToComponents,
  getColorRampByOpacitySteps,
} from '../../utils'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import { ContextFeature } from '../context'
import { getContextId } from '../context/context.utils'
import {
  UserContextLayerProps,
  UserContextPickingInfo,
  UserContextFeature,
  UserContextPickingObject,
} from './user.types'

type _UserContextLayerProps = TileLayerProps & UserContextLayerProps

const defaultProps: DefaultProps<_UserContextLayerProps> = {
  idProperty: 'gfw_id',
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
}

export class UserContextTileLayer<PropsT = {}> extends CompositeLayer<
  _UserContextLayerProps & PropsT
> {
  static layerName = 'UserContextTileLayer'
  static defaultProps = defaultProps

  getHighlightLineWidth(d: UserContextFeature): number {
    const { highlightedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!) ? 1 : 0
  }

  getFillColor(d: UserContextFeature): Color {
    const { highlightedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!)
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  getFillStepsColor(d: UserContextFeature): Color {
    const { highlightedFeatures = [], idProperty, color } = this.props
    if (getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!)) {
      return COLOR_HIGHLIGHT_FILL
    }
    if (!this.props.steps || !this.props.stepsPickValue) {
      return COLOR_TRANSPARENT
    }

    const value = d.properties?.[this.props.stepsPickValue!]
    const colorRange = getColorRampByOpacitySteps(color)
    const scale = scaleLinear(this.props.steps as number[], colorRange).clamp(true)
    const fillColor = scale(value)
    return fillColor ? (rgbaStringToComponents(fillColor) as Color) : COLOR_TRANSPARENT
  }

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
    const { filter, valueProperties, stepsPickValue, startTimeProperty, endTimeProperty } =
      this.props
    const tilesUrlObject = new URL(tilesUrl)
    if (filter) {
      tilesUrlObject.searchParams.set('filter', filter)
    }
    // Needed for invalidate caches on user changes
    const properties = [
      ...(valueProperties || []),
      stepsPickValue || '',
      startTimeProperty || '',
      endTimeProperty || '',
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
            [startTime, 9999999999999], // update this in Sat Nov 20 2286 as deck gl does not support Infinity
          ],
          extensions: [new DataFilterExtension({ filterSize: 2 })],
        }
      } else if (endTimeProperty) {
        return {
          getFilterValue: (d: UserContextFeature) => d.properties[endTimeProperty as string],
          filterRange: [startTime, 9999999999999],
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

  renderLayers() {
    const { highlightedFeatures, color, layers, steps, stepsPickValue } = this.props
    const hasColorSteps = steps !== undefined && steps.length > 0 && stepsPickValue !== undefined
    const filterProps = this._getTimeFilterProps()
    return layers.map((layer) => {
      return new TileLayer<TileLayerProps<UserContextFeature>>({
        id: `${layer.id}-base-layer`,
        data: this._getTilesUrl(layer.tilesUrl),
        loaders: [GFWMVTLoader],
        onViewportLoad: this.props.onViewportLoad,
        ...filterProps,
        renderSubLayers: (props) => {
          const mvtSublayerProps = {
            ...props,
            ...getMVTSublayerProps({ tile: props.tile, extensions: props.extensions }),
          }
          return [
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-fills`,
              stroked: false,
              pickable: true,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Default, params),
              getFillColor: hasColorSteps
                ? (d) => this.getFillStepsColor(d as UserContextFeature)
                : (d) => this.getFillColor(d as UserContextFeature),
              updateTriggers: {
                getFillColor: [highlightedFeatures],
              },
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-lines`,
              lineWidthMinPixels: 1,
              filled: false,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.CustomLayer, params),
              getLineColor: hexToDeckColor(color),
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-lines`,
              lineWidthMinPixels: 0,
              lineWidthUnits: 'pixels',
              filled: false,
              visible: highlightedFeatures && highlightedFeatures?.length > 0,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.CustomLayer, params),
              getLineWidth: (d) => this.getHighlightLineWidth(d as UserContextFeature),
              getLineColor: COLOR_HIGHLIGHT_LINE,
              updateTriggers: {
                getLineWidth: [highlightedFeatures],
              },
            }),
          ]
        },
      })
    })
  }
}
