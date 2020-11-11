import React from 'react'
import cx from 'classnames'
import { Anchor } from 'mapbox-gl'
import { Popup } from '@globalfishingwatch/react-map-gl'
import { Generators } from '@globalfishingwatch/layer-composer'
import { TooltipEvent, TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'
import HeatmapTooltipRow from './HeatmapLayerRow'
import ContextTooltipRow from './ContextLayerRow'

type PopupWrapperProps = {
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
  anchor,
}: PopupWrapperProps) {
  return (
    <Popup
      latitude={tooltipEvent.latitude}
      longitude={tooltipEvent.longitude}
      closeButton={closeButton}
      closeOnClick={closeOnClick}
      onClose={onClose}
      className={cx(styles.popup, className)}
      anchor={anchor}
    >
      <div className={styles.content}>
        {tooltipEvent.features.map((feature: TooltipEventFeature, i: number) => {
          if (feature.type === Generators.Type.HeatmapAnimated) {
            return <HeatmapTooltipRow key={i} feature={feature} loading={loading} />
          }
          if (feature.type === Generators.Type.Context) {
            return <ContextTooltipRow key={i} feature={feature} />
          }
          return null
        })}
      </div>
    </Popup>
  )
}

export function HoverPopup({ event }: { event: TooltipEvent | null }) {
  if (event && event.features) {
    return <PopupWrapper tooltipEvent={event} className={styles.hover} anchor="top-left" />
  }
  return null
}

type ClickPopupProps = {
  event: TooltipEvent | null
  onClose?: () => void
  loading?: boolean
}

export function ClickPopup({ event, onClose, loading = false }: ClickPopupProps) {
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
