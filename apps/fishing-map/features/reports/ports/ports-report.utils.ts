import type { ClusterMaxZoomLevelConfig } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { PORT_VISITS_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'

export function isPortClusterDataviewForReport(dataview: UrlDataviewInstance) {
  return dataview.id.includes(PORT_VISITS_EVENTS_SOURCE_ID)
}

export function getPortClusterDataviewForReport(
  dataview: UrlDataviewInstance,
  { portId, clusterMaxZoomLevels } = {} as {
    portId?: string
    clusterMaxZoomLevels?: ClusterMaxZoomLevelConfig
  }
) {
  if (isPortClusterDataviewForReport(dataview)) {
    return {
      ...dataview,
      config: {
        ...dataview.config,
        visible: true,
        clusterMaxZoomLevels,
        filters: {
          ...(dataview.config?.filters || {}),
          port_id: portId,
        },
      },
    }
  }
  return dataview
}

export function cleanPortClusterDataviewFromReport(dataview: UrlDataviewInstance) {
  if (isPortClusterDataviewForReport(dataview)) {
    return getPortClusterDataviewForReport(dataview, {
      portId: undefined,
      clusterMaxZoomLevels: undefined,
    })
  }
  return dataview
}
