import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import dynamic from 'next/dynamic'
import Link from 'redux-first-router-link'

import { WORKSPACE_PASSWORD_ACCESS, WORKSPACE_PUBLIC_ACCESS } from '@globalfishingwatch/api-types'
import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import {
  Choice,
  IconButton,
  Logo,
  Popover,
  SubBrands,
  Tooltip,
} from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { resetAreaDetail } from 'features/areas/areas.slice'
import { selectVesselProfileDataviewIntance } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectHasVesselProfileInstancePinned } from 'features/dataviews/selectors/dataviews.selectors'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { setModalOpen } from 'features/modals/modals.slice'
import { useHighlightReportArea } from 'features/reports/report-area/area-reports.hooks'
import { selectReportAreaIds } from 'features/reports/report-area/area-reports.selectors'
import ReportTitle from 'features/reports/report-area/title/ReportTitle'
import PortReportHeader from 'features/reports/report-port/PortReportHeader'
import { resetVesselGroupReportData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import VesselGroupReportTitle from 'features/reports/report-vessel-group/VesselGroupReportTitle'
import { selectCurrentReport } from 'features/reports/reports.selectors'
import { selectReportsStatus } from 'features/reports/reports.slice'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import type { SearchType } from 'features/search/search.config'
import { EMPTY_FILTERS, IMO_LENGTH, SSVID_LENGTH } from 'features/search/search.config'
import { selectSearchOption, selectSearchQuery } from 'features/search/search.config.selectors'
import { useSearchFiltersConnect } from 'features/search/search.hook'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import { getScrollElement, resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import UserButton from 'features/user/UserButton'
import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'
import { resetVesselState } from 'features/vessel/vessel.slice'
import VesselHeader from 'features/vessel/VesselHeader'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
  selectIsDefaultWorkspace,
  selectIsWorkspaceOwner,
  selectLastVisitedWorkspace,
  selectWorkspace,
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import {
  cleanCurrentWorkspaceReportState,
  cleanReportQuery,
} from 'features/workspace/workspace.slice'
import { isPrivateWorkspaceNotAllowed } from 'features/workspace/workspace.utils'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import type { ROUTE_TYPES } from 'routes/routes'
import { HOME, REPORT, WORKSPACE } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectFeatureFlags,
  selectIsAnyAreaReportLocation,
  selectIsAnyReportLocation,
  selectIsAnySearchLocation,
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsStandaloneReportLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspaceLocation,
  selectIsWorkspaceVesselLocation,
  selectLocationCategory,
  selectLocationPayload,
  selectLocationQuery,
  selectLocationType,
} from 'routes/routes.selectors'
import type { QueryParams } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import { useClipboardNotification } from './sidebar.hooks'

import styles from './SidebarHeader.module.css'

const NewReportModal = dynamic(
  () =>
    import(
      /* webpackChunkName: "NewWorkspaceModal" */ 'features/reports/shared/new-report-modal/NewAreaReportModal'
    )
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
    (report: any) => {
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

  if (
    !workspace ||
    (workspace.viewAccess !== undefined && workspace.viewAccess !== WORKSPACE_PUBLIC_ACCESS) ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
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
  const { t } = useTranslation()
  const workspace = useSelector(selectWorkspace)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const isDefaultWorkspace = useSelector(selectIsDefaultWorkspace)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)

  const isPassWordEditAccess = workspace?.editAccess === WORKSPACE_PASSWORD_ACCESS
  const canEditWorkspace = isWorkspaceOwner || isPassWordEditAccess

  const dispatch = useAppDispatch()
  const [saveWorkspaceTooltipOpen, setSaveWorkspaceTooltipOpen] = useState(false)

  const onSaveClick = () => {
    if (canEditWorkspace) {
      dispatch(setModalOpen({ id: 'editWorkspace', open: true }))
      dispatch(setModalOpen({ id: 'createWorkspace', open: false }))
      setSaveWorkspaceTooltipOpen(false)
    }
  }

  const onSaveAsClick = () => {
    dispatch(setModalOpen({ id: 'editWorkspace', open: false }))
    dispatch(setModalOpen({ id: 'createWorkspace', open: true }))
    setSaveWorkspaceTooltipOpen(false)
  }

  const onOpenChange = (open: boolean) => {
    setSaveWorkspaceTooltipOpen(open)
    if (!open) {
      dispatch(setModalOpen({ id: 'editWorkspace', open: false }))
      dispatch(setModalOpen({ id: 'createWorkspace', open: false }))
    }
  }

  if (
    !workspace ||
    isPrivateWorkspaceNotAllowed(workspace) ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return null
  }

  if (isDefaultWorkspace) {
    return (
      <LoginButtonWrapper tooltip={t('workspace.saveLogin', 'You need to login to save views')}>
        <IconButton
          icon="save"
          size="medium"
          className="print-hidden"
          onClick={onSaveAsClick}
          testId="save-workspace-button"
          tooltip={t('analysis.save', 'Save this report')}
          tooltipPlacement="bottom"
        />
      </LoginButtonWrapper>
    )
  }

  return (
    <Fragment>
      <Popover
        open={saveWorkspaceTooltipOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        showArrow={false}
        content={
          <ul>
            <Tooltip
              content={
                canEditWorkspace
                  ? t('workspace.save', 'Save this report')
                  : t('workspace.saveOwnerOnly', 'This workspace can only be edited by its creator')
              }
            >
              <li key="workspace-save">
                <button
                  className={cx(styles.groupOption, { [styles.disabled]: !canEditWorkspace })}
                  onClick={onSaveClick}
                >
                  {t('workspace.save', 'Save this report')}
                </button>
              </li>
            </Tooltip>
            <li key="workspace-save-as">
              <button className={styles.groupOption} onClick={onSaveAsClick}>
                {t('workspace.saveAs', 'Save this as a new workspace')}
              </button>
            </li>
          </ul>
        }
      >
        <div>
          <LoginButtonWrapper tooltip={t('workspace.saveLogin', 'You need to login to save views')}>
            <IconButton
              icon="save"
              size="medium"
              className="print-hidden"
              onClick={() => setSaveWorkspaceTooltipOpen(true)}
              tooltip={t('analysis.save', 'Save this report')}
              tooltipPlacement="bottom"
            />
          </LoginButtonWrapper>
        </div>
      </Popover>
    </Fragment>
  )

  // return (
  //   <Fragment>
  //     <LoginButtonWrapper tooltip={t('workspace.saveLogin', 'You need to login to save views')}>
  //       <IconButton
  //         icon={showClipboardNotification ? 'tick' : 'save'}
  //         size="medium"
  //         className="print-hidden"
  //         onClick={onSaveClick}
  //         loading={reportStatus === AsyncReducerStatus.Loading}
  //         tooltip={
  //           showClipboardNotification
  //             ? t(
  //                 'workspace.saved',
  //                 "The workspace was saved and it's available in your user profile"
  //               )
  //             : t('analysis.save', 'Save this report')
  //         }
  //         tooltipPlacement="bottom"
  //       />
  //     </LoginButtonWrapper>
  //     {showReportCreateModal && (
  //       <NewReportModal
  //         isOpen={showReportCreateModal}
  //         onClose={onCloseCreateReport}
  //         onFinish={onSaveCreateReport}
  //         report={report}
  //       />
  //     )}
  //   </Fragment>
  // )
}

function ShareWorkspaceButton() {
  const { t } = useTranslation()
  const location = useSelector(selectLocationType)

  const shareTitles: Partial<Record<ROUTE_TYPES, string>> = {
    HOME: t('common.share', 'Share map'),
    WORKSPACE: t('common.share', 'Share map'),
    REPORT: t('analysis.share', 'Share report'),
    WORKSPACE_REPORT: t('analysis.share', 'Share report'),
    VESSEL: t('vessel.share', 'Share vessel'),
    WORKSPACE_VESSEL: t('vessel.share', 'Share vessel'),
  }

  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()

  const onShareClick = useCallback(() => {
    const trackEventCategories: Partial<Record<ROUTE_TYPES, TrackCategory>> = {
      HOME: TrackCategory.WorkspaceManagement,
      WORKSPACE: TrackCategory.WorkspaceManagement,
      REPORT: TrackCategory.Analysis,
      WORKSPACE_REPORT: TrackCategory.Analysis,
      VESSEL: TrackCategory.VesselProfile,
      WORKSPACE_VESSEL: TrackCategory.VesselProfile,
    }
    const trackEventActions: Partial<Record<ROUTE_TYPES, string>> = {
      HOME: 'workspace',
      WORKSPACE: 'workspace',
      REPORT: 'report',
      WORKSPACE_REPORT: 'report',
      VESSEL: 'report',
      WORKSPACE_VESSEL: 'report',
    }
    copyToClipboard(window.location.href)
    trackEvent({
      category: trackEventCategories[location] as TrackCategory,
      action: `Click share ${trackEventActions[location]}'}`,
    })
  }, [copyToClipboard, location])

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
          : shareTitles[location]
      }
      tooltipPlacement="bottom"
    />
  )
}

function cleanReportPayload(payload: Record<string, any>) {
  const { areaId, datasetId, reportId, ...rest } = payload || {}
  return rest
}

function CloseReportButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const featureFlags = useSelector(selectFeatureFlags)
  const reportAreaIds = useSelector(selectReportAreaIds)
  const reportsStatus = useSelector(selectReportsStatus)
  const locationQuery = useSelector(selectLocationQuery)
  const locationPayload = useSelector(selectLocationPayload)
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const workspaceDataviewInstances = useSelector(selectWorkspaceDataviewInstances)
  const isStandaloneReportLocation = useSelector(selectIsStandaloneReportLocation)
  const highlightArea = useHighlightReportArea()
  const isReportLoading =
    isStandaloneReportLocation && reportsStatus !== AsyncReducerStatus.Finished

  const onCloseClick = () => {
    resetSidebarScroll()
    highlightArea(undefined)
    dispatch(resetReportData())
    dispatch(resetVesselGroupReportData())
    dispatch(resetAreaDetail(reportAreaIds))
    dispatch(cleanCurrentWorkspaceReportState())
  }

  const isWorkspaceRoute = workspaceId !== undefined && workspaceId !== DEFAULT_WORKSPACE_ID
  const isStandaloneReportCustomWorkspace =
    isStandaloneReportLocation && workspaceId !== DEFAULT_WORKSPACE_ID
  const linkTo = {
    type: isStandaloneReportCustomWorkspace || isWorkspaceRoute ? WORKSPACE : HOME,
    payload: {
      ...cleanReportPayload(locationPayload),
      ...((isStandaloneReportCustomWorkspace || isWorkspaceRoute) && {
        category: workspaceCategory,
        workspaceId,
      }),
    },
    query: {
      ...cleanReportQuery(locationQuery),
      ...(isStandaloneReportLocation && {
        dataviewInstances: workspaceDataviewInstances,
      }),
      featureFlags,
    },
  }

  if (isReportLoading) {
    return <IconButton icon="close" type="border" className="print-hidden" />
  }

  return (
    <Fragment>
      {!isAreaReportLocation && <ShareWorkspaceButton />}
      <Link className={styles.workspaceLink} to={linkTo}>
        <IconButton
          icon="close"
          type="border"
          className="print-hidden"
          onClick={onCloseClick}
          tooltip={t('analysis.close', 'Close report and go back to workspace')}
        />
      </Link>
    </Fragment>
  )
}

function CloseVesselButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const featureFlags = useSelector(selectFeatureFlags)
  const locationQuery = useSelector(selectLocationQuery)
  const locationPayload = useSelector(selectLocationPayload)
  const vesselDataviewInstance = useSelector(selectVesselProfileDataviewIntance)
  const hasVesselProfileInstancePinned = useSelector(selectHasVesselProfileInstancePinned)

  const linkTo = {
    type: WORKSPACE as ROUTE_TYPES,
    payload: locationPayload,
    query: {
      ...locationQuery,
      ...DEFAULT_VESSEL_STATE,
      featureFlags,
    } as QueryParams,
  }

  const resetState = () => {
    resetSidebarScroll()
    dispatch(resetVesselState())
  }

  const onCloseClick = () => {
    if (hasVesselProfileInstancePinned) {
      resetState()
    } else {
      // TODO: translate and review the content of this
      const { type, payload, query } = linkTo
      if (
        vesselDataviewInstance &&
        window.confirm(
          t('vessel.confirmationClose', 'Do you want to keep this vessel in your workspace?')
        ) === true
      ) {
        dispatch(
          updateLocation(type, {
            payload,
            query: {
              ...query,
              dataviewInstances: [...(query.dataviewInstances || []), vesselDataviewInstance],
            },
          })
        )
      } else {
        dispatch(updateLocation(type, { payload, query }))
      }
      resetState()
    }

    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'close_vessel_panel',
    })
  }

  if (!hasVesselProfileInstancePinned) {
    return (
      <IconButton
        icon="close"
        type="border"
        onClick={onCloseClick}
        className={cx(styles.workspaceLink, 'print-hidden')}
        tooltip={t('vessel.close', 'Close vessel and go back to workspace')}
      />
    )
  }

  return (
    <Link className={styles.workspaceLink} to={linkTo}>
      <IconButton
        icon="close"
        type="border"
        onClick={onCloseClick}
        className="print-hidden"
        tooltip={t('vessel.close', 'Close vessel and go back to workspace')}
      />
    </Link>
  )
}

