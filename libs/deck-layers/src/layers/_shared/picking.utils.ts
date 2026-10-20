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
  const getId = (properties?: Record<string, any>) =>
    properties?.[idProperty] ?? properties?.[idProperty.toLowerCase()]
  const dataId = getId(data.properties)
  // Without an id every feature would match an id-less picked feature (undefined === undefined)
  if (dataId === undefined) return false
  return pickedFeatures?.some((f) => {
    if (f.id === dataId || getId(f.properties) === dataId) {
      return true
    }
    if (!datasetId || !f.properties?.datasetIds?.length) {
      return false
    }
    return (f.properties?.datasetIds as string[])?.some((id, index) => {
      return f.properties?.areaIds?.[index] === dataId.toString() && id === datasetId
    })
  })
}
