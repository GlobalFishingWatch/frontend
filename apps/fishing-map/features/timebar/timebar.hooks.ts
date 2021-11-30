import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { DEFAULT_CALLBACK_URL_KEY } from '@globalfishingwatch/react-hooks'
import { TimebarVisualisations } from 'types'
import { selectTimebarVisualisation } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectActiveActivityDataviews } from 'features/dataviews/dataviews.selectors'
import store, { RootState } from 'store'
import { updateUrlTimerange } from 'routes/routes.actions'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import { setHintDismissed } from 'features/help/hints/hints.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
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
      const redirectUrl =
        typeof window !== undefined ? window.localStorage.getItem(DEFAULT_CALLBACK_URL_KEY) : null
      const urlTimeRange = selectUrlTimeRange(store.getState() as RootState)
      const dispatch = useDispatch()

      if (trigger === 'get') {
        if (urlTimeRange) {
          setSelf({
            ...urlTimeRange,
          })
        } else if (redirectUrl) {
          try {
            // Workaround to get start and end date from redirect url as the
            // location reducer isn't ready until initialDispatch
            const url = new URL(JSON.parse(redirectUrl))
            const start = url.searchParams.get('start')
            const end = url.searchParams.get('end')
            if (start && end) {
              setSelf({ start, end })
            }
          } catch (e: any) {
            console.warn(e)
          }
        }
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
  const dispatch = useDispatch()

  const onTimebarChange = useCallback(
    (start: string, end: string) => {
      if (start !== timerange?.start || end !== timerange.end) {
        dispatch(setHintDismissed('changingTheTimeRange'))
      }
      setTimerange({ start, end })
    },
    [dispatch, setTimerange, timerange?.end, timerange?.start]
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

export const useTimebarVisualisationConnect = () => {
  const dispatch = useDispatch()
  const timebarVisualisation = useSelector(selectTimebarVisualisation)

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

  return { timebarVisualisation, dispatchTimebarVisualisation }
}

// Used to automate the behave depending on vessels or activity state
// should be instanciated only once to avoid doing it more than needed
export const useTimebarVisualisation = () => {
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const activeHeatmapDataviews = useSelector(selectActiveActivityDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)

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
