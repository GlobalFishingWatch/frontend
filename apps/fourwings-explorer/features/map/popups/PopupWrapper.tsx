import cx from 'classnames'
import type { PopupProps } from 'react-map-gl';
import { Popup } from 'react-map-gl'
import type { InteractionEvent } from '@globalfishingwatch/layer-composer';
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import ContextPopup from 'features/map/popups/ContextPopup'
import styles from './Popup.module.css'

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
      {event.features.map((feature) => {
        if (feature.generatorType === GeneratorType.Polygons) {
          return <ContextPopup feature={feature} />
        }
        return (
          <div className={styles.popupSection} key={`${feature.id}-${feature.value}`}>
            <div className={styles.row}>
              <span className={styles.rowText}>{feature.value}</span>
            </div>
          </div>
        )
      })}
    </Popup>
  )
}

export default MapPopup
