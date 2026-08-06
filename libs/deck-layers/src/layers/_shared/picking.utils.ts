import { DEFAULT_ID_PROPERTY } from '#config/layers.config'
import type { ContextPickingObject } from '#layers/context/index'
import type { PolygonPickingObject } from '#layers/polygons/index'
import type { UserLayerPickingObject } from '#layers/user/index'

export function getPickedFeatureToHighlight(
  data: any,
  pickedFeatures: (ContextPickingObject | UserLayerPickingObject | PolygonPickingObject)[],
  { idProperty = DEFAULT_ID_PROPERTY, datasetId } = {} as {
    idProperty?: string
    datasetId?: string
  }
) {
  return pickedFeatures?.some((f) => {
    if (
      f.id === data.properties?.[idProperty] ||
      f.properties?.[idProperty] === data.properties?.[idProperty]
    ) {
      return true
    }
    if (!datasetId || !f.properties?.datasetIds?.length) {
      return false
    }
    return (f.properties?.datasetIds as string[])?.some((id, index) => {
      return (
        f.properties?.areaIds?.[index] === data.properties[idProperty].toString() &&
        id === datasetId
      )
    })
  })
}
