import type { DataviewInstance } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

export function cleanVesselProfileDataviewInstances(
  dataviewInstances: (UrlDataviewInstance | DataviewInstance)[] = []
) {
  if (!Array.isArray(dataviewInstances)) {
    return []
  }
  return dataviewInstances.map((dataviewInstance) => {
    if (dataviewInstance.origin === 'vesselProfile') {
      return {
        ...dataviewInstance,
        origin: undefined,
      }
    }
    return dataviewInstance
  })
}
