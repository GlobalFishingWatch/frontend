import { useSelector } from 'react-redux'
import React from 'react'
import Link from 'redux-first-router-link'
import { VESSEL_GROUP_REPORT } from 'routes/routes'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { selectLocationQuery } from 'routes/routes.selectors'
import { useReportAreaCenter, useVesselGroupBounds } from '../areas/area-reports.hooks'
import styles from './VesselGroupReport.module.css'

type VesselGroupReportLinkProps = {
  dataviewId?: string
  vesselGroupId: string
  children: React.ReactNode
}

function VesselGroupReportLink({
  children,
  vesselGroupId,
  dataviewId,
}: VesselGroupReportLinkProps) {
  const workspace = useSelector(selectWorkspace)
  const { bbox } = useVesselGroupBounds(dataviewId)
  const coordinates = useReportAreaCenter(bbox!, { mapWidth: window.innerWidth / 2 })
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
        query: {
          ...query,
          ...(coordinates && {
            ...coordinates,
          }),
        },
      }}
    >
      {children}
    </Link>
  )
}

export default VesselGroupReportLink
