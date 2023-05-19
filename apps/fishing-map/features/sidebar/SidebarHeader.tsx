import { Fragment, useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Sticky from 'react-sticky-el'
import Link from 'redux-first-router-link'
import { IconButton, Logo, SubBrands } from '@globalfishingwatch/ui-components'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import {
  selectCurrentWorkspaceId,
  selectLastVisitedWorkspace,
  selectWorkspace,
  selectWorkspaceCustomStatus,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectIsReportLocation,
  selectIsWorkspaceLocation,
  selectLocationCategory,
  selectLocationPayload,
  selectLocationQuery,
  selectLocationType,
} from 'routes/routes.selectors'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { selectWorkspaceWithCurrentState, selectReadOnly } from 'features/app/app.selectors'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { resetSidebarScroll } from 'features/sidebar/Sidebar'
import useMapInstance from 'features/map/map-context.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { resetReportData } from 'features/reports/report.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectReportsStatus } from 'features/reports/reports.slice'
import { selectCurrentReport } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { HOME, REPORT, WORKSPACE } from 'routes/routes'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import { resetAreaDetail } from 'features/areas/areas.slice'
import { QueryParams } from 'types'
import { resetVesselState } from 'features/vessel/vessel.slice'
import { useClipboardNotification } from './sidebar.hooks'
import styles from './SidebarHeader.module.css'

const NewWorkspaceModal = dynamic(
  () =>
    import(
      /* webpackChunkName: "NewWorkspaceModal" */ 'features/workspace/shared/NewWorkspaceModal'
    )
)
const NewReportModal = dynamic(
  () => import(/* webpackChunkName: "NewWorkspaceModal" */ 'features/reports/NewReportModal')
)

