import React from 'react'
import { useSelector } from 'react-redux'
import { formatInfoField, formatNumber } from 'utils/info'
import { Anchor } from 'mapbox-gl'
import { Popup } from '@globalfishingwatch/react-map-gl'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectTracksDatasets, selectVesselsDatasets } from 'features/workspace/workspace.selectors'
import { TooltipEvent, TooltipEventFeature } from '../map/map.hooks'
import styles from './Popup.module.css'

type PopupWrapper = {
  tooltipEvent: TooltipEvent
  closeButton?: boolean
  closeOnClick?: boolean
  className: string
  onClose?: () => void
  loading?: boolean
  anchor?: Anchor
}
function PopupWrapper({
  tooltipEvent,
  closeButton = false,
  closeOnClick = false,
  className,
  onClose,
  loading = false,
  anchor = undefined,
}: PopupWrapper) {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const trackDatasets = useSelector(selectTracksDatasets)
  const searchDatasets = useSelector(selectVesselsDatasets)
  const onVesselClick = (vessel: any, feature: TooltipEventFeature) => {
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
                {formatNumber(feature.value)} {feature.unit} hours
              </div>
              {loading && <Spinner />}
              {feature.vesselsInfo && (
                <div className={styles.vesselsTable}>
                  <div className={styles.vesselsHeader}>
                    <label className={styles.vesselsHeaderLabel}>Vessels</label>
                    <label className={styles.vesselsHeaderLabel}>Hours</label>
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
                        {formatInfoField(vessel.shipname, 'name') || vessel.id}
                      </span>
                      <span>{formatNumber(vessel.hours)}</span>
                    </button>
                  ))}
                  {feature.vesselsInfo.overflow && (
                    <div className={styles.vesselsMore}>
                      + {feature.vesselsInfo.numVessels - feature.vesselsInfo.vessels.length} more
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
