import { useSelector } from 'react-redux'
import React from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { PORT_REPORT } from 'routes/routes'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { selectLocationQuery } from 'routes/routes.selectors'
import { ExtendedFeatureByVesselEventPort } from 'features/map/map.slice'
import styles from './PortsReport.module.css'
import { getPortClusterDataviewForReport } from './ports-report.utils'

type PortsReportLinkProps = {
  port: ExtendedFeatureByVesselEventPort
  children: React.ReactNode
}

function PortsReportLink({ children, port }: PortsReportLinkProps) {
  const workspace = useSelector(selectWorkspace)
  const query = useSelector(selectLocationQuery)
  const { t } = useTranslation()

  if (!workspace || !port) {
    return children
  }

  return (
    <Link
      className={styles.link}
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
          ...(query?.dataviewInstances?.length && {
            dataviewInstances: query?.dataviewInstances?.map((instance: UrlDataviewInstance) =>
              getPortClusterDataviewForReport(instance, { portId: port.id })
            ),
          }),
        },
      }}
    >
      <Tooltip content={t('portsReport.seePortReport', 'See all visits to this port')}>
        <span>{children}</span>
      </Tooltip>
    </Link>
  )
}

export default PortsReportLink
