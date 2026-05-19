import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import type { ReportCategory } from 'features/reports/reports.types'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import type { QueryParams } from 'types'

const GlobalReportLink = ({ reportCategory }: { reportCategory: ReportCategory }) => {
  const { t } = useTranslation()
  const workspace = useSelector(selectWorkspace)
  const fitAreaInViewport = useFitAreaInViewport()

  const handleOnClick = () => {
    fitAreaInViewport()
    resetSidebarScroll()
  }

  return (
    <Link
      to="/$category/$workspaceId/report"
      params={{
        category: workspace?.category || '',
        workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
      }}
      search={(prev: QueryParams) => ({
        ...prev,
        reportCategory,
        latitude: 0,
        longitude: 0,
        zoom: 0,
        bivariateDataviews: null,
      })}
      onClick={handleOnClick}
    >
      <IconButton
        icon="analysis"
        type="border"
        size="medium"
        tooltip={t((t) => t.analysis.seeGlobal)}
        tooltipPlacement="top"
      />
    </Link>
  )
}

export default GlobalReportLink
