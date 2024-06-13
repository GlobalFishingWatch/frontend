import { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useMapHoverInteraction } from '@globalfishingwatch/deck-layer-composer'
import PopupWrapper from 'features/map/popups/PopupWrapper'
import { selectClickedEvent } from '../map.slice'
import { useClickedEventConnect } from '../map-interactions.hooks'
import styles from './Popup.module.css'
import PopupByCategory from './PopupByCategory'

function MapPopups() {
  const hoverInteraction = useMapHoverInteraction()
  const clickInteraction = useSelector(selectClickedEvent)
  const { dispatchClickedEvent, cancelPendingInteractionRequests } = useClickedEventConnect()

  const closePopup = useCallback(() => {
    // cleanFeatureState('click')
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
  }, [cancelPendingInteractionRequests, dispatchClickedEvent])

  return (
    <Fragment>
      {hoverInteraction && !clickInteraction?.features?.length && (
        <PopupWrapper
          latitude={hoverInteraction.latitude}
          longitude={hoverInteraction.longitude}
          className={styles.hover}
          showArrow={false}
          showClose={false}
        >
          <PopupByCategory interaction={hoverInteraction} type="hover" />
        </PopupWrapper>
      )}
      {clickInteraction && clickInteraction?.features?.length && (
        <PopupWrapper
          latitude={clickInteraction.latitude}
          longitude={clickInteraction.longitude}
          className={styles.click}
          onClose={closePopup}
        >
          <PopupByCategory interaction={clickInteraction} type="click" />
        </PopupWrapper>
      )}
    </Fragment>
  )
}

export default MapPopups
