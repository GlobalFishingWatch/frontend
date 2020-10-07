import React from 'react'
import { Popup } from '@globalfishingwatch/react-map-gl'
import styles from './Popup.module.css'
import { TooltipEvent, TooltipEventFeature } from './map-features.hooks'

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
              {feature.value} {feature.unit}
            </div>
            {feature.vesselsInfo && (
              <div>
                {feature.vesselsInfo.vessels.map((vessel, i) => (
                  <button
                    key={i}
                    className={styles.vessel}
                    onClick={() => {
                      window.alert(vessel)
                    }}
                  >
                    {vessel}
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
