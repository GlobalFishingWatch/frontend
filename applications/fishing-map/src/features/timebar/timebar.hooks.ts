import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { TimebarVisualisations } from 'types'
import { selectTimeRange, selectTimebarVisualisation } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectActiveTemporalgridDataviews,
  selectActiveVesselsDataviews,
} from 'features/workspace/workspace.selectors'
import { setStaticTime } from './timebar.slice'

export const useTimerangeConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useDispatch()
  const { start, end } = useSelector(selectTimeRange)
  // TODO needs to be debounced like viewport
  const dispatchTimeranges = useCallback(
    (event: { start: string; end: string; source: string }) => {
      const range = { start: event.start, end: event.end }
      if (event.source !== 'ZOOM_OUT_MOVE') {
        dispatch(setStaticTime(range))
      }
      dispatchQueryParams(range)
    },
    [dispatchQueryParams, dispatch]
  )
  return { start, end, dispatchTimeranges }
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
