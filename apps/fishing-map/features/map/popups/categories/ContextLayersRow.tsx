import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import { useTranslation } from 'react-i18next'
import Link from 'redux-first-router-link'
import { Fragment } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import {
  selectActiveHeatmapDowloadDataviews,
  selectHasReportLayersVisible,
} from 'features/dataviews/selectors/dataviews.selectors'
import { getActivityDatasetsReportSupported } from 'features/datasets/datasets.utils'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { WORKSPACE_REPORT } from 'routes/routes'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import {
  selectLocationAreaId,
  selectLocationDatasetId,
  selectLocationQuery,
} from 'routes/routes.selectors'
import { selectSidebarOpen } from 'features/app/selectors/app.selectors'
import { getAreaIdFromFeature } from 'features/map/popups/categories/ContextLayers.hooks'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { resetReportData } from 'features/reports/activity/reports-activity.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  DEFAULT_BUFFER_OPERATION,
  DEFAULT_POINT_BUFFER_UNIT,
  DEFAULT_POINT_BUFFER_VALUE,
} from 'features/reports/areas/reports.config'
import { cleanCurrentWorkspaceReportState } from 'features/workspace/workspace.slice'
import styles from '../Popup.module.css'

interface DownloadPopupButtonProps {
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void
}
const DownloadPopupButton: React.FC<DownloadPopupButtonProps> = ({
  onClick,
}: DownloadPopupButtonProps) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const userData = useSelector(selectUserData)
  const activityDataviews = useSelector(selectActiveHeatmapDowloadDataviews)
  const hasAnalysableLayer = useSelector(selectHasReportLayersVisible)
  const datasetsReportAllowed = getActivityDatasetsReportSupported(
    activityDataviews,
    userData?.permissions || []
  )

  const datasetsReportSupported = datasetsReportAllowed?.length > 0
  return (
    <LoginButtonWrapper
      tooltip={t(
        'download.heatmapLogin',
        'Register and login to download activity, detections or environment data (free, 2 minutes)'
      )}
    >
      <IconButton
        icon="download"
        disabled={!guestUser && (!hasAnalysableLayer || !datasetsReportSupported)}
        testId="download-activity-layers"
        tooltip={
          datasetsReportSupported
            ? t('download.heatmapLayers', 'Download visible layers for this area')
            : t(
                'download.noHeatmapLayers',
                'Turn on an activity, detections or environment layer to download its data for this area'
              )
        }
        onClick={onClick}
        size="small"
      />
    </LoginButtonWrapper>
  )
}

interface ReportPopupButtonProps {
  feature: ContextPickingObject | UserLayerPickingObject
  onClick?: (
    e: React.MouseEvent<Element, MouseEvent>,
    feature: ContextPickingObject | UserLayerPickingObject
  ) => void
}

export const ReportPopupLink = ({ feature, onClick }: ReportPopupButtonProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasAnalysableLayer = useSelector(selectHasReportLayersVisible)
  const workspace = useSelector(selectWorkspace)
  const isSidebarOpen = useSelector(selectSidebarOpen)
  const isPointFeature = (feature?.geometry as any)?.type === 'Point'
  const query = useSelector(selectLocationQuery)
  // const bounds = getFeatureBounds(feature)
  const reportAreaDataset = useSelector(selectLocationDatasetId)
  const reportAreaId = useSelector(selectLocationAreaId)
  const areaId = getAreaIdFromFeature(feature)
  const isSameArea = reportAreaId?.toString() === areaId?.toString()
  const addAreaToReport = reportAreaDataset && reportAreaId && !isSameArea

  if (!hasAnalysableLayer || isSameArea) {
    return (
      <IconButton
        icon="analysis"
        disabled={!hasAnalysableLayer}
        size="small"
        tooltip={
          isSameArea
            ? ''
            : t(
                'common.analysisNotAvailable',
                'Toggle an activity or environment layer on to analyse in in this area'
              )
        }
      />
    )
  }
  const onReportClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: 'Open analysis panel',
      label: areaId as string,
    })
    resetSidebarScroll()
    dispatch(resetReportData())
    dispatch(cleanCurrentWorkspaceReportState())
    if (onClick) {
      onClick(e, feature)
    }
  }

  const reportLinkTo = {
    type: WORKSPACE_REPORT,
    payload: {
      category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
      workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
      datasetId: feature.datasetId,
      areaId,
    },
    query: {
      ...query,
      reportBufferUnit: isPointFeature ? DEFAULT_POINT_BUFFER_UNIT : undefined,
      reportBufferValue: isPointFeature ? DEFAULT_POINT_BUFFER_VALUE : undefined,
      reportBufferOperation: isPointFeature ? DEFAULT_BUFFER_OPERATION : undefined,
      // ...(bounds && { reportAreaBounds: bounds }),
      ...(!isSidebarOpen && { sidebarOpen: true }),
    },
  }

  const addReportLinkTo = {
    ...reportLinkTo,
    payload: {
      ...reportLinkTo.payload,
      datasetId: [reportAreaDataset, (feature as any).datasetId].join(','),
      areaId: [reportAreaId, areaId].join(','),
    },
  }

  return (
    <Fragment>
      <Link className={styles.workspaceLink} to={reportLinkTo} onClick={onReportClick}>
        <IconButton
          icon="analysis"
          tooltip={t('common.analysis', 'Create an analysis for this area')}
          testId="open-analysis"
          size="small"
        />
      </Link>
      {addAreaToReport && (
        <Link className={styles.workspaceLink} to={addReportLinkTo} onClick={onReportClick}>
          <IconButton
            icon="add-polygon-to-analysis"
            tooltip={t('common.analysisAddArea', 'Add area to the analysis')}
            testId="add-analysis"
            size="small"
          />
        </Link>
      )}
    </Fragment>
  )
}

interface ContextLayersRowProps {
  id: string
  label: string
  feature: ContextPickingObject | UserLayerPickingObject
  showFeaturesDetails: boolean
  showActions?: boolean
  linkHref?: string
  handleDownloadClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  handleReportClick?: (
    e: React.MouseEvent<Element, MouseEvent>,
    feature: ContextPickingObject | UserLayerPickingObject
  ) => void
}
const ContextLayersRow = ({
  id,
  label,
  showFeaturesDetails,
  linkHref,
  feature,
  handleDownloadClick,
  handleReportClick,
}: ContextLayersRowProps) => {
  const { t } = useTranslation()
  const parsedLabel = typeof label === 'string' ? parse(label) : label
  return (
    <div className={styles.row} key={id}>
      <span className={styles.rowText}>{parsedLabel}</span>
      {showFeaturesDetails && (
        <div className={styles.rowActions}>
          {handleDownloadClick && <DownloadPopupButton onClick={handleDownloadClick} />}
          <ReportPopupLink feature={feature} onClick={handleReportClick} />
          {linkHref && (
            <a target="_blank" rel="noopener noreferrer" href={linkHref}>
              <IconButton icon="info" tooltip={t('common.learnMore', 'Learn more')} size="small" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default ContextLayersRow
