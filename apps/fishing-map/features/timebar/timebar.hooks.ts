import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { debounce } from 'es-toolkit'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { DateTimeUnit } from 'luxon'

import { deckHoverInteractionAtom } from '@globalfishingwatch/deck-layer-composer'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { usePrevious } from '@globalfishingwatch/react-hooks'
import { EVENT_SOURCE } from '@globalfishingwatch/timebar'

import { DEFAULT_TIME_RANGE } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectTimebarGraph,
  selectTimebarSelectedEnvId,
  selectTimebarSelectedUserId,
  selectTimebarSelectedVGId,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveEventsDataviews,
  selectActiveUserPointsWithTimeRangeDataviews,
  selectActiveVesselGroupDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectActiveHeatmapEnvironmentalDataviewsWithoutStatic } from 'features/dataviews/selectors/dataviews.selectors'
import { selectHintsDismissed, setHintDismissed } from 'features/help/hints.slice'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { TimebarGraphs } from 'types'
import { TimebarVisualisations } from 'types'
import { getUTCDateTime } from 'utils/dates'

import type { TimeRange } from './timebar.slice'
import {
  disableHighlightedTime,
  selectHasChangedSettingsOnce,
  selectHighlightedEvents,
  selectHighlightedTime,
  selectHoveredHighlightedEvents,
  setHasChangedSettings,
  setHighlightedEvents,
} from './timebar.slice'

const isValidISODate = (value: string) => !isNaN(Date.parse(value))

const getTimerangeFromUrl = (locationUrl = window.location.toString()) => {
  try {
    const url = new URL(locationUrl)
    const start = url.searchParams.get('start')
    const end = url.searchParams.get('end')
    if (start && end) {
      const decodedStart = decodeURIComponent(start)
      const decodedEnd = decodeURIComponent(end)
      if (isValidISODate(decodedStart) && isValidISODate(decodedEnd)) {
        return { start: decodedStart, end: decodedEnd }
      }
    }
  } catch (e) {
    console.warn(e)
  }
}
export const timerangeState = atom(DEFAULT_TIME_RANGE)
timerangeState.onMount = (setAtom) => {
  // Initializing the atom with the url value until the workspace loads
  const urlTimerange = getTimerangeFromUrl()
  if (urlTimerange) {
    return setAtom(urlTimerange)
  }
}

const TIMERANGE_URL_DEBOUNCE = 300

export const useSetTimerange = () => {
  const setAtomTimerange = useSetAtom(timerangeState)
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const hintsDismissed = useSelector(selectHintsDismissed)
  const isWorkspaceMapReady = useSelector(selectIsWorkspaceReady)

  // Debounce the URL write so we only navigate once the user stops scrubbing the
  // timebar, instead of firing a full router.navigate() on every frame (navigation storm).
  const debouncedReplace = useMemo(
    () =>
      debounce((timerange: TimeRange) => {
        replaceQueryParams(timerange)
      }, TIMERANGE_URL_DEBOUNCE),
    [replaceQueryParams]
  )

  useEffect(() => () => debouncedReplace.cancel(), [debouncedReplace])

  const setTimerange = useCallback(
    (timerange: TimeRange, stickToInterval = true) => {
      let stuckTimerange = timerange
      if (stickToInterval) {
        const interval = getFourwingsInterval(
          timerange.start,
          timerange.end
        ).toLowerCase() as DateTimeUnit
        const stickToClosestInterval = (date: string, unit: DateTimeUnit) => {
          const mDate = getUTCDateTime(date)
          const mStartOf = mDate.startOf(unit)
          const mEndOf = mDate.endOf(unit).plus({ millisecond: 1 })
          const startDeltaMs = mDate.valueOf() - mStartOf.valueOf()
          const endDeltaMs = mEndOf.valueOf() - mDate.valueOf()
          return (startDeltaMs > endDeltaMs ? mEndOf : mStartOf).toISO() as string
        }
        const newStart = stickToClosestInterval(timerange.start, interval)
        let newEnd = stickToClosestInterval(timerange.end, interval)
        if (newStart === newEnd) {
          newEnd = getUTCDateTime(newStart)
            .plus({ [interval]: 1 })
            .toISO() as string
        }
        const minEnd = getUTCDateTime(newStart).plus({ hours: 24 })
        if (getUTCDateTime(newEnd) < minEnd) {
          newEnd = minEnd.toISO() as string
        }
        stuckTimerange = { start: newStart, end: newEnd }
      }
      setAtomTimerange((timerangeAtom) => {
        if (
          (stuckTimerange.start !== timerangeAtom?.start ||
            stuckTimerange.end !== timerangeAtom.end) &&
          !hintsDismissed?.changingTheTimeRange
        ) {
          dispatch(setHintDismissed('changingTheTimeRange'))
        }
        return stuckTimerange
      })
      if (isWorkspaceMapReady) {
        debouncedReplace(stuckTimerange)
      }
    },
    [
      debouncedReplace,
      dispatch,
      hintsDismissed?.changingTheTimeRange,
      isWorkspaceMapReady,
      setAtomTimerange,
    ]
  )

  return setTimerange
}

