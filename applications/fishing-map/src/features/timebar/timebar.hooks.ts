import { useSelector } from 'react-redux'
import { TimebarVisualisations } from 'types'
import { selectTimebarVisualisation, selectTimerange } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectActiveTemporalgridDataviews } from 'features/workspace/workspace.selectors'

export const useTimerangeConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const { start, end } = useSelector(selectTimerange)
  // TODO needs to be debounced like viewport
  const dispatchTimerange = (newStart: string, newEnd: string) =>
    dispatchQueryParams({ start: newStart, end: newEnd })
  return { start, end, dispatchTimerange }
}

export const useTimebarVisualisation = () => {
  const activeHeatmapDataviews = useSelector(selectActiveTemporalgridDataviews)
  const currentVis = useSelector(selectTimebarVisualisation)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatchTimebarVisualisation = (timebarVisualisation: TimebarVisualisations) => {
    dispatchQueryParams({ timebarVisualisation })
  }
  const timebarVisualisation = activeHeatmapDataviews?.length === 0 ? 'vessel' : currentVis
  return { timebarVisualisation, dispatchTimebarVisualisation }
}
