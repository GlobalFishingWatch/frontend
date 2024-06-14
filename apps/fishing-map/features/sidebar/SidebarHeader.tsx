import { Fragment, useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import cx from 'classnames'
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
  Tooltip,
} from '@globalfishingwatch/ui-components'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { WORKSPACE_PASSWORD_ACCESS, WORKSPACE_PUBLIC_ACCESS } from '@globalfishingwatch/api-types'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
  selectIsDefaultWorkspace,
  selectLastVisitedWorkspace,
  selectWorkspace,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { cleanCurrentWorkspaceStateBufferParams } from 'features/workspace/workspace.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectIsAnySearchLocation,
  selectIsAnyReportLocation,
  selectIsWorkspaceLocation,
  selectLocationCategory,
  selectLocationPayload,
  selectLocationQuery,
  selectLocationType,
  selectIsWorkspaceVesselLocation,
  selectIsAnyVesselLocation,
} from 'routes/routes.selectors'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectSearchOption, selectSearchQuery } from 'features/search/search.config.selectors'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { resetReportData } from 'features/reports/report.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectReportsStatus } from 'features/reports/reports.slice'
import { selectCurrentReport } from 'features/app/selectors/app.reports.selector'
import { useLocationConnect } from 'routes/routes.hook'
import { HOME, REPORT, ROUTE_TYPES, WORKSPACE } from 'routes/routes'
import { EMPTY_FILTERS, IMO_LENGTH, SSVID_LENGTH, SearchType } from 'features/search/search.config'
import { resetAreaDetail } from 'features/areas/areas.slice'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import { QueryParams } from 'types'
import { useSearchFiltersConnect } from 'features/search/search.hook'
import { resetVesselState } from 'features/vessel/vessel.slice'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import UserButton from 'features/user/UserButton'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'
import { isPrivateWorkspaceNotAllowed } from 'features/workspace/workspace.utils'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import { useHighlightReportArea } from 'features/map/popups/categories/ContextLayers.hooks'
import { useClipboardNotification } from './sidebar.hooks'
import styles from './SidebarHeader.module.css'

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
  const userData = useSelector(selectUserData)
  const isDefaultWorkspace = useSelector(selectIsDefaultWorkspace)

  const isOwnerWorkspace = workspace?.ownerId === userData?.id
  const isPassWordEditAccess = workspace?.editAccess === WORKSPACE_PASSWORD_ACCESS
  const canEditWorkspace = isOwnerWorkspace || isPassWordEditAccess

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

  const onClickOutside = () => {
    setSaveWorkspaceTooltipOpen(false)
    dispatch(setModalOpen({ id: 'editWorkspace', open: false }))
    dispatch(setModalOpen({ id: 'createWorkspace', open: false }))
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
          tooltip={t('analysis.save', 'Save this report')}
          tooltipPlacement="bottom"
        />
      </LoginButtonWrapper>
    )
  }

  return (
    <Fragment>
      <TooltipContainer
        visible={saveWorkspaceTooltipOpen}
        onClickOutside={onClickOutside}
        placement="bottom"
        arrowClass={styles.arrow}
        component={
          <ul>
            <Tooltip
              content={
                canEditWorkspace
                  ? t('workspace.save', 'Save this report')
                  : t('workspace.saveOwnerOnly', 'This workspace can only be edited by its creator')
              }
            >
              <li
                className={cx(styles.groupOption, { [styles.disabled]: !canEditWorkspace })}
                onClick={onSaveClick}
                key="workspace-save"
              >
                {t('workspace.save', 'Save this report')}
              </li>
            </Tooltip>
            <li className={styles.groupOption} onClick={onSaveAsClick} key="workspace-save-as">
              {t('workspace.saveAs', 'Save this as a new workspace')}
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
      </TooltipContainer>
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
  const { areaId, datasetId, ...rest } = payload || {}
  return rest
}

function cleanReportQuery(query: QueryParams) {
  return {
    ...query,
    reportActivityGraph: undefined,
    reportAreaBounds: undefined,
    reportCategory: undefined,
    reportResultsPerPage: undefined,
    reportTimeComparison: undefined,
    reportVesselFilter: undefined,
    reportVesselGraph: undefined,
    reportVesselPage: undefined,
    reportBufferUnit: undefined,
    reportBufferValue: undefined,
    reportBufferOperation: undefined,
  }
}

function CloseReportButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const locationQuery = useSelector(selectLocationQuery)
  const locationPayload = useSelector(selectLocationPayload)
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const highlightArea = useHighlightReportArea()

  const onCloseClick = () => {
    resetSidebarScroll()
    highlightArea(undefined)
    dispatch(resetReportData())
    dispatch(resetAreaDetail(reportAreaIds))
    dispatch(cleanCurrentWorkspaceStateBufferParams())
  }

  const isWorkspaceRoute = workspaceId !== DEFAULT_WORKSPACE_ID
  const linkTo = {
    type: isWorkspaceRoute ? WORKSPACE : HOME,
    payload: {
      ...cleanReportPayload(locationPayload),
      ...(isWorkspaceRoute && { category: workspaceCategory, workspaceId }),
    },
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

function CloseVesselButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const locationQuery = useSelector(selectLocationQuery)
  const locationPayload = useSelector(selectLocationPayload)

  const onCloseClick = () => {
    resetSidebarScroll()
    dispatch(resetVesselState())

    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'close_vessel_panel',
    })
  }

  const linkTo = {
    type: WORKSPACE,
    payload: locationPayload,
    query: {
      ...locationQuery,
      ...DEFAULT_VESSEL_STATE,
    },
  }

  return (
    <Link className={styles.workspaceLink} to={linkTo}>
      <IconButton
        icon="close"
        type="border"
        className="print-hidden"
        onClick={onCloseClick}
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
  const locationCategory = useSelector(selectLocationCategory)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isReportLocation = useSelector(selectIsAnyReportLocation)
  const isVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isSmallScreen = useSmallScreen()
  const activeSearchOption = useSelector(selectSearchOption)
  const { dispatchQueryParams } = useLocationConnect()
  const searchQuery = useSelector(selectSearchQuery)
  const { searchFilters } = useSearchFiltersConnect()
  const showBackToWorkspaceButton = !isWorkspaceLocation

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

  return (
    <Sticky
      scrollElement=".scrollContainer"
      wrapperClassName={styles.sidebarHeaderContainer}
      stickyClassName={styles.sticky}
    >
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={getSubBrand()} />
        </a>
        {!readOnly && (
          <Fragment>
            {isReportLocation && <SaveReportButton />}
            {isWorkspaceLocation && <SaveWorkspaceButton />}
            {(isWorkspaceLocation || isReportLocation || isAnyVesselLocation) && (
              <ShareWorkspaceButton />
            )}
            {isSmallScreen && <LanguageToggle className={styles.lngToggle} position="rightDown" />}
            {isSmallScreen && <UserButton className={styles.userButton} />}
            {isReportLocation && <CloseReportButton />}
            {isVesselLocation && <CloseVesselButton />}
            {isSearchLocation && !readOnly && !isSmallScreen && (
              <Choice
                options={searchOptions}
                activeOption={activeSearchOption}
                onSelect={onSearchOptionChange}
                size="small"
                className={styles.searchOption}
              />
            )}
            {!isReportLocation && !isVesselLocation && showBackToWorkspaceButton && (
              <CloseSectionButton />
            )}
          </Fragment>
        )}
      </div>
    </Sticky>
  )
}

export default SidebarHeader
