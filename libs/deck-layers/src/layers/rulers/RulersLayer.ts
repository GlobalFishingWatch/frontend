import { GeoJsonLayerProps, GeoJsonLayer, TextLayer } from '@deck.gl/layers/typed'
import { CompositeLayer, LayersList } from '@deck.gl/core/typed'
import { PathStyleExtension } from '@deck.gl/extensions'
import { Position } from '@deck.gl/core'
import { rhumbBearing } from '@turf/turf'
import { LayerGroup, getLayerGroupOffset } from '../../utils'
import { RulerData } from '../../types'
import {
  getGreatCircleMultiLine,
  getRulerLengthLabel,
  getRulerStartAndEndPoints,
  hasRulerStartAndEnd,
} from './rulers.utils'
import { COLOR } from './rulers.config'

type RulersLayerProps = GeoJsonLayerProps & {
  rulers: RulerData[]
}

type RulerLabel = {
  text: string
  position: Position
  bearing: number
}

const getFeaturesFromRulers = (rulers: RulerData[]) => {
  return rulers.flatMap((ruler: RulerData) => [
    getGreatCircleMultiLine(ruler),
    ...getRulerStartAndEndPoints(ruler),
  ])
}
export class RulersLayer extends CompositeLayer<RulersLayerProps> {
  static layerName = 'RulersLayer'
  layers: LayersList = []
  updateState({ props }: { props: RulersLayerProps }) {
    if (!hasRulerStartAndEnd(props.rulers)) return
    const labels = props.rulers.map((ruler: RulerData) => {
      const line = getGreatCircleMultiLine(ruler)
      const centerIndex = Math.round(line.geometry.coordinates.length / 2)
      const centerPoint = line.geometry.coordinates[centerIndex]
      const anchorPoints = line.geometry.coordinates.slice(centerIndex, centerIndex + 2)
      const bearing = rhumbBearing(anchorPoints[0] as Position, anchorPoints[1] as Position)
      return {
        text: getRulerLengthLabel(ruler),
        position: centerPoint,
        bearing: bearing <= 0 ? 270 - bearing : 90 - bearing,
      }
    })
    this.setState({ labels })
  }
  renderLayers() {
    const { rulers, visible } = this.props
    return hasRulerStartAndEnd(rulers)
      ? ([
          new GeoJsonLayer(
            this.getSubLayerProps({
              id: 'ruler-layer',
              data: {
                type: 'FeatureCollection',
                features: getFeaturesFromRulers(rulers),
              },
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
              pickable: true,
              stroked: true,
              filled: true,
              visible,
              getFillColor: COLOR,
              getLineColor: COLOR,
              pointRadiusMinPixels: 3,
              lineWidthMinPixels: 2,
              getDashArray: [4, 2],
              extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
              updateTriggers: {
                getLineColor: rulers,
              },
            })
          ),
          new TextLayer(
            this.getSubLayerProps({
              id: 'ruler-labels',
              data: this.state.labels,
              getText: (d: RulerLabel) => d.text,
              getPosition: (d: RulerLabel) => d.position,
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
              getSize: 12,
              getAngle: (d: RulerLabel) => d.bearing,
              getColor: COLOR,
              getAlignmentBaseline: 'bottom',
            })
          ),
        ] as LayersList)
      : []
  }
}
