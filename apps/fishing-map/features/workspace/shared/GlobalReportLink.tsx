import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'

import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import type { ReportCategory } from 'features/reports/reports.types'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { WORKSPACE_REPORT } from 'routes/routes'
import { selectLocationQuery } from 'routes/routes.selectors'

const GlobalReportLink = ({ reportCategory }: { reportCategory: ReportCategory }) => {
  const { t } = useTranslation()
  const workspace = useSelector(selectWorkspace)
  const query = useSelector(selectLocationQuery)
  const fitAreaInViewport = useFitAreaInViewport()

  const reportLinkTo = {
    type: WORKSPACE_REPORT,
    payload: {
      category: workspace?.category,
      workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
    },
    query: {
      ...query,
      reportCategory,
      latitude: 0,
      longitude: 0,
      zoom: 0,
    },
  }

  const handleOnClick = () => {
    fitAreaInViewport()
    resetSidebarScroll()
  }

  return (
    <Link to={reportLinkTo} onClick={handleOnClick}>
      <IconButton
        icon="analysis"
        type="border"
        size="medium"
        tooltip={t('analysis.see', 'See report')}
        tooltipPlacement="top"
      />
    </Link>
  )
}

export default GlobalReportLink
