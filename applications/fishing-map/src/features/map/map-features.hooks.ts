import { useSelector, useDispatch } from 'react-redux'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import { setClickedEvent, selectClickedFeatures } from './map-features.slice'

export const useClickedEventConnect = () => {
  const dispatch = useDispatch()
  const clickedFeatures = useSelector(selectClickedFeatures)
  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    dispatch(setClickedEvent(event))
  }
  return { clickedFeatures, dispatchClickedEvent }
}
