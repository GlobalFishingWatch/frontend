import { useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { TimebarVisualisations } from 'types'
import { selectTimebarVisualisation } from 'routes/routes.selectors'
import { selectTimeRange } from 'features/timebar/timebar.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectActiveTemporalgridDataviews,
  selectActiveVesselsDataviews,
} from 'features/workspace/workspace.selectors'

export const useTimerangeConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const { start, end } = useSelector(selectTimeRange)
  // TODO needs to be debounced like viewport
  const dispatchTimerange = useCallback(
    (newStart: string, newEnd: string) => {
      dispatchQueryParams({ start: newStart, end: newEnd })
    },
    [dispatchQueryParams]
  )
  return { start, end, dispatchTimerange }
}

export const useTimebarVisualisation = () => {
  const activeHeatmapDataviews = useSelector(selectActiveTemporalgridDataviews)
  const activeVesselDataviews = useSelector(selectActiveVesselsDataviews)
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatchTimebarVisualisation = useCallback(
    (timebarVisualisation: TimebarVisualisations | undefined) => {
      dispatchQueryParams({ timebarVisualisation: timebarVisualisation })
    },
    [dispatchQueryParams]
  )

  // Automates the selection based on current active layers
  const getUpdatedTimebarVisualization = () => {
    if (activeHeatmapDataviews?.length) {
      return timebarVisualisation ? timebarVisualisation : TimebarVisualisations.Heatmap
    }
    if (activeVesselDataviews?.length) {
      return TimebarVisualisations.Vessel
    }
    return undefined
  }

  useEffect(() => {
    const newTimebarVisualisation = getUpdatedTimebarVisualization()
    if (newTimebarVisualisation !== timebarVisualisation) {
      dispatchTimebarVisualisation(newTimebarVisualisation)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHeatmapDataviews, activeVesselDataviews])

  return { timebarVisualisation, dispatchTimebarVisualisation }
}
