import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectTrackCorrectionOpen } from 'features/_vessels/track-correction/track-selection.selectors'
import { selectIsAnyReportLocation } from 'router/routes.selectors'
import { htmlSafeParse } from 'utils/html-parser'

import { selectClickedEvent } from '../../map.slice'

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

type ContextTooltipRowProps = {
  id: string
  label: string
  feature: ContextPickingObject | UserLayerPickingObject
  showFeaturesDetails: boolean
  isSingleArea?: boolean
  showActions?: boolean
  linkHref?: string
  handleDownloadClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  handleReportClick?: (
    e: React.MouseEvent<Element, MouseEvent>,
    feature: ContextPickingObject | UserLayerPickingObject,
    layerSources?: string
  ) => void
}

const ContextTooltipRow = ({
  id,
  label,
  showFeaturesDetails,
  isSingleArea = false,
  linkHref,
  feature,
  handleDownloadClick,
  handleReportClick,
}: ContextTooltipRowProps) => {
  const { t } = useTranslation()
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const { option, options, setPreferredCategory, canSwitchCategory, hasSparklineCategories } =
    useAreaTooltipSparklineCategory()
  const clickedFeatures = useSelector(selectClickedEvent)?.features
  const autoFitBounds = isSingleArea && showFeaturesDetails && clickedFeatures?.length === 1
  const { onClick: fitAreaBounds, loading: fitAreaLoading } = useFitAreaBounds(feature, {
    auto: autoFitBounds,
  })
  const showSparklinePreview =
    showFeaturesDetails && isSingleArea && !isAnyReportLocation && hasSparklineCategories
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
            {!autoFitBounds && (
              <IconButton
                icon="target"
                tooltip={t((t) => t.common.fitArea)}
                size="small"
                loading={fitAreaLoading}
                onClick={fitAreaBounds}
              />
            )}
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
                  option={option}
                  options={options}
                  canSwitch={canSwitchCategory}
                  onSelectCategory={setPreferredCategory}
                />
                {showReport && (
                  <ContextLayerReportLink
                    feature={feature}
                    label={t((t) => t.analysis.showFullReport)}
                    reportCategory={option.category}
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

export default ContextTooltipRow
