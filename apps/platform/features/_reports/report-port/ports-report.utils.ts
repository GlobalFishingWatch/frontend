import type { ClusterMaxZoomLevelConfig } from '@globalfishingwatch/api-types'
import { DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { BasemapType } from '@globalfishingwatch/deck-layers/config'
import {
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from '@platform/config/map/dataviews'

import { ReportCategory } from 'features/_reports/reports.types'
import type { QueryParams } from 'types'

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

type PortReportSearchParams = {
  portId: string
  name?: string
  country?: string
  datasetId?: string
  dataviewInstances?: UrlDataviewInstance[]
}

export function getPortReportSearch({
  portId,
  name,
  country,
  datasetId,
  dataviewInstances = [],
}: PortReportSearchParams): QueryParams {
  const basemap = dataviewInstances.find((d) => d.config?.type === DataviewType.Basemap)
  return {
    reportCategory: ReportCategory.Events,
    portsReportName: name,
    portsReportCountry: country,
    portsReportDatasetId: datasetId,
    dataviewInstances: [
      {
        ...(basemap ?? { id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID }),
        config: { ...basemap?.config, basemap: BasemapType.Satellite },
      },
      ...dataviewInstances
        .filter((instance) => instance !== basemap)
        .map((instance) =>
          getPortClusterDataviewForReport(instance, {
            portId,
            clusterMaxZoomLevels: { default: 20 },
            visible: true,
          })
        ),
    ],
  }
}
