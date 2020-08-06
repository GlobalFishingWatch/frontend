import { useSelector } from 'react-redux'
import { selectTimerange } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export const useTimerangeConnect = () => {
  const { start, end } = useSelector(selectTimerange)
  const { dispatchQueryParams } = useLocationConnect()
  // TODO needs to be debounced like viewport
  const dispatchTimerange = (newStart: string, newEnd: string) =>
    dispatchQueryParams({ start: newStart, end: newEnd })
  return { start, end, dispatchTimerange }
}
