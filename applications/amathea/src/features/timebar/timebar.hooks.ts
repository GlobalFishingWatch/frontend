import { useSelector } from 'react-redux'
import { selectTimerange } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export const useTimerangeConnect = () => {
  const { start, end } = useSelector(selectTimerange)
  const { dispatchQueryParams } = useLocationConnect()
  // TODO needs to be debounced like viewport
  const dispatchTimerange = (event: { start: string; end: string }) =>
    dispatchQueryParams({ start: event.start, end: event.end })
  return { start, end, dispatchTimerange }
}
