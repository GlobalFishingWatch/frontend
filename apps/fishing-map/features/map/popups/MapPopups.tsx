import { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useMapHoverInteraction } from '@globalfishingwatch/deck-layer-composer'
import PopupWrapper from 'features/map/popups/PopupWrapper'
import { selectClickedEvent } from '../map.slice'
import { useClickedEventConnect } from '../map-interactions.hooks'

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
        <PopupWrapper interaction={hoverInteraction} type="hover" />
      )}
      {clickInteraction && (
        <PopupWrapper interaction={clickInteraction} type="click" onClose={closePopup} />
      )}
    </Fragment>
  )
}

export default MapPopups
