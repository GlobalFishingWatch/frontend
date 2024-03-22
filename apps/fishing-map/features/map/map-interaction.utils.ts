import { PickingInfo } from '@deck.gl/core'

export const isRulerLayerPoint = (info: PickingInfo) =>
  info.sourceLayer?.id === 'RulersLayer-ruler-layer' && info.object.geometry.type === 'Point'
