import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { debounce } from 'es-toolkit'
import { atom, useAtomValue } from 'jotai'

import { selectVirtuosoVesselProfileEventsEvents } from 'features/vessel/activity/vessels-activity.selectors'
import { setVesselEventId } from 'features/vessel/vessel.slice'

const virtuosoScrollAtom = atom<{
  virtuosoRef: RefObject<GroupedVirtuosoHandle | null>
  isScrollingRef: RefObject<boolean>
}>({
  virtuosoRef: { current: null },
  isScrollingRef: { current: false },
})

export function useVirtuosoScroll(debouncedTime = 150) {
  const { isScrollingRef, virtuosoRef } = useAtomValue(virtuosoScrollAtom)

  const scrollToIndex = useMemo(
    () =>
      debounce((index: number) => {
        isScrollingRef.current = true
        if (!virtuosoRef?.current) {
          return
        }
        virtuosoRef?.current?.scrollIntoView({
          index,
          align: 'center',
          behavior: 'smooth',
          calculateViewLocation: ({ locationParams: { behavior, align, ...rest } }) => {
            return { ...rest, behavior, align }
          },
          done: () => {
            isScrollingRef.current = false
          },
        })
      }, debouncedTime),
    [debouncedTime, isScrollingRef, virtuosoRef]
  )

  return { isScrollingRef, virtuosoRef, scrollToIndex }
}

export function useVirtuosoScrollToEvent() {
  const { scrollToIndex } = useVirtuosoScroll()
  const events = useSelector(selectVirtuosoVesselProfileEventsEvents)?.events

  const scrollToEvent = useCallback(
    (eventId: string) => {
      if (eventId) {
        const selectedIndex = events?.findIndex((event) => event.id.includes(eventId))
        if (selectedIndex !== undefined && selectedIndex !== -1) {
          scrollToIndex(selectedIndex)
        }
      }
    },
    [scrollToIndex, events]
  )

  return scrollToEvent
}

export function useEventsScroll(
  eventsRef: React.RefObject<Map<string, HTMLElement>>,
  virtuosoRef: React.RefObject<GroupedVirtuosoHandle | null>
) {
  const dispatch = useDispatch()
  const selectedEventIdRef = useRef<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>()
  const isScrolling = useRef(false)
  const [scrollTop, setScrollTop] = useState(0)

  const scrollToEvent = useVirtuosoScrollToEvent()

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

  const handleScroll = useCallback(() => {
    virtuosoRef.current?.getState((state) => {
      setScrollTop(Math.round(state.scrollTop / 10) * 10)
    })
  }, [virtuosoRef])

  const selectEventInCenter = useCallback(() => {
    const cH = document.documentElement.clientHeight
    const wH = window.innerHeight || 0
    const middle = Math.max(cH, wH) / 2
    let selectedEventId: string | null = null
    let minDelta = Infinity
    eventsRef.current.forEach((el, key) => {
      const { top, height } = el.getBoundingClientRect()
      const center = top + height / 2
      const elementDelta = Math.abs(center - middle)
      if (elementDelta < minDelta) {
        minDelta = elementDelta
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
    () => ({ selectedEventId, setSelectedEventId, scrollToEvent, handleScroll }) as const,
    [selectedEventId, setSelectedEventId, scrollToEvent, handleScroll]
  )
}
