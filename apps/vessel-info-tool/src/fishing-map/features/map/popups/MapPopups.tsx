import { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'

import { useMapHoverInteraction } from '@globalfishingwatch/deck-layer-composer'
import { useDebounce } from '@globalfishingwatch/react-hooks'

import PopupWrapper from 'features/map/popups/PopupWrapper'

import { selectClickedEvent } from '../map.slice'
import { useClickedEventConnect } from '../map-interactions.hooks'

import PopupByCategory from './PopupByCategory'

import styles from './Popup.module.css'

const DEBOUNCED_TOOLTIP_DELAY = 300

function MapPopups() {
  const hoverInteraction = useMapHoverInteraction()
  const debouncedHoverLatitude = useDebounce(hoverInteraction.latitude, DEBOUNCED_TOOLTIP_DELAY)
  const debouncedHoverLongitude = useDebounce(hoverInteraction.longitude, DEBOUNCED_TOOLTIP_DELAY)
  const clickInteraction = useSelector(selectClickedEvent)
  const { dispatchClickedEvent, cancelPendingInteractionRequests } = useClickedEventConnect()

  const closePopup = useCallback(() => {
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
  }, [cancelPendingInteractionRequests, dispatchClickedEvent])

  return (
    <Fragment>
      {hoverInteraction &&
        !clickInteraction?.features?.length &&
        debouncedHoverLatitude === hoverInteraction.latitude &&
        debouncedHoverLongitude === hoverInteraction.longitude && (
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
