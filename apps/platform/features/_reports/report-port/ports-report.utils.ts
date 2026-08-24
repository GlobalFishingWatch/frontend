import type { ClusterMaxZoomLevelConfig } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { PORT_VISITS_EVENTS_SOURCE_ID } from 'features/_map/dataviews/dataviews.utils'

export function isPortClusterDataviewForReport(dataview: UrlDataviewInstance) {
  return dataview?.id?.includes(PORT_VISITS_EVENTS_SOURCE_ID)
}

export function getPortClusterDataviewForReport(
  dataview: UrlDataviewInstance,
  { portId, clusterMaxZoomLevels: newClusterMaxZoomLevels, visible = false } = {} as {
    portId?: string
    clusterMaxZoomLevels?: ClusterMaxZoomLevelConfig
    visible?: boolean
  }
) {
  if (isPortClusterDataviewForReport(dataview)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clusterMaxZoomLevels, ...restConfig } = dataview.config || {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { port_id, ...restFilters } = restConfig.filters || {}
    return {
      ...dataview,
      config: {
        ...restConfig,
        visible,
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
      visible: dataview.config?.visible !== undefined ? dataview.config.visible : false,
    })
  }
  return dataview
}
