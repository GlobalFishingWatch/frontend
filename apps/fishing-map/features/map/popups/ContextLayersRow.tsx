import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Link from 'redux-first-router-link'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  selectActiveHeatmapDataviews,
  selectHasReportLayersVisible,
} from 'features/dataviews/dataviews.selectors'
import { getActivityDatasetsReportSupported } from 'features/datasets/datasets.utils'
import { isGuestUser, selectUserData } from 'features/user/user.slice'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { REPORT } from 'routes/routes'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { selectLocationQuery } from 'routes/routes.selectors'
import { selectSidebarOpen } from 'features/app/app.selectors'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { getFeatureAreaId, getFeatureBounds } from 'features/map/popups/ContextLayers.hooks'
import { resetSidebarScroll } from 'features/sidebar/Sidebar'
import { resetReportData } from 'features/reports/reports.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import styles from './Popup.module.css'

interface DownloadPopupButtonProps {
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void
}
const DownloadPopupButton: React.FC<DownloadPopupButtonProps> = ({
  onClick,
}: DownloadPopupButtonProps) => {
  const { t } = useTranslation()
  const guestUser = useSelector(isGuestUser)
  const userData = useSelector(selectUserData)
  const activityDataviews = useSelector(selectActiveHeatmapDataviews)
  const hasAnalysableLayer = useSelector(selectHasReportLayersVisible)
  const datasetsReportAllowed = getActivityDatasetsReportSupported(
    activityDataviews,
    userData?.permissions || []
  )

  const datasetsReportSupported = datasetsReportAllowed?.length > 0
  return (
    <LoginButtonWrapper
      tooltip={t(
        'download.activityLogin',
        'Register and login to download activity (free, 2 minutes)'
      )}
    >
      <IconButton
        icon="download"
        disabled={!guestUser && (!hasAnalysableLayer || !datasetsReportSupported)}
        tooltip={
          datasetsReportSupported
            ? t('download.activityAction', 'Download visible activity layers for this area')
            : t('analysis.onlyAISAllowed', 'Only AIS datasets are allowed to download')
        }
        onClick={onClick}
        size="small"
      />
    </LoginButtonWrapper>
  )
}

interface ReportPopupButtonProps {
  feature: TooltipEventFeature
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
}

export const ReportPopupLink = ({ feature, onClick }: ReportPopupButtonProps) => {
  console.log('🚀 ~ ReportPopupLink ~ feature:', feature)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasAnalysableLayer = useSelector(selectHasReportLayersVisible)
  const workspace = useSelector(selectWorkspace)
  const isSidebarOpen = useSelector(selectSidebarOpen)
  const query = useSelector(selectLocationQuery)
  const bounds = getFeatureBounds(feature)
  if (!hasAnalysableLayer) {
    return (
      <IconButton
        icon="analysis"
        disabled={true}
        size="small"
        tooltip={t(
          'common.analysisNotAvailable',
          'Toggle an activity or environmenet layer on to analyse in in this area'
        )}
      />
    )
  }
  const handleReportClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: 'Open analysis panel',
      label: getFeatureAreaId(feature),
    })
    dispatch(resetReportData())
    onClick(e)
  }

  return (
    <Link
      className={styles.workspaceLink}
      to={{
        type: REPORT,
        payload: {
          category: workspace.category || WorkspaceCategories.FishingActivity,
          workspaceId: workspace.id || DEFAULT_WORKSPACE_ID,
          datasetId: feature.datasetId,
          areaId: getFeatureAreaId(feature),
        },
        query: {
          ...query,
          reportAreaSource: feature.source,
          ...(bounds && { reportAreaBounds: bounds }),
          ...(!isSidebarOpen && { sidebarOpen: true }),
        },
      }}
      onClick={handleReportClick}
    >
      <IconButton
        icon="analysis"
        tooltip={t('common.analysis', 'Create an analysis for this area')}
        size="small"
      />
    </Link>
  )
}

interface ContextLayersRowProps {
  id: string
  label: string
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
  showActions?: boolean
  linkHref?: string
  handleDownloadClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  handleReportClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
}
const ContextLayersRow: React.FC<ContextLayersRowProps> = ({
  id,
  label,
  showFeaturesDetails,
  linkHref,
  feature,
  handleDownloadClick,
  handleReportClick,
}: ContextLayersRowProps) => {
  const { t } = useTranslation()

  const reportClickFn = (e: React.MouseEvent<Element, MouseEvent>) => {
    resetSidebarScroll()
    handleReportClick(e)
  }
  return (
    <div className={styles.row} key={id}>
      <span className={styles.rowText}>{label}</span>
      {showFeaturesDetails && (
        <div className={styles.rowActions}>
          {handleDownloadClick && <DownloadPopupButton onClick={handleDownloadClick} />}
          <ReportPopupLink feature={feature} onClick={reportClickFn} />
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
