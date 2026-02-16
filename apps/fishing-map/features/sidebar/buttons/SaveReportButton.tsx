import { Fragment, lazy, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import { WORKSPACE_PUBLIC_ACCESS } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectCurrentReport } from 'features/reports/reports.selectors'
import { selectReportsStatus } from 'features/reports/reports.slice'
import { useClipboardNotification } from 'features/sidebar/sidebar.hooks'
import { selectWorkspace, selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { setWorkspace } from 'features/workspace/workspace.slice'
import LoginButtonWrapper from 'router/LoginButtonWrapper'
import { getCurrentAppUrl, ROUTE_PATHS } from 'router/routes.utils'
import { AsyncReducerStatus } from 'utils/async-slice'

const NewReportModal = lazy(
  () => import('features/reports/shared/new-report-modal/NewAreaReportModal')
)

function SaveReportButton() {
  const { t } = useTranslation()
  const workspace = useSelector(selectWorkspace)
  const dispatch = useAppDispatch()
  const report = useSelector(selectCurrentReport)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const reportStatus = useSelector(selectReportsStatus)
  const router = useRouter()
  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()
  const [showReportCreateModal, setShowReportCreateModal] = useState(false)

  const onCloseCreateReport = useCallback(() => {
    setShowReportCreateModal(false)
  }, [])

  const onSaveCreateReport = useCallback(
    (report: any) => {
      copyToClipboard(getCurrentAppUrl())
      router.navigate({
        to: ROUTE_PATHS.REPORT,
        params: {
          reportId: report?.id,
        },
        search: {},
        replace: true,
      })
      dispatch(setWorkspace(report.workspace))
      onCloseCreateReport()
    },
    [copyToClipboard, dispatch, router, onCloseCreateReport]
  )

  const onSaveClick = async () => {
    if (!showClipboardNotification) {
      setShowReportCreateModal(true)
    }
  }

  if (
    !workspace ||
    (workspace.viewAccess !== undefined && workspace.viewAccess !== WORKSPACE_PUBLIC_ACCESS) ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return null
  }

  return (
    <Fragment>
      <LoginButtonWrapper tooltip={t((t) => t.workspace.saveLogin)}>
        <IconButton
          icon={showClipboardNotification ? 'tick' : 'save'}
          size="medium"
          className="print-hidden"
          onClick={onSaveClick}
          loading={reportStatus === AsyncReducerStatus.Loading}
          tooltip={
            showClipboardNotification
              ? t((t) => t.workspace.saved, {
                  defaultValue: "The workspace was saved and it's available in your user profile",
                })
              : t((t) => t.analysis.save)
          }
          tooltipPlacement="bottom"
        />
      </LoginButtonWrapper>
      {showReportCreateModal && (
        <NewReportModal
          isOpen={showReportCreateModal}
          onClose={onCloseCreateReport}
          onFinish={onSaveCreateReport}
          report={report}
        />
      )}
    </Fragment>
  )
}

export default SaveReportButton
