import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { debounce } from 'es-toolkit'

import { getScrollElement } from 'features/sidebar/sidebar.utils'
import type VesselEvent from 'features/vessel/activity/event/Event'
import { selectVesselEventId, setVesselEventId } from 'features/vessel/vessel.slice'

let isScrolling = false

export function useUpdateSelectedEventByScroll(
  events: VesselEvent[],
  eventsRef: React.RefObject<Map<string, HTMLElement>>
) {
  const dispatch = useDispatch()
  const selectedEventIdRef = useRef<string | null>(null)
  const selectedVesselEventId = useSelector(selectVesselEventId)

  const setSelectedEvent = useCallback(
    (event: VesselEvent | null) => {
      dispatch(setVesselEventId(!event || selectedVesselEventId === event?.id ? null : event?.id))
    },
    [dispatch, selectedVesselEventId]
  )

  const checkScroll = useCallback(() => {
    const scrollContainerRef = getScrollElement()
    const cH = document.documentElement.clientHeight
    const wH = window.innerHeight || 0
    const middle = Math.max(cH, wH) / 2
    let minDelta = Number.POSITIVE_INFINITY
    let selectedEventId: string | null = null
    if (scrollContainerRef && scrollContainerRef.scrollTop !== 0) {
      eventsRef.current.forEach((el, key) => {
        const { top } = el.getBoundingClientRect()
        const delta = Math.abs(middle - top)
        if (delta < minDelta) {
          selectedEventId = key
          minDelta = delta
        }
      })
      if (selectedEventIdRef.current !== selectedEventId) {
        selectedEventIdRef.current = selectedEventId
        const selectedEvent = events.find((event) => event.id === selectedEventId) as VesselEvent
        if (selectedEvent) {
          setSelectedEvent(selectedEvent)
        }
      }
    } else {
      // TODO:review this
      // setSelectedEvent(null)
    }
  }, [events, eventsRef, setSelectedEvent])

  const onScroll = useCallback(() => {
    if (!isScrolling) {
      // avoid scroll jank by throttling to frame
      window.requestAnimationFrame(checkScroll)
    }
  }, [checkScroll])

  useEffect(() => {
    const ref = getScrollElement()
    if (ref !== null) {
      ref.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', onScroll)
      }
    }
  }, [onScroll])

  return setSelectedEvent
}

export function useScrollToEvent(
  events: VesselEvent[],
  virtuosoRef: React.RefObject<GroupedVirtuosoHandle | null>
) {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const selectedVesselEventId = useSelector(selectVesselEventId)

  const debouncedScroll = useMemo(
    () =>
      debounce((index: number) => {
        requestAnimationFrame(() => {
          virtuosoRef?.current?.scrollToIndex({
            index,
            align: 'center',
            behavior: 'smooth',
          })
        })
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrolling = false
        }, 1000)
      }, 150),
    [virtuosoRef]
  )

  const scrollToEvent = useCallback(
    (eventId: string) => {
      if (eventId && virtuosoRef?.current) {
        const selectedIndex = events.findIndex((event) => event.id.includes(eventId))
        if (selectedIndex !== -1) {
          isScrolling = true
          debouncedScroll(selectedIndex)
        }
      }
    },
    [debouncedScroll, events, virtuosoRef]
  )

  useEffect(() => {
    if (selectedVesselEventId && events?.length) {
      scrollToEvent(selectedVesselEventId)
    }
    // Only run once if selectedVesselEventId is in the url when loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events])

  return scrollToEvent
}
