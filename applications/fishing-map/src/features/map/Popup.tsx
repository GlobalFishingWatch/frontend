import React from 'react'
import { Popup } from '@globalfishingwatch/react-map-gl'
import { WorkspaceDataviewConfig } from '@globalfishingwatch/dataviews-client'
import { TRACKS_DATASET_ID } from 'features/workspace/workspace.mock'
import { useDataviewsConfigConnect } from 'features/workspace/workspace.hook'
import { TooltipEvent, TooltipEventFeature } from '../map/map.hooks'
import styles from './Popup.module.css'

function PopupWrapper({
  tooltipEvent,
  closeButton = false,
  closeOnClick = false,
  className,
  onClose,
}: {
  tooltipEvent: TooltipEvent
  closeButton?: boolean
  closeOnClick?: boolean
  className: string
  onClose?: () => void
}) {
  const { updateDataviewConfig } = useDataviewsConfigConnect()
  const onVesselClick = (vessel: any) => {
    const dataviewConfig: WorkspaceDataviewConfig = {
      id: `track-${vessel.id}`,
      dataviewId: 2,
      datasetsConfig: [
        {
          datasetId: TRACKS_DATASET_ID,
          params: [{ id: 'vesselId', value: vessel.id }],
          endpoint: 'carriers-tracks',
        },
      ],
    }
    updateDataviewConfig(dataviewConfig)
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
            {feature.vesselsInfo && (
              <div>
                {feature.vesselsInfo.vessels.map((vessel, i) => (
                  <button
                    key={i}
                    className={styles.vessel}
                    onClick={() => {
                      onVesselClick(vessel)
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

export function ClickPopup({
  event,
  onClose,
}: {
  event: TooltipEvent | null
  onClose?: () => void
}) {
  if (event && event.features) {
    return (
      <PopupWrapper
        tooltipEvent={event}
        closeButton={true}
        closeOnClick={false}
        className={styles.click}
        onClose={onClose}
      />
    )
  }
  return null
}
