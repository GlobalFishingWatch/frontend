import React from 'react'
import { useSelector } from 'react-redux'
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
}
function PopupWrapper({
  tooltipEvent,
  closeButton = false,
  closeOnClick = false,
  className,
  onClose,
  loading = false,
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
      anchor="top"
    >
      <div className={`${styles.popup} ${className}`}>
        {tooltipEvent.features.map((feature: TooltipEventFeature, i: number) => (
          <div key={i} className={styles.popupSection}>
            <h3>
              <span
                className={styles.popupSectionColor}
                style={{ backgroundColor: feature.color }}
              />
              {feature.title}
            </h3>
            <div>
              {Math.round(parseFloat(feature.value))} {feature.unit} h total
            </div>
            {loading && <Spinner />}
            {feature.vesselsInfo && (
              <div>
                {feature.vesselsInfo.vessels.map((vessel, i) => (
                  <button
                    key={i}
                    className={styles.vessel}
                    onClick={() => {
                      onVesselClick(vessel, feature)
                    }}
                  >
                    {Math.round(vessel.hours)} hours: {vessel.id}
                  </button>
                ))}
                {feature.vesselsInfo.overflow && (
                  <div>{feature.vesselsInfo.numVessels} vessels found, zoom in to inspect more</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Popup>
  )
}

export function HoverPopup({ event }: { event: TooltipEvent | null }) {
  if (event && event.features) {
    return <PopupWrapper tooltipEvent={event} className={styles.hover} />
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
