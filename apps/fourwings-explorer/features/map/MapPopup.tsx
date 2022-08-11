import cx from 'classnames'
import { Popup, PopupProps } from 'react-map-gl'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import styles from './MapPopup.module.css'

type MapPopupProps = Partial<PopupProps> & {
  event?: InteractionEvent
}
function MapPopup({
  event,
  closeButton = false,
  closeOnClick = false,
  className = '',
  onClose,
  anchor,
}: MapPopupProps) {
  if (!event || !event.latitude || !event.longitude || !event.features?.length) return null
  return (
    <Popup
      latitude={event.latitude}
      longitude={event.longitude}
      closeButton={closeButton}
      closeOnClick={closeOnClick}
      onClose={onClose}
      className={cx(styles.popup, className)}
      anchor={anchor}
      focusAfterOpen={false}
      maxWidth="600px"
    >
      {event.features.map((feature) => (
        <div className={styles.popupSection}>
          <div className={styles.row}>
            <span className={styles.rowText}>{feature.value}</span>
          </div>
        </div>
      ))}
    </Popup>
  )
}

export default MapPopup
