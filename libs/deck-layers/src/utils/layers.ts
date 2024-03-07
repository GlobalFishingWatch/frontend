import { PickingInfo } from '@deck.gl/core/typed'

export function getPickedFeatureToHighlight(
  data: any,
  pickedFeatures: PickingInfo[],
  idProperty: string
) {
  return (
    pickedFeatures &&
    pickedFeatures.find(
      (f: PickingInfo) =>
        f.object.type === 'Feature' &&
        f.object.properties[idProperty] === data.properties[idProperty]
    )
  )
}
