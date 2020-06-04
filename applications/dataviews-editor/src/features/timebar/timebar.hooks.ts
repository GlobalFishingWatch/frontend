import { useSelector, useDispatch } from 'react-redux'
import { selectTime, setTime } from './timebar.slice'

export const useTimeConnect = () => {
  const dispatch = useDispatch()
  const { start, end } = useSelector(selectTime)
  const dispatchTimerange = (newStart: string, newEnd: string) =>
    dispatch(setTime({ start: newStart, end: newEnd }))
  return { start, end, dispatchTimerange }
}
