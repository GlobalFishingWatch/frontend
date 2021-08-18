import { kebabCase } from 'lodash'
import { ColorCyclingType, Dataview, DataviewInstance } from '@globalfishingwatch/api-types/dist'
import { Generators } from '@globalfishingwatch/layer-composer/dist'

export const getDataviewInstanceFromDataview = (dataview: Dataview) => {
  return {
    id: `${kebabCase(dataview.name)}-${Date.now()}`,
    dataviewId: dataview.id,
  }
}

export const getActivityDataviewInstanceFromDataview = (
  dataview?: Dataview
): DataviewInstance<Generators.Type> | undefined => {
  if (!dataview) return
  const instance = getDataviewInstanceFromDataview(dataview)
  return {
    ...instance,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
  }
}
