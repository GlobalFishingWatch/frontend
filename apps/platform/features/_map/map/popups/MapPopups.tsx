import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { useMapHoverInteraction } from '@globalfishingwatch/deck-layer-composer'
import { HOVER_DEBOUNCE_DELAY } from '@globalfishingwatch/deck-layers/config'
import { useDebounce } from '@globalfishingwatch/react-hooks'

import { getSafeElementById } from 'utils/dom'

import { selectClickedEvent } from '../map.slice'
import { useClickedEventConnect } from '../map-interactions.hooks'
import { MAP_CONTAINER_ID } from '../map-viewport.hooks'

import PopupByCategory from './PopupByCategory'
import PopupWrapper from './PopupWrapper'

import styles from './Popup.module.css'

function MapPopups() {
  const hoverInteraction = useMapHoverInteraction()
  const debouncedHoverLatitude = useDebounce(hoverInteraction.latitude, HOVER_DEBOUNCE_DELAY)
  const debouncedHoverLongitude = useDebounce(hoverInteraction.longitude, HOVER_DEBOUNCE_DELAY)
  const clickInteraction = useSelector(selectClickedEvent)
  const { dispatchClickedEvent, cancelPendingInteractionRequests } = useClickedEventConnect()

  const closePopup = useCallback(() => {
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
  }, [cancelPendingInteractionRequests, dispatchClickedEvent])

  const onClickOutside = useCallback(
    (e?: MouseEvent) => {
      const mapContainer = getSafeElementById(MAP_CONTAINER_ID)
      if (e && !mapContainer?.contains(e.target as Node)) {
        dispatchClickedEvent(null)
        cancelPendingInteractionRequests()
      }
    },
    [cancelPendingInteractionRequests, dispatchClickedEvent]
  )

  return (
    <div translate="no" className="notranslate">
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
          onClickOutside={onClickOutside}
        >
          <PopupByCategory interaction={clickInteraction} type="click" />
        </PopupWrapper>
      )}
    </div>
  )
}

export default MapPopups
