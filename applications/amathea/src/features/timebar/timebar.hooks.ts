import { useSelector, useDispatch } from 'react-redux'
import { selectTimerange } from 'routes/routes.selectors'
import { updateQueryParams } from 'routes/routes.actions'

export const useTimerangeConnect = () => {
  const dispatch = useDispatch()
  const { start, end } = useSelector(selectTimerange)
  // TODO needs to be debounced like viewport
  const dispatchTimerange = (newStart: string, newEnd: string) =>
    dispatch(updateQueryParams({ start: newStart, end: newEnd }))
  return { start, end, dispatchTimerange }
}
