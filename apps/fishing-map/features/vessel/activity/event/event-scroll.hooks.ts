import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { debounce } from 'es-toolkit'

import type VesselEvent from 'features/vessel/activity/event/Event'
import { selectVesselEventId, setVesselEventId } from 'features/vessel/vessel.slice'

export function useEventsScroll(
  events: VesselEvent[],
  eventsRef: React.RefObject<Map<string, HTMLElement>>,
  virtuosoRef: React.RefObject<GroupedVirtuosoHandle | null>
) {
  const dispatch = useDispatch()
  const selectedEventIdRef = useRef<string | null>(null)
  const selectedVesselEventId = useSelector(selectVesselEventId)
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>()
  const isScrolling = useRef(false)
  const [scrollTop, setScrollTop] = useState(0)

  const debouncedScrollToIndex = useMemo(
    () =>
      debounce((index: number) => {
        isScrolling.current = true
        virtuosoRef?.current?.scrollIntoView({
          index,
          align: 'center',
          behavior: 'smooth',
          calculateViewLocation: ({ locationParams: { behavior, align, ...rest } }) => {
            return { ...rest, behavior, align }
          },
          done: () => {
            isScrolling.current = false
          },
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
    if (selectedVesselEventId && events?.length) {
      scrollToEvent(selectedVesselEventId)
    }
    // Only run once if selectedVesselEventId is in the url when loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events])

  const onRangeChanged = useCallback(() => {
    virtuosoRef.current?.getState((state) => {
      setScrollTop(Math.round(state.scrollTop / 10) * 10)
    })
  }, [virtuosoRef])

  const selectEventInCenter = useCallback(() => {
    const cH = document.documentElement.clientHeight
    const wH = window.innerHeight || 0
    const middle = Math.max(cH, wH) / 2
    let selectedEventId: string | null = null
    eventsRef.current.forEach((el, key) => {
      if (selectedEventId) {
        return
      }
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
  }, [eventsRef])

  useEffect(() => {
    if (!isScrolling.current && scrollTop !== undefined) {
      selectEventInCenter()
    }
  }, [selectEventInCenter, scrollTop])

  return useMemo(
    () => ({ selectedEventId, setSelectedEventId, scrollToEvent, onRangeChanged }) as const,
    [selectedEventId, setSelectedEventId, scrollToEvent, onRangeChanged]
  )
}
