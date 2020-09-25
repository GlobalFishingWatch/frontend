import { useSelector } from 'react-redux'
import { selectTimerange } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export const useTimerangeConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const { start, end } = useSelector(selectTimerange)
  // TODO needs to be debounced like viewport
  const dispatchTimerange = (newStart: string, newEnd: string) =>
    dispatchQueryParams({ start: newStart, end: newEnd })
  return { start, end, dispatchTimerange }
}
