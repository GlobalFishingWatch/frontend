import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectTrackCorrectionOpen } from 'features/_vessels/track-correction/track-selection.selectors'
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

type ContextTooltipRowProps = {
  id: string
  label: string
  feature: ContextPickingObject | UserLayerPickingObject
  showFeaturesDetails: boolean
  canExpand?: boolean
  showFitArea?: boolean
  expanded?: boolean
  onToggleExpand?: () => void
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
  canExpand = false,
  showFitArea = true,
  expanded = false,
  onToggleExpand,
  linkHref,
  feature,
  handleDownloadClick,
  handleReportClick,
}: ContextTooltipRowProps) => {
  const { t } = useTranslation()
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)
  const { option, options, setPreferredCategory, canSwitchCategory } =
    useAreaTooltipSparklineCategory()
  const { onClick: fitAreaBounds, loading: fitAreaLoading } = useFitAreaBounds(feature)
  const [panelMounted, setPanelMounted] = useState(expanded)
  if (expanded && !panelMounted) {
    setPanelMounted(true)
  }
  const areaInViewport = useAreaInViewport(feature, canExpand && panelMounted)

  const parsedLabel = htmlSafeParse(label)
  const showReport = handleReportClick && !isTrackCorrectionOpen
  return (
    <div
      className={cx(styles.row, styles.popupSectionRow, {
        [layerStyles.rowColumnDetails]: canExpand,
      })}
      key={id}
    >
      <div className={layerStyles.rowHeader}>
        {canExpand ? (
          <button type="button" className={layerStyles.labelToggle} onClick={onToggleExpand}>
            <span className={styles.rowText}>{parsedLabel}</span>
          </button>
        ) : (
          <span className={styles.rowText}>{parsedLabel}</span>
        )}
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            {/* the report shortcut stays in the header so the feature is discoverable without
                opening the row; target / download / info move into the footer */}
            {!canExpand && showFitArea && (
              <IconButton
                icon="target"
                tooltip={t((t) => t.common.fitArea)}
                size="small"
                loading={fitAreaLoading}
                onClick={fitAreaBounds}
              />
            )}
            {!expanded && showReport && (
              <ContextLayerReportLink feature={feature} onClick={handleReportClick} />
            )}
            {!canExpand && handleDownloadClick && (
              <ContextLayerDownloadPopupButton feature={feature} onClick={handleDownloadClick} />
            )}
            {!canExpand && linkHref && (
              <a target="_blank" rel="noopener noreferrer" href={linkHref}>
                <IconButton icon="info" tooltip={t((t) => t.common.learnMore)} size="small" />
              </a>
            )}
            {canExpand && (
              <IconButton
                icon={expanded ? 'section-collapse' : 'section-expand'}
                tooltip={t((t) => (expanded ? t.common.collapseSection : t.common.expandSection))}
                size="small"
                onClick={onToggleExpand}
              />
            )}
          </div>
        )}
      </div>
      {canExpand && (
        <div
          className={cx(layerStyles.sparklineReveal, { [layerStyles.open]: expanded })}
          onTransitionEnd={() => !expanded && setPanelMounted(false)}
        >
          <div className={layerStyles.sparklineRevealInner}>
            {panelMounted && (
              <Fragment>
                <div className={layerStyles.subCard}>
                  {areaInViewport === true ? (
                    <ContextLayerSparkline
                      feature={feature}
                      option={option}
                      options={options}
                      canSwitch={canSwitchCategory}
                      onSelectCategory={setPreferredCategory}
                    />
                  ) : (
                    <button
                      type="button"
                      className={layerStyles.zoomPrompt}
                      disabled={fitAreaLoading}
                      onClick={fitAreaBounds}
                    >
                      {t((t) => t.analysis.zoomToAreaForActivity)}
                    </button>
                  )}
                  <div className={layerStyles.rowFooter}>
                    <IconButton
                      icon="target"
                      tooltip={t((t) => t.common.fitArea)}
                      size="small"
                      loading={fitAreaLoading}
                      onClick={fitAreaBounds}
                    />
                    {handleDownloadClick && (
                      <ContextLayerDownloadPopupButton
                        feature={feature}
                        size="small"
                        onClick={handleDownloadClick}
                      />
                    )}
                    {linkHref && (
                      <a target="_blank" rel="noopener noreferrer" href={linkHref}>
                        <IconButton
                          icon="info"
                          tooltip={t((t) => t.common.learnMore)}
                          size="small"
                        />
                      </a>
                    )}
                    {showReport && (
                      <ContextLayerReportLink
                        feature={feature}
                        label={t((t) => t.analysis.showFullReport)}
                        reportCategory={option.category}
                        onClick={handleReportClick}
                      />
                    )}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContextTooltipRow
