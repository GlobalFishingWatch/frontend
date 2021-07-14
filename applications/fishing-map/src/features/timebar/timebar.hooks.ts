import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import { TimebarVisualisations } from 'types'
import { selectTimebarVisualisation } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectActiveActivityDataviews,
  selectActiveTrackDataviews,
} from 'features/dataviews/dataviews.selectors'
import store, { RootState } from 'store'
import { updateUrlTimerange } from 'routes/routes.actions'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import {
  Range,
  changeSettings,
  setHighlightedEvent,
  selectHighlightedEvent,
  selectHasChangedSettingsOnce,
  selectHighlightedTime,
  disableHighlightedTime,
} from './timebar.slice'

export const TimeRangeAtom = atom<Range | null>({
  key: 'timerange',
  default: null,
  effects_UNSTABLE: [
    ({ trigger, setSelf, onSet }) => {
      const urlTimeRange = selectUrlTimeRange(store.getState() as RootState)
      const dispatch = useDispatch()

      if (trigger === 'get' && urlTimeRange) {
        setSelf({
          ...urlTimeRange,
        })
      }
      const updateTimerangeDebounced = debounce(dispatch(updateUrlTimerange), 1000)
      onSet((timerange) => {
        if (timerange) {
          updateTimerangeDebounced({ ...timerange })
        }
      })
    },
  ],
})

export const useTimerangeConnect = () => {
  const [timerange, setTimerange] = useRecoilState(TimeRangeAtom)

  const onTimebarChange = useCallback(
    (start: string, end: string) => {
      setTimerange({ start, end })
    },
    [setTimerange]
  )
  return useMemo(() => {
    return {
      start: timerange?.start,
      end: timerange?.end,
      timerange,
      setTimerange,
      onTimebarChange,
    }
  }, [onTimebarChange, timerange, setTimerange])
}

export const useDisableHighlightTimeConnect = () => {
  const highlightedTime = useSelector(selectHighlightedTime)
  const dispatch = useDispatch()

  const dispatchDisableHighlightedTime = useCallback(() => {
    if (highlightedTime !== undefined) {
      dispatch(disableHighlightedTime())
    }
  }, [dispatch, highlightedTime])

  return useMemo(
    () => ({
      highlightedTime,
      dispatchDisableHighlightedTime,
    }),
    [highlightedTime, dispatchDisableHighlightedTime]
  )
}

export const useHighlightEventConnect = () => {
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const dispatch = useDispatch()

  const dispatchHighlightedEvent = useCallback(
    (event: ApiEvent | undefined) => {
      dispatch(setHighlightedEvent(event))
    },
    [dispatch]
  )

  return useMemo(
    () => ({
      highlightedEvent,
      dispatchHighlightedEvent,
    }),
    [highlightedEvent, dispatchHighlightedEvent]
  )
}

export const useTimebarVisualisation = () => {
  const dispatch = useDispatch()
  const activeHeatmapDataviews = useSelector(selectActiveActivityDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)

  const { dispatchQueryParams } = useLocationConnect()
  const dispatchTimebarVisualisation = useCallback(
    (timebarVisualisation: TimebarVisualisations | undefined, automated = false) => {
      dispatchQueryParams({ timebarVisualisation: timebarVisualisation })
      if (!automated) {
        dispatch(changeSettings())
      }
    },
    [dispatchQueryParams, dispatch]
  )

  useEffect(() => {
    if (timebarVisualisation === TimebarVisualisations.Heatmap) {
      // fallback to vessels if heatmap = 0 (only if at least 1 vessel is available)
      if (
        (!activeHeatmapDataviews || activeHeatmapDataviews.length === 0) &&
        activeTrackDataviews?.length
      ) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHeatmapDataviews, activeTrackDataviews])

  useEffect(() => {
    if (timebarVisualisation !== TimebarVisualisations.Vessel) {
      // switch to vessel if track shown "for the first time"
      if (!hasChangedSettingsOnce && activeTrackDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      }
    } else {
      // fallback to heatmap if vessel = 0
      if (!activeTrackDataviews || activeTrackDataviews.length === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Heatmap, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrackDataviews, hasChangedSettingsOnce])

  return { timebarVisualisation, dispatchTimebarVisualisation }
}
