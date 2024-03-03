import { PickingInfo } from '@deck.gl/core/typed'

export function getPickedFeatureToHighlight(data: any, pickedFeatures: PickingInfo[]) {
  return (
    pickedFeatures &&
    pickedFeatures.find(
      (f: PickingInfo) =>
        f.object.type === 'Feature' && f.object.properties.gfw_id === data.properties.gfw_id
    )
  )
}
