import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { createSelector } from 'reselect'
import { TimebarVisualisations } from 'types'
import { selectTimebarVisualisation } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectActiveActivityDataviews,
  selectActiveTrackDataviews,
} from 'features/dataviews/dataviews.selectors'
import { DEFAULT_TIME_RANGE } from 'data/config'
import store, { RootState } from 'store'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import { selectWorkspaceTimeRange } from 'features/workspace/workspace.selectors'
import { selectHasChangedSettingsOnce, changeSettings, Range } from './timebar.slice'

interface TimeRangeAtomData extends Range {
  internalRange: Range
}

const selectTimeRange = createSelector(
  [selectUrlTimeRange, selectWorkspaceTimeRange],
  ({ start, end }, workspaceTimerange) => {
    console.log(start, workspaceTimerange.start)
    return {
      start: start || workspaceTimerange?.start || DEFAULT_TIME_RANGE.start,
      end: end || workspaceTimerange?.end || DEFAULT_TIME_RANGE.end,
    } as Range
  }
)

export const TimeRangeAtom = atom<Range>({
  key: 'timerange',
  default: DEFAULT_TIME_RANGE,
  effects_UNSTABLE: [
    ({ trigger, setSelf, onSet }) => {
      // const dispatch = useDispatch()
      const timerange = selectTimeRange(store.getState() as RootState)
      const { dispatchQueryParams } = useLocationConnect()

      if (trigger === 'get') {
        console.log(timerange)
        // if (timerange.start) {
        //   setSelf({
        //     start: (timerange as Range).start,
        //     end: (timerange as Range).end,
        //   })
        // }
      }

      const updateTimerangeDebounced = debounce(dispatchQueryParams, 1000)

      onSet((timerange) => {
        updateTimerangeDebounced({
          start: (timerange as Range).start,
          end: (timerange as Range).end,
        })
      })
    },
  ],
})

export const useTimerangeConnect = () => {
  const [timerange, setTimerange] = useRecoilState(TimeRangeAtom)

  const onTimebarChange = useCallback(
    (event: { start: string; end: string; source: string }) => {
      if (event.source !== 'ZOOM_OUT_MOVE') {
        setTimerange(event)
      }
    },
    [setTimerange]
  )
  return useMemo(() => {
    const { start, end } = timerange
    return { start, end, timerange, setTimerange, onTimebarChange }
  }, [onTimebarChange, timerange, setTimerange])
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