function CloseSectionButton() {
  const dispatch = useAppDispatch()
  const lastVisitedWorkspace = useSelector(selectLastVisitedWorkspace)
  const { dispatchQueryParams } = useLocationConnect()
  const onCloseClick = useCallback(() => {
    dispatchQueryParams({ ...EMPTY_FILTERS, userTab: undefined })
    dispatch(cleanVesselSearchResults())
  }, [dispatch, dispatchQueryParams])

  if (!lastVisitedWorkspace) {
    return null
  }

  return (
    <Link className={styles.workspaceLink} to={lastVisitedWorkspace} onClick={onCloseClick}>
      <IconButton type="border" icon="close" />
    </Link>
  )
}

function SidebarHeader() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const [isSticky, setIsSticky] = useState(false)
  const locationCategory = useSelector(selectLocationCategory)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isSmallScreen = useSmallScreen(SMALL_PHONE_BREAKPOINT)
  const activeSearchOption = useSelector(selectSearchOption)
  const { dispatchQueryParams } = useLocationConnect()
  const searchQuery = useSelector(selectSearchQuery)
  const { searchFilters } = useSearchFiltersConnect()
  const showBackToWorkspaceButton = !isWorkspaceLocation
  const scrollElement = getScrollElement()

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (target?.scrollTop > 0) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollElement])

  const getSubBrand = useCallback((): SubBrands | undefined => {
    let subBrand: SubBrands | undefined
    if (locationCategory === WorkspaceCategory.MarineManager) subBrand = SubBrands.MarineManager
    return subBrand
  }, [locationCategory])

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
    dispatch(cleanVesselSearchResults())
    dispatchQueryParams({ searchOption: option.id, ...EMPTY_FILTERS, ...additionalParams })
  }

  const showCloseReportButton = isAnyReportLocation

  const sectionHeaderComponent = useMemo(() => {
    if (isAnyVesselLocation) {
      return <VesselHeader />
    }
    if (isAreaReportLocation) {
      return <ReportTitle isSticky={isSticky} />
    }
    if (isPortReportLocation) {
      return <PortReportHeader />
    }
    if (isVesselGroupReportLocation) {
      return <VesselGroupReportTitle />
    }
  }, [
    isAnyVesselLocation,
    isAreaReportLocation,
    isPortReportLocation,
    isSticky,
    isVesselGroupReportLocation,
  ])

  return (
    <div className={cx({ [styles.sticky]: isSticky })}>
      <div className={cx(styles.sidebarHeader)}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={getSubBrand()} />
        </a>
        {!readOnly && (
          <Fragment>
            {/* TODO:CVP2 add save report in isAnyReportLocation when this PR https://github.com/GlobalFishingWatch/api-monorepo-node/pull/289 is merged */}
            {isAreaReportLocation && <SaveReportButton />}
            {isWorkspaceLocation && <SaveWorkspaceButton />}
            {(isWorkspaceLocation || isAreaReportLocation || isAnyVesselLocation) && (
              <ShareWorkspaceButton />
            )}
            {isSmallScreen && <LanguageToggle className={styles.lngToggle} position="rightDown" />}
            {isSmallScreen && <UserButton className={styles.userButton} />}
            {showCloseReportButton && <CloseReportButton />}
            {isWorkspaceVesselLocation && <CloseVesselButton />}
            {isSearchLocation && !readOnly && !isSmallScreen && (
              <Choice
                options={searchOptions}
                activeOption={activeSearchOption}
                onSelect={onSearchOptionChange}
                size="small"
                className={styles.searchOption}
              />
            )}
            {!isAreaReportLocation &&
              !isWorkspaceVesselLocation &&
              !showCloseReportButton &&
              showBackToWorkspaceButton && <CloseSectionButton />}
          </Fragment>
        )}
      </div>
      {sectionHeaderComponent}
    </div>
  )
}

export default SidebarHeader
