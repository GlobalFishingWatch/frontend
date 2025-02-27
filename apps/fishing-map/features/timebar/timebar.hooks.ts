import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { debounce } from 'es-toolkit'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import { deckHoverInteractionAtom } from '@globalfishingwatch/deck-layer-composer'
import { DEFAULT_CALLBACK_URL_KEY, usePrevious } from '@globalfishingwatch/react-hooks'

import { DEFAULT_TIME_RANGE } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectTimebarGraph,
  selectTimebarSelectedEnvId,
  selectTimebarSelectedVGId,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveVesselGroupDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectActiveHeatmapEnvironmentalDataviewsWithoutStatic } from 'features/dataviews/selectors/dataviews.selectors'
import { selectHintsDismissed, setHintDismissed } from 'features/help/hints.slice'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import { updateUrlTimerange } from 'routes/routes.actions'
import { useLocationConnect } from 'routes/routes.hook'
import type { TimebarGraphs } from 'types'
import { TimebarVisualisations } from 'types'

import type { TimeRange } from './timebar.slice'
import {
  changeSettings,
  disableHighlightedTime,
  selectHasChangedSettingsOnce,
  selectHighlightedEvents,
  selectHighlightedTime,
  setHighlightedEvents,
} from './timebar.slice'

const TIMERANGE_DEBOUNCED_TIME = 1000

const getTimerangeFromUrl = (locationUrl = window.location.toString()) => {
  try {
    const url = new URL(locationUrl)
    const start = url.searchParams.get('start')
    const end = url.searchParams.get('end')
    if (start && end) {
      return { start, end }
    }
  } catch (e) {
    console.warn(e)
  }
}
const timerangeState = atom(DEFAULT_TIME_RANGE)
timerangeState.onMount = (setAtom) => {
  // Initializing the atom with the url value until the workspace loads
  const urlTimerange = getTimerangeFromUrl()
  if (urlTimerange) {
    return setAtom(urlTimerange)
  }
  const redirectUrl =
    typeof window !== 'undefined' ? window.localStorage.getItem(DEFAULT_CALLBACK_URL_KEY) : null
  // Workaround to get start and end date from redirect url as the
  // location reducer isn't ready until initialDispatch
  if (redirectUrl) {
    try {
      const redirectTimerange = getTimerangeFromUrl(JSON.parse(redirectUrl))
      if (redirectTimerange) {
        setAtom(redirectTimerange)
      }
    } catch (e: any) {
      console.warn(e)
    }
  }
}

export const useSetTimerange = () => {
  const setAtomTimerange = useSetAtom(timerangeState)
  const dispatch = useAppDispatch()
  const hintsDismissed = useSelector(selectHintsDismissed)
  const isWorkspaceMapReady = useSelector(selectIsWorkspaceReady)

  const updateUrlTimerangeDebounced = useMemo(
    () => debounce(dispatch(updateUrlTimerange), TIMERANGE_DEBOUNCED_TIME),
    [dispatch]
  )

  const setTimerange = useCallback(
    (timerange: TimeRange) => {
      setAtomTimerange((timerangeAtom) => {
        if (
          (timerange.start !== timerangeAtom?.start || timerange.end !== timerangeAtom.end) &&
          !hintsDismissed?.changingTheTimeRange
        ) {
          dispatch(setHintDismissed('changingTheTimeRange'))
        }
        return timerange
      })
      if (isWorkspaceMapReady) {
        updateUrlTimerangeDebounced(timerange)
      }
    },
    [
      dispatch,
      hintsDismissed?.changingTheTimeRange,
      isWorkspaceMapReady,
      setAtomTimerange,
      updateUrlTimerangeDebounced,
    ]
  )

  return setTimerange
}

export const useTimerangeConnect = () => {
  const timerangeAtom = useAtomValue(timerangeState)
  const setTimerange = useSetTimerange()

  const onTimebarChange = useCallback(
    (start: string, end: string) => {
      setTimerange({ start, end })
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
  const hoverEvent = useAtomValue(deckHoverInteractionAtom)
  const dispatch = useAppDispatch()

  const dispatchHighlightedEvents = useCallback(
    (eventIds: string[] | undefined) => {
      dispatch(setHighlightedEvents(eventIds))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedHighlightedEventIds, dispatchHighlightedEvents])
}

export const useTimebarVisualisationConnect = () => {
  const dispatch = useAppDispatch()
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

  return useMemo(
    () => ({ timebarVisualisation, dispatchTimebarVisualisation }),
    [dispatchTimebarVisualisation, timebarVisualisation]
  )
}

export const useTimebarEnvironmentConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const timebarSelectedEnvId = useSelector(selectTimebarSelectedEnvId)

  const dispatchTimebarSelectedEnvId = useCallback(
    (timebarSelectedEnvId: string) => {
      dispatchQueryParams({ timebarSelectedEnvId })
    },
    [dispatchQueryParams]
  )

  return useMemo(
    () => ({ timebarSelectedEnvId, dispatchTimebarSelectedEnvId }),
    [dispatchTimebarSelectedEnvId, timebarSelectedEnvId]
  )
}

export const useTimebarVesselGroupConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const timebarSelectedVGId = useSelector(selectTimebarSelectedVGId)

  const dispatchTimebarSelectedVGId = useCallback(
    (timebarSelectedVGId: string) => {
      dispatchQueryParams({ timebarSelectedVGId })
    },
    [dispatchQueryParams]
  )

  return useMemo(
    () => ({ timebarSelectedVGId, dispatchTimebarSelectedVGId }),
    [dispatchTimebarSelectedVGId, timebarSelectedVGId]
  )
}

export const useTimebarGraphConnect = () => {
  const timebarGraph = useSelector(selectTimebarGraph)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatchTimebarGraph = useCallback(
    (timebarGraph: TimebarGraphs) => {
      dispatchQueryParams({ timebarGraph })
    },
    [dispatchQueryParams]
  )

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
  const activeVesselGroupDataviews = useSelector(selectActiveVesselGroupDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeEnvDataviews = useSelector(selectActiveHeatmapEnvironmentalDataviewsWithoutStatic)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)

  // const prevTimebarVisualisation = usePrevious(timebarVisualisation)
  const prevActiveHeatmapDataviewsNum = usePrevious(activeActivityDataviews.length)
  const prevActiveDetectionsDataviewsNum = usePrevious(activeDetectionsDataviews.length)
  const prevActiveVesselGroupDataviewsNum = usePrevious(activeVesselGroupDataviews.length)
  const prevActiveTrackDataviewsNum = usePrevious(activeTrackDataviews.length)
  const prevactiveEnvDataviewsNum = usePrevious(activeEnvDataviews.length)

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
      (timebarVisualisation === TimebarVisualisations.Environment && !activeEnvDataviews?.length)
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
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeActivityDataviews,
    activeDetectionsDataviews,
    activeVesselGroupDataviews,
    activeTrackDataviews,
    activeEnvDataviews,
    hasChangedSettingsOnce,
  ])
  return useMemo(
    () => ({ timebarVisualisation, dispatchTimebarVisualisation }),
    [dispatchTimebarVisualisation, timebarVisualisation]
  )
}