export const useTimerangeConnect = () => {
  const timerangeAtom = useAtomValue(timerangeState)
  const setTimerange = useSetTimerange()

  const onTimebarChange = useCallback(
    (start: string, end: string, source?: string) => {
      const isMove =
        source === EVENT_SOURCE.SEEK_MOVE ||
        source === EVENT_SOURCE.ZOOM_OUT_MOVE ||
        source === EVENT_SOURCE.PLAYBACK_FRAME
      setTimerange({ start, end }, !isMove)
    },
    [setTimerange]
  )

  return useMemo(() => {
    return {
      start: timerangeAtom?.start as string,
      end: timerangeAtom?.end as string,
      timerange: timerangeAtom,
      setTimerange,
      onTimebarChange,
    }
  }, [onTimebarChange, timerangeAtom, setTimerange])
}

export const useDisableHighlightTimeConnect = () => {
  const highlightedTime = useSelector(selectHighlightedTime)
  const dispatch = useAppDispatch()

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

export const useHighlightedEventsConnect = () => {
  const highlightedEvents = useSelector(selectHighlightedEvents)
  const hoveredEvents = useSelector(selectHoveredHighlightedEvents)
  const hoverEvent = useAtomValue(deckHoverInteractionAtom)
  const dispatch = useAppDispatch()

  const hoveredEventsRef = useRef(hoveredEvents)

  // eslint-disable-next-line react-hooks/refs
  hoveredEventsRef.current = hoveredEvents

  const dispatchHighlightedEvents = useCallback(
    (eventIds: string[] | undefined) => {
      const current = hoveredEventsRef.current || []
      const next = eventIds || []
      const hasChanged =
        current.length !== next.length || current.some((id, index) => id !== next[index])
      if (hasChanged) {
        dispatch(setHighlightedEvents(eventIds))
      }
    },
    [dispatch]
  )

  const highlightedEventIds = [
    ...(highlightedEvents || []),
    ...(hoverEvent.features || []).map((f) => f.id),
  ]
  const serializedHighlightedEventIds = highlightedEventIds.join('')

  return useMemo(() => {
    return {
      highlightedEventIds,
      dispatchHighlightedEvents,
    }
  }, [serializedHighlightedEventIds, dispatchHighlightedEvents])
}

export const useTimebarVisualisationConnect = () => {
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)
  const dispatchTimebarVisualisation = useCallback(
    (newTimebarVisualisation: TimebarVisualisations | undefined, automated = false) => {
      if (timebarVisualisation !== newTimebarVisualisation) {
        replaceQueryParams({ timebarVisualisation: newTimebarVisualisation })
      }
      if (!automated && !hasChangedSettingsOnce) {
        dispatch(setHasChangedSettings())
      }
    },
    [timebarVisualisation, hasChangedSettingsOnce, dispatch]
  )

  return useMemo(
    () => ({ timebarVisualisation, dispatchTimebarVisualisation }),
    [dispatchTimebarVisualisation, timebarVisualisation]
  )
}

export const useTimebarEnvironmentConnect = () => {
  const { replaceQueryParams } = useReplaceQueryParams()
  const timebarSelectedEnvId = useSelector(selectTimebarSelectedEnvId)

  const dispatchTimebarSelectedEnvId = useCallback((timebarSelectedEnvId: string) => {
    replaceQueryParams({ timebarSelectedEnvId })
  }, [])

  return useMemo(
    () => ({
      timebarSelectedEnvId,
      dispatchTimebarSelectedEnvId,
    }),
    [dispatchTimebarSelectedEnvId, timebarSelectedEnvId]
  )
}

export const useTimebarUserPointsConnect = () => {
  const { replaceQueryParams } = useReplaceQueryParams()
  const timebarSelectedUserId = useSelector(selectTimebarSelectedUserId)

  const dispatchTimebarSelectedUserId = useCallback((timebarSelectedUserId: string) => {
    replaceQueryParams({ timebarSelectedUserId })
  }, [])

  return useMemo(
    () => ({
      timebarSelectedUserId,
      dispatchTimebarSelectedUserId,
    }),
    [timebarSelectedUserId, dispatchTimebarSelectedUserId]
  )
}

