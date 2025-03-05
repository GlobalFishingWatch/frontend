import { IconLayer } from '@deck.gl/layers'

/** Render paths that represent vessel trips. */
export class VesselPositionLayer extends IconLayer {
  static layerName = 'VesselPositionLayer'

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#main-end': /*glsl*/ `
        gl_Position.z = 1.0;
      `,
    }
    return shaders
  }
}
