import { useDispatch, useSelector } from 'react-redux'
import { selectTimerange } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { setStaticTime } from './timebar.slice'

export const useTimerangeConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useDispatch()
  const { start, end } = useSelector(selectTimerange)
  // TODO needs to be debounced like viewport
  const dispatchTimeranges = (
    newStart: string,
    newEnd: string,
    _: unknown,
    __: unknown,
    source: string
  ) => {
    const range = { start: newStart, end: newEnd }
    if (source !== 'ZOOM_OUT_MOVE') {
      dispatch(setStaticTime(range))
    }
    dispatchQueryParams(range)
  }
  return { start, end, dispatchTimeranges }
}
