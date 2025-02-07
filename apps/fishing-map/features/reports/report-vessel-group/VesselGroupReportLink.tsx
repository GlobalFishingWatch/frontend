import React from 'react'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { VESSEL_GROUP_REPORT } from 'routes/routes'
import { selectLocationQuery } from 'routes/routes.selectors'

import { ReportCategory } from '../reports.types'

import styles from './VesselGroupReport.module.css'

type VesselGroupReportLinkProps = {
  vesselGroupId: string
  children: React.ReactNode
}

function VesselGroupReportLink({ children, vesselGroupId }: VesselGroupReportLinkProps) {
  const workspace = useSelector(selectWorkspace)
  const query = useSelector(selectLocationQuery)

  if (!workspace || !vesselGroupId) {
    return children
  }
  return (
    <Link
      className={styles.link}
      to={{
        type: VESSEL_GROUP_REPORT,
        payload: {
          category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
          workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
          vesselGroupId: vesselGroupId,
        },
        query: { ...query, reportCategory: ReportCategory.VesselGroup },
      }}
    >
      {children}
    </Link>
  )
}

export default VesselGroupReportLink
