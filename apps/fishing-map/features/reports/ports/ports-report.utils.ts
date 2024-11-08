import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { PORT_VISITS_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'

export function isPortClusterDataviewForReport(dataview: UrlDataviewInstance) {
  return dataview.id.includes(PORT_VISITS_EVENTS_SOURCE_ID)
}

export function getPortClusterDataviewForReport(
  dataview: UrlDataviewInstance,
  { portId } = {} as { portId?: string }
) {
  if (isPortClusterDataviewForReport(dataview)) {
    // TODO:PORTS remove the country option in the maxClusterZoomLevel
    return {
      ...dataview,
      config: {
        ...dataview.config,
        visible: true,
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
    return getPortClusterDataviewForReport(dataview, { portId: undefined })
    // TODO:PORTS rollback the maxClusterZoomLevel
  }
  return dataview
}
