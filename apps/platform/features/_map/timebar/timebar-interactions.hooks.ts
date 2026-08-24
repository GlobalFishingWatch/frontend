import { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useStore } from 'jotai'

import type {
  TimebarChartChunk,
  TimebarProps,
  TrackEventChunkProps,
} from '@globalfishingwatch/timebar'

import { viewStateAtom } from 'features/_map/map/map.atoms'
import { useSetMapCoordinates } from 'features/_map/map/map-viewport.hooks'
import {
  useDisableHighlightTimeConnect,
  useTimerangeConnect,
} from 'features/_map/timebar/timebar.hooks'
import { useFitAreaInViewport } from 'features/_reports/report-area/area-reports.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch, useAppStore } from 'features/app/app.hooks'
import { selectIsAnyAreaReportLocation } from 'router/routes.selectors'
import { getEventLabel } from 'utils/analytics'
import { getUTCDateTime } from 'utils/dates'

import { ZOOM_LEVEL_TO_FOCUS_EVENT } from './Timebar'
import { selectHighlightedTime, setHighlightedEvents, setHighlightedTime } from './timebar.slice'

const GA_ACTIONS: Record<string, string> = {
  TIME_RANGE_SELECTOR: 'Configure timerange using calendar option',
  ZOOM_IN_RELEASE: 'Zoom In timerange',
  ZOOM_OUT_RELEASE: 'Zoom Out timerange',
  HOUR_INTERVAL_BUTTON: 'Use hour preset',
  DAY_INTERVAL_BUTTON: 'Use day preset',
  MONTH_INTERVAL_BUTTON: 'Use month preset',
  YEAR_INTERVAL_BUTTON: 'Use year preset',
  SEEK_RELEASE: 'Move timebar slider',
  BOOKMARK_SELECT: 'Select bookmark period',
}

export function useTimebarBookmark() {
  const [bookmark, setBookmark] = useState<{ start: string; end: string } | null>(null)
  const onBookmarkChange = useCallback((start: string, end: string) => {
    if (!start || !end) {
      trackEvent({
        category: TrackCategory.Timebar,
        action: 'Bookmark timerange',
        label: 'removed',
      })
      setBookmark(null)
      return
    }
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'Bookmark timerange',
      label: getEventLabel([start, end]),
    })
    setBookmark({ start, end })
  }, [])

  return { bookmark, onBookmarkChange }
}

export function useOnTimebarRangeChange(onToggleFixedTooltip: (toggle?: boolean) => void) {
  const { start, end, onTimebarChange } = useTimerangeConnect()
  const appStore = useAppStore()
  const reportAreaLocation = useSelector(selectIsAnyAreaReportLocation)
  const fitAreaInViewport = useFitAreaInViewport()

  return useCallback<NonNullable<TimebarProps['onChange']>>(
    (e) => {
      if (e.start === start && e.end === end) {
        return
      }
      if (e.source && GA_ACTIONS[e.source]) {
        trackEvent({
          category: TrackCategory.Timebar,
          action: GA_ACTIONS[e.source],
          label: getEventLabel([e.start, e.end]),
        })
      }
      onTimebarChange(e.start, e.end, e.source)
      const highlightedTime = selectHighlightedTime(appStore.getState())
      if (highlightedTime && (highlightedTime.start < start! || highlightedTime.end > end!)) {
        onToggleFixedTooltip(false)
      }
      if (reportAreaLocation) {
        fitAreaInViewport()
      }
    },
    [
      start,
      end,
      onTimebarChange,
      appStore,
      reportAreaLocation,
      onToggleFixedTooltip,
      fitAreaInViewport,
    ]
  )
}

export function useTimebarMouseInteractions(rootElement: HTMLElement | undefined) {
  const [isMouseInside, setMouseInside] = useState(false)
  const [isMouseClicked, setMouseClicked] = useState(false)
  const clickTimeRef = useRef(0)
  const dispatch = useAppDispatch()
  const jotaiStore = useStore()
  const setMapCoordinates = useSetMapCoordinates()
  const { dispatchDisableHighlightedTime } = useDisableHighlightTimeConnect()

  const onMouseMove = useCallback(
    (clientX: number | null, scale: ((arg: number) => Date) | null) => {
      if (clientX === null || clientX === undefined || isNaN(clientX)) {
        if (!isMouseClicked) {
          dispatchDisableHighlightedTime()
        }
        return
      }
      try {
        if (!scale || isMouseClicked) return
        const start = scale(clientX - 10).toISOString()
        const end = scale(clientX + 10).toISOString()
        const startDateTime = getUTCDateTime(start)
        const endDateTime = getUTCDateTime(end)
        const diff = endDateTime.diff(startDateTime, 'hours')
        if (diff.hours < 1) {
          // To ensure at least 1h range is highlighted
          const hourStart = startDateTime.minus({ hours: diff.hours / 2 }).toISO() as string
          const hourEnd = endDateTime.plus({ hours: diff.hours / 2 }).toISO() as string
          dispatch(setHighlightedTime({ start: hourStart, end: hourEnd }))
        } else {
          dispatch(setHighlightedTime({ start, end }))
        }
      } catch (e: any) {
        console.warn(clientX, e)
      }
    },
    [dispatch, dispatchDisableHighlightedTime, isMouseClicked]
  )

  const onToggleFixedTooltip = useCallback(
    (toggle?: boolean) => {
      const newToggle = toggle !== undefined ? toggle : !isMouseClicked
      setMouseClicked(newToggle)
      if (!newToggle) {
        dispatchDisableHighlightedTime()
      }
    },
    [dispatchDisableHighlightedTime, isMouseClicked]
  )

  const onGraphClick = useCallback(
    (toggle: boolean) => {
      if (Date.now() - clickTimeRef.current > 100) {
        onToggleFixedTooltip(toggle)
      }
    },
    [onToggleFixedTooltip]
  )

  const onMouseEnter = useCallback(() => {
    setMouseInside(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseInside(false)
    if (!isMouseClicked) {
      requestAnimationFrame(() => {
        dispatch(setHighlightedEvents(undefined))
      })
    }
  }, [dispatch, isMouseClicked])

  const onMouseDown = useCallback(() => {
    rootElement?.classList.add('dragging')
  }, [rootElement])

  const onMouseUp = useCallback(() => {
    rootElement?.classList.remove('dragging')
  }, [rootElement])

  const onEventClick = useCallback(
    (event: TimebarChartChunk<TrackEventChunkProps>) => {
      clickTimeRef.current = Date.now()
      if (!event?.coordinates) return
      const viewState = jotaiStore.get(viewStateAtom)
      setMapCoordinates({
        ...viewState,
        latitude: event.coordinates[1],
        longitude: event.coordinates[0],
        zoom: Math.max(viewState.zoom, ZOOM_LEVEL_TO_FOCUS_EVENT),
      })
    },
    [jotaiStore, setMapCoordinates]
  )

  return {
    isMouseInside,
    isMouseClicked,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onToggleFixedTooltip,
    onGraphClick,
    onEventClick,
  }
}
