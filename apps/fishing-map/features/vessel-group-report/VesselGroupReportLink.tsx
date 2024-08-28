import { useSelector } from 'react-redux'
import React from 'react'
import Link from 'redux-first-router-link'
import { VESSEL_GROUP_REPORT } from 'routes/routes'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import styles from './VesselGroupReport.module.css'

type VesselGroupReportLinkProps = {
  vesselGroupId: string
  children: React.ReactNode
}

function VesselGroupReportLink({ children, vesselGroupId }: VesselGroupReportLinkProps) {
  const workspace = useSelector(selectWorkspace)
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
        query: {},
      }}
    >
      {children}
    </Link>
  )
}

export default VesselGroupReportLink
