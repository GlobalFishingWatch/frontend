import { Fragment, useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Sticky from 'react-sticky-el'
import Link from 'redux-first-router-link'
import {
  Choice,
  ChoiceOption,
  IconButton,
  Logo,
  SubBrands,
} from '@globalfishingwatch/ui-components'
import { useFeatureState, useSmallScreen } from '@globalfishingwatch/react-hooks'
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
  selectIsSearchLocation,
  selectIsWorkspaceLocation,
  selectLocationCategory,
  selectLocationPayload,
  selectLocationQuery,
  selectLocationType,
} from 'routes/routes.selectors'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import {
  selectWorkspaceWithCurrentState,
  selectReadOnly,
  selectSearchOption,
  selectSearchQuery,
} from 'features/app/app.selectors'
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
import { EMPTY_FILTERS, IMO_LENGTH, SSVID_LENGTH, SearchType } from 'features/search/search.slice'
import { resetAreaDetail } from 'features/areas/areas.slice'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import { QueryParams } from 'types'
import { useSearchFiltersConnect } from 'features/search/search.hook'
import styles from './SidebarHeader.module.css'
import { useClipboardNotification } from './sidebar.hooks'

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

function SidebarHeader() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const locationCategory = useSelector(selectLocationCategory)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isSearchLocation = useSelector(selectIsSearchLocation)
  const isReportLocation = useSelector(selectIsReportLocation)
  const isSmallScreen = useSmallScreen()
  const lastVisitedWorkspace = useSelector(selectLastVisitedWorkspace)
  const activeSearchOption = useSelector(selectSearchOption)
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { dispatchQueryParams } = useLocationConnect()
  const searchQuery = useSelector(selectSearchQuery)
  const { searchFilters } = useSearchFiltersConnect()
  const showBackToWorkspaceButton = !isWorkspaceLocation

  const getSubBrand = useCallback((): SubBrands | undefined => {
    let subBrand: SubBrands | undefined
    if (locationCategory === WorkspaceCategory.MarineManager) subBrand = SubBrands.MarineManager
    return subBrand
  }, [locationCategory])

  const onCloseClick = () => {
    resetSidebarScroll()
    cleanFeatureState('highlight')
    dispatch(resetReportData())
  }

  const searchOptions: ChoiceOption<SearchType>[] = useMemo(() => {
    return [
      {
        id: 'basic' as SearchType,
        label: t('search.basic', 'Basic'),
      },
      {
        id: 'advanced' as SearchType,
        label: t('search.advanced', 'Advanced'),
      },
    ]
  }, [t])

  const onSearchOptionChange = (option: ChoiceOption<SearchType>) => {
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Toggle search type to filter results',
      label: option.id,
    })
    let additionalParams = {}
    if (option.id === 'advanced') {
      if (searchQuery?.length === SSVID_LENGTH && !isNaN(Number(searchQuery))) {
        additionalParams = { ssvid: searchQuery }
      } else if (searchQuery?.length === IMO_LENGTH && !isNaN(Number(searchQuery))) {
        additionalParams = { imo: searchQuery }
      } else {
        additionalParams = { query: searchQuery }
      }
    } else {
      if (searchQuery) {
        additionalParams = { query: searchQuery }
      } else if (searchFilters.ssvid) {
        additionalParams = { query: searchFilters.ssvid }
      } else if (searchFilters.imo) {
        additionalParams = { query: searchFilters.imo }
      }
    }
    dispatchQueryParams({ searchOption: option.id, ...EMPTY_FILTERS, ...additionalParams })
  }

  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={getSubBrand()} />
        </a>
        {isReportLocation && !readOnly && <SaveReportButton />}
        {isWorkspaceLocation && !readOnly && <SaveWorkspaceButton />}
        {(isWorkspaceLocation || isReportLocation) && !readOnly && <ShareWorkspaceButton />}
        {isReportLocation && !readOnly && <CloseReportButton />}
        {isSearchLocation && !readOnly && !isSmallScreen && (
          <Choice
            options={searchOptions}
            activeOption={activeSearchOption}
            onSelect={onSearchOptionChange}
            size="small"
            className={styles.searchOption}
          />
        )}
        {(isReportLocation || showBackToWorkspaceButton) && lastVisitedWorkspace && (
          <Link className={styles.workspaceLink} to={lastVisitedWorkspace} onClick={onCloseClick}>
            <IconButton type="border" icon="close" />
          </Link>
        )}
      </div>
    </Sticky>
  )
}

export default SidebarHeader
