import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers'
import { Color, CompositeLayer, DefaultProps, PickingInfo } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { Feature, Point, feature } from '@turf/turf'
import { LineString, MultiLineString } from 'geojson'
import { LayerGroup, getLayerGroupOffset } from '../../utils'
import { DeckLayerCategory } from '../../types'
import {
  RulersLayerProps,
  RulerData,
  RulerPointProperties,
  RulerPickingObject,
  RulerPickingInfo,
} from './rulers.types'
import {
  getGreatCircleMultiLine,
  getRulerCenterPointWithLabel,
  getRulerCoordsPairs,
  getRulerLengthLabel,
  getRulerStartAndEndPoints,
  hasRulerStartAndEnd,
} from './rulers.utils'

const RULERS_COLOR = [255, 170, 0, 255] as Color

const defaultProps: DefaultProps<RulersLayerProps> = {
  rulers: [],
  color: RULERS_COLOR,
}

const getRulersLines = (rulers: RulerData[]) => {
  return rulers.flatMap((ruler: RulerData) => {
    return getGreatCircleMultiLine(ruler)
  })
}

const getRulersLinesLabels = (lines: Feature<LineString | MultiLineString>[]) => {
  return lines.flatMap((line) => {
    return getRulerCenterPointWithLabel(line)
  })
}

export class RulersLayer extends CompositeLayer<RulersLayerProps> {
  static layerName = 'RulersLayer'
  static defaultProps = defaultProps

  getPickingInfo({ info }: { info: PickingInfo }): RulerPickingInfo {
    const object = {
      ...info.object,
      id: this.props.id,
      layerId: 'ruler-layer',
      category: 'rulers' as DeckLayerCategory,
    } as RulerPickingObject
    return {
      ...info,
      object,
    }
  }
  renderLayers() {
    const { rulers, color, visible } = this.props

    if (!hasRulerStartAndEnd(rulers)) return null

    const rulersLines = getRulersLines(rulers)
    const rulersLabels = getRulersLinesLabels(rulersLines)
    const data = {
      type: 'FeatureCollection',
      features: [...rulersLines, ...rulersLabels],
    }

    const rulersPoints = rulers.flatMap((ruler) => getRulerStartAndEndPoints(ruler))

    const lineLayer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: 'ruler-layer',
        data,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        pickable: false,
        stroked: true,
        filled: true,
        visible,
        getFillColor: color,
        getLineColor: color,
        pointType: 'circle+text',
        pointRadiusUnits: 'pixels',
        getPointRadius: (d: Feature<Point, RulerPointProperties>) =>
          d.properties?.order === 'center' ? 0 : 3,
        getText: (d: Feature<Point, RulerPointProperties>) => d.properties?.text,
        getTextAngle: (d: Feature<Point, RulerPointProperties>) => d.properties?.bearing,
        getTextSize: 12,
        getTextColor: color,
        getTextAlignmentBaseline: 'bottom',
        lineWidthMinPixels: 2,
        getDashArray: [4, 2],
        extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
      })
    )
    const pointsLayer = new ScatterplotLayer(
      this.getSubLayerProps({
        id: 'ruler-layer-points',
        data: rulersPoints,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        getPosition: (d: any) => d.geometry.coordinates,
        pickable: true,
        visible,
        getFillColor: color,
        radiusUnits: 'pixels',
        getRadius: (d: Feature<Point, RulerPointProperties>) =>
          d.properties?.order === 'center' ? 0 : 3,
        lineWidthMinPixels: 2,
      })
    )
    return [lineLayer, pointsLayer]
  }
}
