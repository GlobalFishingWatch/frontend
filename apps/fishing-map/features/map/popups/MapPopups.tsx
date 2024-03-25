import { Fragment } from 'react'
import {
  useMapClickInteraction,
  useMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import PopupWrapper from 'features/map/popups/PopupWrapper'

function MapPopups() {
  const hoverInteraction = useMapHoverInteraction()
  const clickInteraction = useMapClickInteraction()
  return (
    <Fragment>
      {hoverInteraction && <PopupWrapper interaction={hoverInteraction} type="hover" />}
      {clickInteraction && <PopupWrapper interaction={clickInteraction} type="hover" />}
    </Fragment>
  )
}

export default MapPopups
