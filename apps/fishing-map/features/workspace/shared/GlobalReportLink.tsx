import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'

import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import type { ReportCategory } from 'features/reports/reports.types'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { WORKSPACE_REPORT } from 'routes/routes'

const GlobalReportLink = ({ reportCategory }: { reportCategory: ReportCategory }) => {
  const { t } = useTranslation()
  const workspace = useSelector(selectWorkspace)

  const reportLinkTo = {
    type: WORKSPACE_REPORT,
    payload: {
      category: workspace?.category,
      workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
    },
    query: {
      reportCategory,
    },
  }
  return (
    <Link to={reportLinkTo}>
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
