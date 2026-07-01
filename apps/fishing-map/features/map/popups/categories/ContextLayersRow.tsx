import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectFeatureFlags } from 'features/debug/debug.slice'
import { selectTrackCorrectionOpen } from 'features/track-correction/track-selection.selectors'
import { selectIsAnyReportLocation } from 'router/routes.selectors'
import { htmlSafeParse } from 'utils/html-parser'

import {
  useAreaInViewport,
  useAreaTooltipSparklineCategory,
  useFitAreaBounds,
} from './area-tooltip-timeseries.hooks'
import ContextLayerDownloadPopupButton from './ContextLayerDownloadPopupButton'
import ContextLayerReportLink from './ContextLayerReportLink'
import ContextLayerSparkline from './ContextLayerSparkline'

import styles from '../Popup.module.css'
import layerStyles from './ContextLayers.module.css'

type ContextLayersRowProps = {
  id: string
  label: string
  feature: ContextPickingObject | UserLayerPickingObject
  showFeaturesDetails: boolean
  showSparkline?: boolean
  showActions?: boolean
  linkHref?: string
  handleDownloadClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  handleReportClick?: (
    e: React.MouseEvent<Element, MouseEvent>,
    feature: ContextPickingObject | UserLayerPickingObject,
    layerSources?: string
  ) => void
}

const ContextLayersRow = ({
  id,
  label,
  showFeaturesDetails,
  showSparkline = false,
  linkHref,
  feature,
  handleDownloadClick,
  handleReportClick,
}: ContextLayersRowProps) => {
  const { t } = useTranslation()
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const { reportPreview } = useSelector(selectFeatureFlags)
  const { category, setPreferredCategory, canSwitch } = useAreaTooltipSparklineCategory()
  const { onClick: fitAreaBounds, loading: fitAreaLoading } = useFitAreaBounds(feature)
  const showSparklinePreview =
    reportPreview && showFeaturesDetails && showSparkline && !isAnyReportLocation
  const areaInViewport = useAreaInViewport(feature, showSparklinePreview)
  const renderSparkline = showSparklinePreview && areaInViewport === true

  const parsedLabel = htmlSafeParse(label)
  const showReport = handleReportClick && !isTrackCorrectionOpen
  return (
    <div
      className={cx(styles.row, {
        [layerStyles.rowColumnDetails]: showSparklinePreview,
      })}
      key={id}
    >
      <div className={layerStyles.rowHeader}>
        <span className={styles.rowText}>{parsedLabel}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            <IconButton
              icon="target"
              tooltip={t((t) => t.common.fitArea)}
              size="small"
              loading={fitAreaLoading}
              onClick={fitAreaBounds}
            />
            {!renderSparkline && showReport && (
              <ContextLayerReportLink feature={feature} onClick={handleReportClick} />
            )}
            {handleDownloadClick && (
              <ContextLayerDownloadPopupButton feature={feature} onClick={handleDownloadClick} />
            )}
            {linkHref && (
              <a target="_blank" rel="noopener noreferrer" href={linkHref}>
                <IconButton icon="info" tooltip={t((t) => t.common.learnMore)} size="small" />
              </a>
            )}
          </div>
        )}
      </div>
      {showSparklinePreview && (
        <div className={cx(layerStyles.sparklineReveal, { [layerStyles.open]: renderSparkline })}>
          <div className={layerStyles.sparklineRevealInner}>
            {renderSparkline && (
              <Fragment>
                <ContextLayerSparkline
                  feature={feature}
                  category={category}
                  canSwitch={canSwitch}
                  onSelectCategory={setPreferredCategory}
                />
                {showReport && (
                  <ContextLayerReportLink
                    feature={feature}
                    label={t((t) => t.analysis.showFullReport)}
                    reportCategory={category}
                    onClick={handleReportClick}
                  />
                )}
              </Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContextLayersRow
