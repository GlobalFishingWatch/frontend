import type { ClusterMaxZoomLevelConfig } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { PORT_VISITS_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'

export function isPortClusterDataviewForReport(dataview: UrlDataviewInstance) {
  return dataview?.id?.includes(PORT_VISITS_EVENTS_SOURCE_ID)
}

export function getPortClusterDataviewForReport(
  dataview: UrlDataviewInstance,
  { portId, clusterMaxZoomLevels: newClusterMaxZoomLevels } = {} as {
    portId?: string
    clusterMaxZoomLevels?: ClusterMaxZoomLevelConfig
  }
) {
  if (isPortClusterDataviewForReport(dataview)) {
    const { clusterMaxZoomLevels, ...restConfig } = dataview.config || {}
    const { port_id, ...restFilters } = restConfig.filters || {}
    return {
      ...dataview,
      config: {
        ...restConfig,
        visible: true,
        ...(newClusterMaxZoomLevels && { clusterMaxZoomLevels: newClusterMaxZoomLevels }),
        filters: {
          ...(restFilters || {}),
          ...(portId && { port_id: portId }),
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
