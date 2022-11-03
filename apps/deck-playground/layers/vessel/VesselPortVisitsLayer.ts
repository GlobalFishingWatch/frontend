import { ScatterplotLayer } from "@deck.gl/layers/typed";
const SHAPES = {
  SQUARE: 0,
  DIAMOND: 1,
  CIRCLE: 2,
}
class VesselPortVisitsLayer extends ScatterplotLayer {
  static layerName = 'VesselPortVisitsLayer'
  static defaultProps = {
    getShape: {type: 'access', value: SHAPES.CIRCLE}
  }



  initializeState() {
    super.initializeState()
    this.getAttributeManager().addInstanced({
      instanceShapes: {
        size: 1,
        accessor: 'getShape'
      }
    })
  }

  getShaders() {
    return {
      ...super.getShaders(),
      inject: {
        'vs:#decl': `
          attribute float instanceShapes;
          varying float vShape;
        `,
        'vs:#main-end': `
          vShape = instanceShapes;
        `,
        'fs:#decl': `
          uniform mat3 hueTransform;
          varying float vShape;
          const int SHAPE_SQUARE = 0;
          const int SHAPE_DIAMOND = 1;
          const int SHAPE_CIRCLE = 2;
        `,
        'fs:DECKGL_FILTER_COLOR': `
          vec2 uv = abs(geometry.uv);
          int shape = int(vShape);
          if (shape == SHAPE_SQUARE) {
            color = vec4(1.0, 0.0, 0.0, 1.0);
            if (uv.x > 0.7 || uv.y > 0.7) discard;
          } else if (shape == SHAPE_DIAMOND) {
              color = vec4(1.0, 1.0, 0.0, 1.0);
              if (uv.x + uv.y > 1.0) discard;
          } else {
            color.rgb = vec3(0.0, 1.0, 0.0);
          }
        `
      }
    }
  }

}

export default VesselPortVisitsLayer
