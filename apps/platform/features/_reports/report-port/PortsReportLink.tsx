import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'
import { ROUTE_PATHS } from '@platform/config/routes'

import type { ExtendedFeatureByVesselEventPort } from 'features/_map/map/map.slice'
import { useClickedEventConnect } from 'features/_map/map/map-interactions.hooks'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import { selectLocationQuery } from 'router/routes.selectors'
import type { QueryParams } from 'types'

import { getPortReportSearch } from './ports-report.utils'

import styles from './PortsReport.module.css'

type PortsReportLinkProps = {
  port: ExtendedFeatureByVesselEventPort
  children: React.ReactNode
  tooltip?: string
}

function PortsReportLink({ children, port, tooltip }: PortsReportLinkProps) {
  const workspace = useSelector(selectWorkspace)
  const query = useSelector(selectLocationQuery)

  const { dispatchClickedEvent } = useClickedEventConnect()

  const handleOnClick = useCallback(() => {
    dispatchClickedEvent(null)
  }, [dispatchClickedEvent])

  if (!workspace || !port || !port.id) {
    return children
  }

  return (
    <Link
      className={cx(styles.link)}
      to={ROUTE_PATHS.PORT_REPORT}
      params={{
        category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
        workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
        portId: port.id!,
      }}
      search={(prev: QueryParams) => ({
        ...prev,
        ...getPortReportSearch({
          portId: port.id!,
          name: port.name,
          country: port.country || port.flag,
          datasetId: port.datasetId,
          dataviewInstances: query.dataviewInstances,
        }),
      })}
      onClick={handleOnClick}
    >
      <Tooltip content={tooltip}>{children}</Tooltip>
    </Link>
  )
}

export default PortsReportLink
