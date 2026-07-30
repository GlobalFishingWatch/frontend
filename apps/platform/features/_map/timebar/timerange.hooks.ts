import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { debounce } from 'es-toolkit'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import { stickToClosestInterval } from '@globalfishingwatch/data-transforms/dates'
// Leaf subpath, not the package root: the root barrel is the Timebar UI and drags the whole thing into
// every page via workspace.hook. This module only needs the change-source constants.
import { EVENT_SOURCE } from '@globalfishingwatch/timebar/constants'

import { DEFAULT_TIME_RANGE } from 'data/map/config'
import { selectIsWorkspaceReady, selectTimeMode } from 'features/_map/workspace/workspace.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectHintsDismissed, setHintDismissed } from 'features/hints/hints.slice'
import { useReplaceQueryParams } from 'router/routes.hook'
import { getUTCDateTime } from 'utils/dates'

import type { TimeRange } from './timebar.slice'

/**
 * The map timerange, split out of timebar.hooks.ts.
 *
 * workspace.hook -> useTimerangeConnect is reached from app-shell.hooks, LanguageToggle and user.hooks,
 * all of which are always loaded. Sourcing it from timebar.hooks put @globalfishingwatch/timebar and
 * @globalfishingwatch/deck-layer-composer in the entry chunk of every page. timebar.hooks re-exports
 * everything here, so its 34 consumers are unaffected.
 *
 * Keep this module free of runtime timebar / deck-layer-composer / deck.gl imports.
 */

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
  const timeMode = useSelector(selectTimeMode)

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
        let { start: newStart, end: newEnd } = stickToClosestInterval(timerange)
        const minEnd = getUTCDateTime(newStart).plus({ hours: 24 })
        if (timeMode !== 'realTime' && getUTCDateTime(newEnd) < minEnd) {
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
      timeMode,
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
