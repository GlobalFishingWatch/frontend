import type { LayerGroup } from '#config/sort.config'
import { LAYER_GROUP_ORDER } from '#config/sort.config'

export function getLayerGroupOffset(
  group: LayerGroup,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { layerIndex = 1 } = {} as { layerIndex: number }
): [number, number] {
  return [0, -(LAYER_GROUP_ORDER.indexOf(group) * 100)]
}
