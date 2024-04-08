import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useMapHoverInteraction } from '@globalfishingwatch/deck-layer-composer'
import PopupWrapper from 'features/map/popups/PopupWrapper'
import { selectClickedEvent } from '../map.slice'

function MapPopups() {
  const hoverInteraction = useMapHoverInteraction()
  const clickInteraction = useSelector(selectClickedEvent)

  return (
    <Fragment>
      {hoverInteraction && <PopupWrapper interaction={hoverInteraction} type="hover" />}
      {clickInteraction && <PopupWrapper interaction={clickInteraction} type="click" />}
    </Fragment>
  )
}

export default MapPopups
