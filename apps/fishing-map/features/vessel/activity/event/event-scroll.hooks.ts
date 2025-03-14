import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { debounce, throttle } from 'es-toolkit'

import { getScrollElement } from 'features/sidebar/sidebar.utils'
import type VesselEvent from 'features/vessel/activity/event/Event'
import { selectVesselEventId, setVesselEventId } from 'features/vessel/vessel.slice'

export function useEventsScroll(
  events: VesselEvent[],
  eventsRef: React.RefObject<Map<string, HTMLElement>>,
  virtuosoRef: React.RefObject<GroupedVirtuosoHandle | null>,
  isScrolling: boolean
) {
  const dispatch = useDispatch()
  const selectedEventIdRef = useRef<string | null>(null)
  const selectedVesselEventId = useSelector(selectVesselEventId)
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>()
  const [isScrollToIndex, setIsScrollToIndex] = useState(false)
  const [scrollToIndexInitialized, setScrollToIndexInitialized] = useState(false)

  const commitSelectedEvent = useMemo(
    () =>
      debounce((eventId?: string) => {
        dispatch(setVesselEventId(eventId || null))
      }, 1000),
    [dispatch]
  )

  useEffect(() => {
    commitSelectedEvent(selectedEventId)
  }, [commitSelectedEvent, selectedEventId])

  useEffect(() => {
    if (isScrollToIndex && isScrolling) {
      setScrollToIndexInitialized(true)
    }
    if (isScrollToIndex && scrollToIndexInitialized && !isScrolling) {
      setIsScrollToIndex(false)
      setScrollToIndexInitialized(false)
    }
  }, [scrollToIndexInitialized, isScrollToIndex, isScrolling])

  const debouncedScrollToIndex = useMemo(
    () =>
      debounce((index: number) => {
        setIsScrollToIndex(true)
        virtuosoRef?.current?.scrollToIndex({
          index,
          align: 'center',
          behavior: 'smooth',
        })
      }, 150),
    [virtuosoRef]
  )

  const scrollToEvent = useCallback(
    (eventId: string) => {
      if (eventId && virtuosoRef?.current) {
        const selectedIndex = events.findIndex((event) => event.id.includes(eventId))
        if (selectedIndex !== -1) {
          debouncedScrollToIndex(selectedIndex)
        }
      }
    },
    [debouncedScrollToIndex, events, virtuosoRef]
  )

  useEffect(() => {
    if (selectedVesselEventId && events?.length) {
      scrollToEvent(selectedVesselEventId)
    }
    // Only run once if selectedVesselEventId is in the url when loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events])

  const checkScroll = useMemo(
    () =>
      throttle(() => {
        const scrollContainerRef = getScrollElement()
        if (scrollContainerRef && scrollContainerRef.scrollTop !== 0) {
          const cH = document.documentElement.clientHeight
          const wH = window.innerHeight || 0
          const middle = Math.max(cH, wH) / 2
          let selectedEventId: string | null = null
          eventsRef.current.forEach((el, key) => {
            if (selectedEventId) return
            const { top, height } = el.getBoundingClientRect()
            if (middle > top && middle < top + height) {
              selectedEventId = key
            }
          })
          if (!selectedEventId) {
            setSelectedEventId(undefined)
          }
          if (selectedEventIdRef.current !== selectedEventId) {
            selectedEventIdRef.current = selectedEventId
            if (selectedEventId) {
              setSelectedEventId(selectedEventId)
            }
          }
        }
      }, 16),
    [eventsRef]
  )

  useEffect(() => {
    const ref = getScrollElement()
    if (ref !== null && !isScrollToIndex) {
      ref.addEventListener('scroll', checkScroll, { passive: true })
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', checkScroll)
      }
    }
  }, [checkScroll, isScrollToIndex])

  return useMemo(
    () => ({ selectedEventId, setSelectedEventId, scrollToEvent }) as const,
    [selectedEventId, setSelectedEventId, scrollToEvent]
  )
}
