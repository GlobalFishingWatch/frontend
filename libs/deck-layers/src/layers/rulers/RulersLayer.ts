import { GeoJsonLayerProps, GeoJsonLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { Feature, Point } from '@turf/turf'
import { LayerGroup, getLayerGroupOffset } from '../../utils'
import { RulerData, RulerPointProperties } from '../../types'
import {
  getGreatCircleMultiLine,
  getRulerCenterPointWithLabel,
  getRulerStartAndEndPoints,
  hasRulerStartAndEnd,
} from './rulers.utils'
import { COLOR } from './rulers.config'

type RulersLayerProps = GeoJsonLayerProps & {
  rulers: RulerData[]
}

const getFeaturesFromRulers = (rulers: RulerData[]) => {
  return rulers.flatMap((ruler: RulerData) => {
    const line = getGreatCircleMultiLine(ruler)
    return [line, ...getRulerStartAndEndPoints(ruler), getRulerCenterPointWithLabel(line)]
  })
}

export class RulersLayer extends CompositeLayer<RulersLayerProps> {
  static layerName = 'RulersLayer'
  renderLayers() {
    const { rulers, visible } = this.props

    if (!hasRulerStartAndEnd(rulers)) return null

    const data = {
      type: 'FeatureCollection',
      features: getFeaturesFromRulers(rulers),
    }

    return new GeoJsonLayer(
      this.getSubLayerProps({
        id: 'ruler-layer',
        data,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        pickable: true,
        stroked: true,
        filled: true,
        visible,
        getFillColor: COLOR,
        getLineColor: COLOR,
        pointType: 'circle+text',
        pointRadiusUnits: 'pixels',
        getPointRadius: (d: Feature<Point, RulerPointProperties>) =>
          d.properties?.order === 'center' ? 0 : 3,
        getText: (d: Feature<Point, RulerPointProperties>) => d.properties?.text,
        getTextAngle: (d: Feature<Point, RulerPointProperties>) => d.properties?.bearing,
        getTextSize: 12,
        getTextColor: COLOR,
        getTextAlignmentBaseline: 'bottom',
        lineWidthMinPixels: 2,
        getDashArray: [4, 2],
        extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
      })
    )
  }
}
