import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import { isGFWUser } from 'features/user/user.slice'
import { selectHasAnalysisLayersVisible } from 'features/dataviews/dataviews.selectors'
import styles from './Popup.module.css'

interface ContextLayersRowProps {
  id: string
  label: string
  showFeaturesDetails: boolean
  showActions?: boolean
  linkHref?: string
  handleDownloadClick: (e: React.MouseEvent<Element, MouseEvent>) => void
  handleReportClick: (e: React.MouseEvent<Element, MouseEvent>) => void
}
const ContextLayersRow: React.FC<ContextLayersRowProps> = ({
  id,
  label,
  showFeaturesDetails,
  linkHref,
  handleDownloadClick,
  handleReportClick,
}: ContextLayersRowProps) => {
  const gfwUser = useSelector(isGFWUser)
  const { t } = useTranslation()
  const hasAnalysableLayer = useSelector(selectHasAnalysisLayersVisible)
  return (
    <div className={styles.row} key={id}>
      <span className={styles.rowText}>{label}</span>
      {showFeaturesDetails && (
        <div className={styles.rowActions}>
          {gfwUser && (
            <IconButton
              icon="download"
              disabled={!hasAnalysableLayer}
              tooltip={t(
                'download.activityAction',
                'Download visible activity layers for this area'
              )}
              onClick={handleDownloadClick}
              size="small"
            />
          )}
          <IconButton
            icon="report"
            disabled={!hasAnalysableLayer}
            tooltip={
              hasAnalysableLayer
                ? t('common.analysis', 'Create an analysis for this area')
                : t(
                    'common.analysisNotAvailable',
                    'Toggle an activity or environmenet layer on to analyse in in this area'
                  )
            }
            onClick={handleReportClick}
            size="small"
          />
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
