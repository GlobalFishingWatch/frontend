import { Dataview } from '@globalfishingwatch/api-types/dist'

export const getDataviewInstanceFromDataview = (dataview: Dataview) => {
  return {
    id: `${dataview.name}-${Date.now()}`,
    dataviewId: dataview.id,
  }
}
