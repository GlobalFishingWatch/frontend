import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAtomValue } from 'jotai'

import { deckHoverInteractionAtom } from '@globalfishingwatch/deck-layer-composer'
import { usePrevious } from '@globalfishingwatch/react-hooks'

import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveEventsDataviews,
  selectActiveUserPointsWithTimeRangeDataviews,
  selectActiveVesselGroupDataviews,
} from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveTrackDataviews } from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import { selectActiveHeatmapEnvironmentalDataviewsWithoutStatic } from 'features/_map/dataviews/selectors/dataviews.selectors'
import {
  selectTimebarGraph,
  selectTimebarSelectedEnvId,
  selectTimebarSelectedUserId,
  selectTimebarSelectedVGId,
  selectTimebarVisualisation,
} from 'features/_map/workspace/selectors/app.timebar.selectors'
import { useAppDispatch, useAppStore } from 'features/app/app.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { TimebarGraphs } from 'types'
import { TimebarVisualisations } from 'types'

import {
  disableHighlightedTime,
  selectHasChangedSettingsOnce,
  selectHighlightedEvents,
  selectHighlightedTime,
  selectHoveredHighlightedEvents,
  setHasChangedSettings,
  setHighlightedEvents,
} from './timebar.slice'

// The timerange cluster moved to timerange.hooks so always-loaded callers (workspace.hook, reached from
// app-shell.hooks / LanguageToggle / user.hooks) do not pull @globalfishingwatch/timebar and
// deck-layer-composer. Re-exported here for the 34 modules that already import it from this file.
export { timerangeState, useSetTimerange, useTimerangeConnect } from './timerange.hooks'

export const useDisableHighlightTimeConnect = () => {
  const dispatch = useAppDispatch()
  const appStore = useAppStore()

  const dispatchDisableHighlightedTime = useCallback(() => {
    if (selectHighlightedTime(appStore.getState()) !== undefined) {
      dispatch(disableHighlightedTime())
    }
  }, [dispatch, appStore])

  return { dispatchDisableHighlightedTime }
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