function SaveReportButton() {
  const { t } = useTranslation()
  const workspace = useSelector(selectWorkspace)
  const report = useSelector(selectCurrentReport)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const reportStatus = useSelector(selectReportsStatus)
  const { dispatchLocation } = useLocationConnect()
  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()
  const [showReportCreateModal, setShowReportCreateModal] = useState(false)

  const onCloseCreateReport = useCallback(() => {
    setShowReportCreateModal(false)
  }, [])

  const onSaveCreateReport = useCallback(
    (report) => {
      copyToClipboard(window.location.href)
      dispatchLocation(REPORT, { payload: { reportId: report?.id } })
      onCloseCreateReport()
    },
    [copyToClipboard, dispatchLocation, onCloseCreateReport]
  )

  const onSaveClick = async () => {
    if (!showClipboardNotification) {
      setShowReportCreateModal(true)
    }
  }

  if (!workspace || workspaceStatus === AsyncReducerStatus.Loading) {
    return null
  }

  return (
    <Fragment>
      <LoginButtonWrapper tooltip={t('workspace.saveLogin', 'You need to login to save views')}>
        <IconButton
          icon={showClipboardNotification ? 'tick' : 'save'}
          size="medium"
          className="print-hidden"
          onClick={onSaveClick}
          loading={reportStatus === AsyncReducerStatus.Loading}
          tooltip={
            showClipboardNotification
              ? t(
                  'workspace.saved',
                  "The workspace was saved and it's available in your user profile"
                )
              : t('analysis.save', 'Save this report')
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

function SaveWorkspaceButton() {
  const [showWorkspaceCreateModal, setShowWorkspaceCreateModal] = useState(false)
  const { t } = useTranslation()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()
  const workspace = useSelector(selectWorkspace)
  const customWorkspace = useSelector(selectWorkspaceWithCurrentState)

  const onCloseCreateWorkspace = useCallback(() => {
    setShowWorkspaceCreateModal(false)
  }, [])

  const onSaveCreateWorkspace = useCallback(() => {
    copyToClipboard(window.location.href)
    onCloseCreateWorkspace()
  }, [copyToClipboard, onCloseCreateWorkspace])

  const onSaveClick = async () => {
    if (!showClipboardNotification) {
      setShowWorkspaceCreateModal(true)
    }
  }

  if (!workspace || workspaceStatus === AsyncReducerStatus.Loading) {
    return null
  }

  return (
    <Fragment>
      <LoginButtonWrapper tooltip={t('workspace.saveLogin', 'You need to login to save views')}>
        <IconButton
          icon={showClipboardNotification ? 'tick' : 'save'}
          size="medium"
          className="print-hidden"
          onClick={onSaveClick}
          loading={workspaceCustomStatus === AsyncReducerStatus.Loading}
          tooltip={
            showClipboardNotification
              ? t(
                  'workspace.saved',
                  "The workspace was saved and it's available in your user profile"
                )
              : t('workspace.save', 'Save this workspace')
          }
          tooltipPlacement="bottom"
        />
      </LoginButtonWrapper>
      {showWorkspaceCreateModal && (
        <NewWorkspaceModal
          isOpen={showWorkspaceCreateModal}
          onClose={onCloseCreateWorkspace}
          onFinish={onSaveCreateWorkspace}
          workspace={customWorkspace}
        />
      )}
    </Fragment>
  )
}

function ShareWorkspaceButton() {
  const { t } = useTranslation()
  const workspaceLocation = useSelector(selectIsWorkspaceLocation)
  const shareTitle = workspaceLocation
    ? t('common.share', 'Share map')
    : t('analysis.share', 'Share report')

  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()

  const onShareClick = useCallback(() => {
    copyToClipboard(window.location.href)
    trackEvent({
      category: workspaceLocation ? TrackCategory.WorkspaceManagement : TrackCategory.Analysis,
      action: `Click share ${workspaceLocation ? 'workspace' : 'report'}'}`,
    })
  }, [copyToClipboard, workspaceLocation])

  return (
    <IconButton
      icon={showClipboardNotification ? 'tick' : 'share'}
      size="medium"
      className="print-hidden"
      onClick={onShareClick}
      tooltip={
        showClipboardNotification
          ? t(
              'common.copiedToClipboard',
              'The link to share this view has been copied to your clipboard'
            )
          : shareTitle
      }
      tooltipPlacement="bottom"
    />
  )
}

function cleanReportPayload(payload: Record<string, any>) {
  const { areaId, datasetId, ...rest } = payload || {}
  return rest
}

function cleanReportQuery(query: QueryParams) {
  return {
    ...query,
    reportActivityGraph: undefined,
    reportAreaBounds: undefined,
    reportAreaSource: undefined,
    reportCategory: undefined,
    reportResultsPerPage: undefined,
    reportTimeComparison: undefined,
    reportVesselFilter: undefined,
    reportVesselGraph: undefined,
    reportVesselPage: undefined,
  }
}

function CloseReportButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const locationType = useSelector(selectLocationType)
  const locationQuery = useSelector(selectLocationQuery)
  const locationPayload = useSelector(selectLocationPayload)
  const workspaceId = useSelector(selectCurrentWorkspaceId)

  const { cleanFeatureState } = useFeatureState(useMapInstance())

  const onCloseClick = () => {
    resetSidebarScroll()
    cleanFeatureState('highlight')
    dispatch(resetReportData())
    dispatch(resetAreaDetail(reportAreaIds))
  }

  const linkTo = {
    type: locationType === REPORT || workspaceId === DEFAULT_WORKSPACE_ID ? HOME : WORKSPACE,
    payload: cleanReportPayload(locationPayload),
    query: cleanReportQuery(locationQuery),
  }

  return (
    <Link className={styles.workspaceLink} to={linkTo}>
      <IconButton
        icon="close"
        type="border"
        className="print-hidden"
        onClick={onCloseClick}
        tooltip={t('analysis.close', 'Close report and go back to workspace')}
      />
    </Link>
  )
}

function CloseSectionButton() {
  const lastVisitedWorkspace = useSelector(selectLastVisitedWorkspace)

  if (!lastVisitedWorkspace) {
    return null
  }

  return (
    <Link className={styles.workspaceLink} to={lastVisitedWorkspace}>
      <IconButton type="border" icon="close" />
    </Link>
  )
}

function SidebarHeader() {
  const readOnly = useSelector(selectReadOnly)
  const locationCategory = useSelector(selectLocationCategory)
  const workspaceLocation = useSelector(selectIsWorkspaceLocation)
  const reportLocation = useSelector(selectIsReportLocation)
  const showBackToWorkspaceButton = !workspaceLocation

  const getSubBrand = useCallback((): SubBrands | undefined => {
    let subBrand: SubBrands | undefined
    if (locationCategory === WorkspaceCategory.MarineManager) subBrand = SubBrands.MarineManager
    return subBrand
  }, [locationCategory])

  return (
    <Sticky scrollElement=".scrollContainer" stickyClassName={styles.sticky}>
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={getSubBrand()} />
        </a>
        {!readOnly && (
          <Fragment>
            {reportLocation && <SaveReportButton />}
            {workspaceLocation && <SaveWorkspaceButton />}
            {(workspaceLocation || reportLocation) && <ShareWorkspaceButton />}
            {reportLocation && <CloseReportButton />}
            {!reportLocation && showBackToWorkspaceButton && <CloseSectionButton />}
          </Fragment>
        )}
      </div>
    </Sticky>
  )
}

export default SidebarHeader
