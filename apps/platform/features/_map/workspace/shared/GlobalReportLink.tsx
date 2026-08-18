import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_ID } from 'data/map/workspaces'
import { resetSidebarScroll } from 'features/_map/sidebar/sidebar.utils'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import { useFitAreaInViewport } from 'features/_reports/report-area/area-reports.hooks'
import type { ReportCategory } from 'features/_reports/reports.types'
import { ROUTE_PATHS } from 'router/routes.utils'
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
      to={ROUTE_PATHS.WORKSPACE_REPORT}
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
