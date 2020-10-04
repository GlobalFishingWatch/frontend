import { useSelector, useDispatch } from 'react-redux'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import { setClickedEvent, selectClickedEvent } from './map-features.slice'

export const useClickedEventConnect = () => {
  const dispatch = useDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    dispatch(setClickedEvent(event))
  }
  return { clickedEvent, dispatchClickedEvent }
}
