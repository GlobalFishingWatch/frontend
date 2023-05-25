import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { atom, useAtom } from 'jotai'
import { debounce } from 'lodash'
import { DEFAULT_CALLBACK_URL_KEY, usePrevious } from '@globalfishingwatch/react-hooks'
import {
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  MERGED_DETECTIONS_ANIMATED_HEATMAP_GENERATOR_ID,
} from '@globalfishingwatch/dataviews-client'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { useMapStyle } from 'features/map/map-style.hooks'
import {
  selectTimebarGraph,
  selectTimebarSelectedEnvId,
  selectTimebarVisualisation,
} from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectActiveReportActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveNonTrackEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { updateUrlTimerange } from 'routes/routes.actions'
import { selectIsReportLocation } from 'routes/routes.selectors'
import { selectHintsDismissed, setHintDismissed } from 'features/help/hints.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { BIG_QUERY_PREFIX } from 'features/dataviews/dataviews.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { useFitAreaInViewport } from 'features/reports/reports.hooks'
import { DEFAULT_TIME_RANGE } from 'data/config'
import {
  changeSettings,
  setHighlightedEvents,
  selectHighlightedEvents,
  selectHasChangedSettingsOnce,
  selectHighlightedTime,
  disableHighlightedTime,
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

export const useTimerangeConnect = () => {
  const [timerangeAtom, setAtomTimerange] = useAtom(timerangeState)
  const dispatch = useAppDispatch()
  const hintsDismissed = useSelector(selectHintsDismissed)
  const reportLocation = useSelector(selectIsReportLocation)
  const fitAreaInViewport = useFitAreaInViewport()

  const updateUrlTimerangeDebounced = useCallback(
    debounce(dispatch(updateUrlTimerange), TIMERANGE_DEBOUNCED_TIME),
    []
  )

  const setTimerange = useCallback(
    (viewport) => {
      setAtomTimerange(viewport)
      updateUrlTimerangeDebounced(viewport)
    },
    [setAtomTimerange, updateUrlTimerangeDebounced]
  )

  const onTimebarChange = useCallback(
    (start: string, end: string) => {
      if (
        (start !== timerangeAtom?.start || end !== timerangeAtom.end) &&
        !hintsDismissed?.changingTheTimeRange
      ) {
        dispatch(setHintDismissed('changingTheTimeRange'))
      }
      setTimerange({ start, end })
      if (reportLocation) {
        fitAreaInViewport()
      }
    },
    [
      dispatch,
      fitAreaInViewport,
      hintsDismissed?.changingTheTimeRange,
      reportLocation,
      setTimerange,
      timerangeAtom?.end,
      timerangeAtom?.start,
    ]
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
  const dispatch = useAppDispatch()

  const dispatchHighlightedEvents = useCallback(
    (eventIds: string[]) => {
      dispatch(setHighlightedEvents(eventIds))
    },
    [dispatch]
  )

  const serializedHighlightedEvents = highlightedEvents?.join('')

  return useMemo(() => {
    return {
      highlightedEvents,
      dispatchHighlightedEvents,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedHighlightedEvents, dispatchHighlightedEvents])
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

  return { timebarVisualisation, dispatchTimebarVisualisation }
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

  return { timebarSelectedEnvId, dispatchTimebarSelectedEnvId }
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

  return {
    timebarGraph,
    dispatchTimebarGraph,
  }
}

// Used to automate the behave depending on vessels or activity state
// should be instanciated only once to avoid doing it more than needed
export const useTimebarVisualisation = () => {
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const activeActivityDataviews = useSelector(selectActiveReportActivityDataviews)
  const activeDetectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeEnvDataviews = useSelector(selectActiveNonTrackEnvironmentalDataviews)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)

  // const prevTimebarVisualisation = usePrevious(timebarVisualisation)
  const prevActiveHeatmapDataviewsNum = usePrevious(activeActivityDataviews.length)
  const prevActiveDetectionsDataviewsNum = usePrevious(activeDetectionsDataviews.length)
  const prevActiveTrackDataviewsNum = usePrevious(activeTrackDataviews.length)
  const prevactiveEnvDataviewsNum = usePrevious(activeEnvDataviews.length)

  useEffect(() => {
    // Fallback mechanisms to avoid empty timebar
    if (
      timebarVisualisation === TimebarVisualisations.HeatmapActivity &&
      !activeActivityDataviews?.length
    ) {
      if (activeDetectionsDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapDetections, true)
      } else if (activeTrackDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      } else if (activeEnvDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment, true)
      }
    } else if (
      timebarVisualisation === TimebarVisualisations.Vessel &&
      !activeTrackDataviews?.length
    ) {
      if (activeActivityDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapActivity, true)
      } else if (activeDetectionsDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapDetections, true)
      } else if (activeEnvDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment, true)
      }
    } else if (
      timebarVisualisation === TimebarVisualisations.Environment &&
      !activeEnvDataviews?.length
    ) {
      if (activeActivityDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapActivity, true)
      } else if (activeDetectionsDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapDetections, true)
      } else if (activeTrackDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      }
      // Automatically switch to last-activated layer type if settings never have been changed manually
    } else if (!hasChangedSettingsOnce) {
      if (activeActivityDataviews.length === 1 && prevActiveHeatmapDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapActivity, true)
      } else if (activeDetectionsDataviews.length === 1 && prevActiveDetectionsDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.HeatmapActivity, true)
      } else if (activeTrackDataviews.length === 1 && prevActiveTrackDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      } else if (activeEnvDataviews.length === 1 && prevactiveEnvDataviewsNum === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeActivityDataviews,
    activeDetectionsDataviews,
    activeTrackDataviews,
    activeEnvDataviews,
    hasChangedSettingsOnce,
  ])
  return { timebarVisualisation, dispatchTimebarVisualisation }
}

export const useActivityMetadata = () => {
  const map = useMapInstance()
  const style = useMapStyle()
  const { timebarVisualisation } = useTimebarVisualisationConnect()

  if (!map) return null

  const animatedMergedId =
    timebarVisualisation === TimebarVisualisations.HeatmapDetections
      ? MERGED_DETECTIONS_ANIMATED_HEATMAP_GENERATOR_ID
      : MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID

  const generatorsMetadata = style?.metadata?.generatorsMetadata
  if (!generatorsMetadata) return null

  const mergedHeatmapMetadata = generatorsMetadata[animatedMergedId]
  if (mergedHeatmapMetadata?.timeChunks) {
    return mergedHeatmapMetadata
  }
  const environmentalMetadata = Object.entries(generatorsMetadata).filter(
    ([id, metadata]) => (metadata as any).temporalgrid === true
  )
  const bqEnvironmentalMetadata = environmentalMetadata.filter(([id]) =>
    id.includes(BIG_QUERY_PREFIX)
  )
  if (environmentalMetadata?.length === 1 && bqEnvironmentalMetadata?.length === 1) {
    return bqEnvironmentalMetadata[0][1]
  }

  return null
}