export const useTimebarVesselGroupConnect = () => {
  const { replaceQueryParams } = useReplaceQueryParams()
  const timebarSelectedVGId = useSelector(selectTimebarSelectedVGId)

  const dispatchTimebarSelectedVGId = useCallback((timebarSelectedVGId: string) => {
    replaceQueryParams({ timebarSelectedVGId })
  }, [])

  return useMemo(
    () => ({ timebarSelectedVGId, dispatchTimebarSelectedVGId }),
    [dispatchTimebarSelectedVGId, timebarSelectedVGId]
  )
}

export const useTimebarGraphConnect = () => {
  const { replaceQueryParams } = useReplaceQueryParams()
  const timebarGraph = useSelector(selectTimebarGraph)
  const dispatchTimebarGraph = useCallback((timebarGraph: TimebarGraphs) => {
    replaceQueryParams({ timebarGraph })
  }, [])

  return useMemo(
    () => ({
      timebarGraph,
      dispatchTimebarGraph,
    }),
    [dispatchTimebarGraph, timebarGraph]
  )
}

// Used to automate the behave depending on vessels or activity state
// should be instanciated only once to avoid doing it more than needed
export const useTimebarVisualisation = () => {
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const activeActivityDataviews = useSelector(selectActiveActivityDataviews)
  const activeDetectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const activeEventsDataviews = useSelector(selectActiveEventsDataviews)
  const activeVesselGroupDataviews = useSelector(selectActiveVesselGroupDataviews)
  const activeUserPointsDataviews = useSelector(selectActiveUserPointsWithTimeRangeDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeEnvDataviews = useSelector(selectActiveHeatmapEnvironmentalDataviewsWithoutStatic)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)

  // const prevTimebarVisualisation = usePrevious(timebarVisualisation)
  const prevActiveHeatmapDataviewsNum = usePrevious(activeActivityDataviews.length)
  const prevActiveDetectionsDataviewsNum = usePrevious(activeDetectionsDataviews.length)
  const prevActiveVesselGroupDataviewsNum = usePrevious(activeVesselGroupDataviews.length)
  const prevActiveUserPointsDataviewsNum = usePrevious(activeUserPointsDataviews.length)
  const prevActiveTrackDataviewsNum = usePrevious(activeTrackDataviews.length)
  const prevactiveEnvDataviewsNum = usePrevious(activeEnvDataviews.length)
  const prevActiveEventsDataviewsNum = usePrevious(activeEventsDataviews.length)
  useEffect(() => {
    // Fallback mechanism to avoid empty timebar
    if (
      (timebarVisualisation === TimebarVisualisations.HeatmapActivity &&
        !activeActivityDataviews?.length) ||
      (timebarVisualisation === TimebarVisualisations.HeatmapDetections &&
        !activeDetectionsDataviews?.length) ||
      (timebarVisualisation === TimebarVisualisations.VesselGroup &&
        !activeVesselGroupDataviews?.length) ||
      (timebarVisualisation === TimebarVisualisations.Vessel && !activeTrackDataviews?.length) ||
      (timebarVisualisation === TimebarVisualisations.Environment && !activeEnvDataviews?.length) ||
      (timebarVisualisation === TimebarVisualisations.Events && !activeEventsDataviews?.length) ||
      (timebarVisualisation === TimebarVisualisations.Points && !activeUserPointsDataviews?.length)
    ) {
      if (activeActivityDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapActivity, true)
      } else if (activeDetectionsDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapDetections, true)
      } else if (activeVesselGroupDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.VesselGroup, true)
      } else if (activeTrackDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      } else if (activeEnvDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment, true)
      } else if (activeEventsDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Events, true)
      } else if (activeUserPointsDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Points, true)
      }
    } else if (!hasChangedSettingsOnce) {
      if (activeActivityDataviews.length === 1 && prevActiveHeatmapDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapActivity, true)
      } else if (activeDetectionsDataviews.length === 1 && prevActiveDetectionsDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapActivity, true)
      } else if (
        activeVesselGroupDataviews.length === 1 &&
        prevActiveVesselGroupDataviewsNum === 0
      ) {
        dispatchTimebarVisualisation(TimebarVisualisations.VesselGroup, true)
      } else if (activeTrackDataviews.length >= 1 && prevActiveTrackDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      } else if (activeEnvDataviews.length === 1 && prevactiveEnvDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment, true)
      } else if (activeEventsDataviews.length === 1 && prevActiveEventsDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Events, true)
      } else if (activeUserPointsDataviews.length >= 1 && prevActiveUserPointsDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Points, true)
      }
    }
  }, [
    activeActivityDataviews,
    activeDetectionsDataviews,
    activeVesselGroupDataviews,
    activeUserPointsDataviews,
    activeTrackDataviews,
    activeEnvDataviews,
    hasChangedSettingsOnce,
  ])
  return useMemo(
    () => ({ timebarVisualisation, dispatchTimebarVisualisation }),
    [dispatchTimebarVisualisation, timebarVisualisation]
  )
}
