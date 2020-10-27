import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formatInfoField, formatNumber } from 'utils/info'
import { Popup } from '@globalfishingwatch/react-map-gl'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectTracksDatasets, selectVesselsDatasets } from 'features/workspace/workspace.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEvent, TooltipEventFeature } from '../map/map.hooks'
import styles from './Popup.module.css'

// Translations by feature.unit static keys
// t('common.hour')

// Once this PR is merged
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/48853
// use import { Anchor } from 'mapbox-gl'
type ReactPopupAnchor =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

type PopupWrapper = {
  tooltipEvent: TooltipEvent
  closeButton?: boolean
  closeOnClick?: boolean
  className: string
  onClose?: () => void
  loading?: boolean
  anchor?: ReactPopupAnchor
}
function PopupWrapper({
  tooltipEvent,
  closeButton = false,
  closeOnClick = false,
  className,
  onClose,
  loading = false,
  anchor,
}: PopupWrapper) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const trackDatasets = useSelector(selectTracksDatasets)
  const searchDatasets = useSelector(selectVesselsDatasets)
  const onVesselClick = (vessel: { id: string }, feature: TooltipEventFeature) => {
    const trackDatasetByFeature = trackDatasets.filter((trackDataset) =>
      feature.dataset?.relatedDatasets?.some(
        (featureRelatedDataset) => featureRelatedDataset.id === trackDataset.id
      )
    )
    const searchDatasetByFeature = searchDatasets.filter((trackDataset) =>
      feature.dataset?.relatedDatasets?.some(
        (featureRelatedDataset) => featureRelatedDataset.id === trackDataset.id
      )
    )
    const vesselDataviewInstance = getVesselDataviewInstance(
      vessel,
      trackDatasetByFeature,
      searchDatasetByFeature
    )
    if (vesselDataviewInstance) {
      upsertDataviewInstance(vesselDataviewInstance)
    }
  }
  return (
    <Popup
      latitude={tooltipEvent.latitude}
      longitude={tooltipEvent.longitude}
      closeButton={closeButton}
      closeOnClick={closeOnClick}
      onClose={onClose}
      className={styles.popup}
      anchor={anchor}
    >
      <div className={className}>
        {tooltipEvent.features.map((feature: TooltipEventFeature, i: number) => (
          <div key={i} className={styles.popupSection}>
            <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
            <div className={styles.popupSectionContent}>
              <h3 className={styles.popupSectionTitle}>{feature.title}</h3>
              <div>
                <I18nNumber number={feature.value} />{' '}
                {t([`common.${feature.unit}`, 'common.hour'], 'hours', {
                  count: parseInt(feature.value), // neded to select the plural automatically
                })}
              </div>
              {loading && (
                <div className={styles.loading}>
                  <Spinner size="small" />
                </div>
              )}
              {feature.vesselsInfo && (
                <div className={styles.vesselsTable}>
                  <div className={styles.vesselsHeader}>
                    <label className={styles.vesselsHeaderLabel}>{t('common.vessel_plural')}</label>
                    <label className={styles.vesselsHeaderLabel}>{t('common.hour_plural')}</label>
                  </div>
                  {feature.vesselsInfo.vessels.map((vessel, i) => (
                    <button
                      key={i}
                      className={styles.vesselRow}
                      onClick={() => {
                        onVesselClick(vessel, feature)
                      }}
                    >
                      <span className={styles.vesselName}>
                        {vessel.shipname ? formatInfoField(vessel.shipname, 'name') : vessel.id}
                      </span>
                      <span>{formatNumber(vessel.hours)}</span>
                    </button>
                  ))}
                  {feature.vesselsInfo.overflow && (
                    <div className={styles.vesselsMore}>
                      + {feature.vesselsInfo.numVessels - feature.vesselsInfo.vessels.length}{' '}
                      {t('common.more')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Popup>
  )
}

export function HoverPopup({ event }: { event: TooltipEvent | null }) {
  if (event && event.features) {
    return <PopupWrapper tooltipEvent={event} className={styles.hover} anchor="top" />
  }
  return null
}

type ClickPopup = {
  event: TooltipEvent | null
  onClose?: () => void
  loading?: boolean
}

export function ClickPopup({ event, onClose, loading = false }: ClickPopup) {
  if (event && event.features) {
    return (
      <PopupWrapper
        tooltipEvent={event}
        closeButton={true}
        closeOnClick={false}
        className={styles.click}
        onClose={onClose}
        loading={loading}
      />
    )
  }
  return null
}
