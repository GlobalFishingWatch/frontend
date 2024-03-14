import { GeoJsonLayerProps, GeoJsonLayer } from '@deck.gl/layers/typed'
import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed'
import greatCircle from '@turf/great-circle'
import { PathStyleExtension } from '@deck.gl/extensions'
import { Ruler } from '@globalfishingwatch/layer-composer'
import { LayerGroup, getLayerGroupOffset } from '../../utils'

type RulerLayerProps = {
  rulers: Ruler[]
}
const COLOR = [255, 170, 0, 255] as Color

const getFeaturesFromRulers = (rulers: Ruler[]) => {
  return rulers.flatMap((ruler: Ruler) => {
    const startCoords = [ruler.start.longitude, ruler.start.latitude]
    const endCoords = [ruler.end.longitude, ruler.end.latitude]
    return [
      greatCircle(startCoords, endCoords, { properties: { id: ruler.id } }),
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: startCoords,
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: endCoords,
          type: 'Point',
        },
      },
    ]
  })
}
export class RulerLayer extends CompositeLayer<GeoJsonLayerProps & RulerLayerProps> {
  static layerName = 'RulerLayer'
  layers: LayersList = []
  renderLayers() {
    const { rulers } = this.props
    console.log('🚀 ~ RulerLayer ~ renderLayers ~ rulers:', rulers)
    this.layers = [
      new GeoJsonLayer({
        id: 'geojson-layer',
        data: {
          type: 'FeatureCollection',
          features: getFeaturesFromRulers(rulers),
        },
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        pickable: true,
        stroked: true,
        filled: true,
        getFillColor: COLOR,
        getLineColor: COLOR,
        pointRadiusMinPixels: 3,
        lineWidthMinPixels: 2,
        getDashArray: [4, 2],
        dashJustified: true,
        extensions: [new PathStyleExtension({ dash: true }) as any],
        updateTriggers: {
          getLineColor: rulers,
        },
      }) as Layer,
    ] as LayersList
    return this.layers
  }
}
