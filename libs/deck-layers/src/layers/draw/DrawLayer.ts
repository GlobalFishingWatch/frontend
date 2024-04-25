import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { PickingInfo } from '@deck.gl/core'
import { LayerGroup, getLayerGroupOffset } from '../../utils'
import { DeckLayerCategory } from '../../types'
// import { LINES_COLOR } from './draw.config'
import { DrawPickingInfo, DrawPickingObject } from './draw.types'

const DEFAULT_STYLES = {
  lineJointRounded: true,
  getLineWidth: 1,
  // getLineColor: LINES_COLOR,
  getFillColor: [120, 0, 120, 120],
  getDashArray: [4, 2],
  extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
}

export class DrawLayer extends EditableGeoJsonLayer {
  static layerName = 'draw-layer'
  getPickingInfo({ info }: { info: PickingInfo }): DrawPickingInfo {
    const object = {
      ...info.object,
      id: this.props.id,
      layerId: 'draw-layer',
      category: 'draw' as DeckLayerCategory,
      index: info.index,
    } as DrawPickingObject
    return {
      ...info,
      object,
    }
  }
  renderLayers() {
    const { mode, data, selectedFeatureIndexes, onEdit, onClick } = this.props
    return [
      new EditableGeoJsonLayer({
        id: 'draw',
        data,
        mode,
        onEdit,
        // onClick,
        selectedFeatureIndexes,
        getFillColor: [0, 0, 0, 0],
        modeConfig: {
          preventOverlappingLines: true,
        },
        editHandlePointOutline: false,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        _subLayerProps: {
          // geojson: {
          //   ...DEFAULT_STYLES,
          // },
          guides: {
            getPointRadius: 10,
            ...DEFAULT_STYLES,
            getLineColor: [255, 0, 0],
          },
        },
      }),
    ]
  }
}
