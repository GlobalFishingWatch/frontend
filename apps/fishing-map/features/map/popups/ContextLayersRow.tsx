import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  selectActiveActivityDataviews,
  selectHasAnalysisLayersVisible,
} from 'features/dataviews/dataviews.selectors'
import { getDatasetsDownloadSupported } from 'features/datasets/datasets.utils'
import { isGuestUser, selectUserData } from 'features/user/user.slice'
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
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const hasAnalysableLayer = useSelector(selectHasAnalysisLayersVisible)
  const datasetsReportAllowed = getDatasetsDownloadSupported(
    activityDataviews,
    userData?.permissions || []
  )
  const datasetsReportSupported = datasetsReportAllowed?.length > 0
  let tooltip = t('download.activityAction', 'Download visible activity layers for this area')
  if (!datasetsReportSupported) {
    tooltip = t('analysis.onlyAISAllowed', 'Only AIS datasets are allowed to download')
  } else if (guestUser) {
    tooltip = t(
      'download.downloadActivityLogin',
      'Register and login to download activity (free, 2 minutes)'
    )
  }
  return (
    <IconButton
      icon="download"
      disabled={!hasAnalysableLayer || !datasetsReportSupported || guestUser}
      tooltip={tooltip}
      onClick={onClick}
      size="small"
    />
  )
}

interface ReportPopupButtonProps {
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void
}
const ReportPopupButton: React.FC<ReportPopupButtonProps> = ({
  onClick,
}: ReportPopupButtonProps) => {
  const { t } = useTranslation()
  const hasAnalysableLayer = useSelector(selectHasAnalysisLayersVisible)
  return (
    <IconButton
      icon="analysis"
      disabled={!hasAnalysableLayer}
      tooltip={
        hasAnalysableLayer
          ? t('common.analysis', 'Create an analysis for this area')
          : t(
              'common.analysisNotAvailable',
              'Toggle an activity or environmenet layer on to analyse in in this area'
            )
      }
      onClick={onClick}
      size="small"
    />
  )
}

interface ContextLayersRowProps {
  id: string
  label: string
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
  handleDownloadClick,
  handleReportClick,
}: ContextLayersRowProps) => {
  return (
    <div className={styles.row} key={id}>
      <span className={styles.rowText}>{label}</span>
      {showFeaturesDetails && (
        <div className={styles.rowActions}>
          {handleDownloadClick && <DownloadPopupButton onClick={handleDownloadClick} />}
          {handleReportClick && <ReportPopupButton onClick={handleReportClick} />}
          {linkHref && (
            <a target="_blank" rel="noopener noreferrer" href={linkHref}>
              <IconButton icon="info" tooltip="See more" size="small" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default ContextLayersRow
