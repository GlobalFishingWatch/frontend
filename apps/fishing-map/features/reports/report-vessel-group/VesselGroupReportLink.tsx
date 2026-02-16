import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import type { QueryParams } from 'types'

import { ReportCategory } from '../reports.types'

import styles from './VesselGroupReport.module.css'

type VesselGroupReportLinkProps = {
  vesselGroupId: string
  children: React.ReactNode
}

function VesselGroupReportLink({ children, vesselGroupId }: VesselGroupReportLinkProps) {
  const workspace = useSelector(selectWorkspace)

  const analysisRedirect = () => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `access_vessel_group_profile`,
      other: { vesselGroupId: vesselGroupId },
    })
  }

  if (!workspace || !vesselGroupId) {
    return children
  }

  return (
    <Link
      className={styles.link}
      to="/$category/$workspaceId/vessel-group-report/$vesselGroupId"
      params={{
        category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
        workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
        vesselGroupId: vesselGroupId,
      }}
      search={(prev: QueryParams) => ({ ...prev, reportCategory: ReportCategory.VesselGroup })}
      onClick={analysisRedirect}
    >
      {children}
    </Link>
  )
}

export default VesselGroupReportLink
