import { useSelector } from 'react-redux'
import cx from 'classnames'
import React from 'react'
import Link from 'redux-first-router-link'
import { Tooltip } from '@globalfishingwatch/ui-components'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DataviewType } from '@globalfishingwatch/api-types'
import { BasemapType } from '@globalfishingwatch/deck-layers'
import { PORT_REPORT } from 'routes/routes'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import {
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  DEFAULT_WORKSPACE_CATEGORY,
  DEFAULT_WORKSPACE_ID,
} from 'data/workspaces'
import { selectLocationQuery } from 'routes/routes.selectors'
import type { ExtendedFeatureByVesselEventPort } from 'features/map/map.slice'
import styles from './PortsReport.module.css'
import { getPortClusterDataviewForReport } from './ports-report.utils'

type PortsReportLinkProps = {
  port: ExtendedFeatureByVesselEventPort
  children: React.ReactNode
  tooltip?: string
}

function PortsReportLink({ children, port, tooltip }: PortsReportLinkProps) {
  const workspace = useSelector(selectWorkspace)
  const query = useSelector(selectLocationQuery)

  if (!workspace || !port) {
    return children
  }

  const basemapDataviewInstance = (query.dataviewInstances as UrlDataviewInstance[])?.find(
    (d: UrlDataviewInstance) => d.config?.type === DataviewType.Basemap
  )
  const dataviewInstances = basemapDataviewInstance
    ? [
        {
          ...basemapDataviewInstance,
          config: { ...(basemapDataviewInstance.config || {}), basemap: BasemapType.Satellite },
        },
      ]
    : [{ id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID, config: { basemap: BasemapType.Satellite } }]
  if (query.dataviewInstances?.length) {
    const parsedInstances = query.dataviewInstances.map((instance: UrlDataviewInstance) => {
      return getPortClusterDataviewForReport(instance, {
        portId: port.id,
        clusterMaxZoomLevels: { default: 20 },
      })
    })
    dataviewInstances.push(...parsedInstances)
  }

  return (
    <Link
      className={cx(styles.link)}
      to={{
        type: PORT_REPORT,
        payload: {
          category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
          workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
          portId: port.id,
        },
        query: {
          ...query,
          portsReportName: port.name,
          portsReportCountry: port.country,
          portsReportDatasetId: port.datasetId,
          dataviewInstances,
        },
      }}
    >
      <Tooltip content={tooltip}>{children}</Tooltip>
    </Link>
  )
}

export default PortsReportLink
