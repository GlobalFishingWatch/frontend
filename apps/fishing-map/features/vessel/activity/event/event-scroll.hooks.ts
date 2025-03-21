import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { debounce } from 'es-toolkit'
import { atom, useAtom, useAtomValue } from 'jotai'

import type { EventType } from '@globalfishingwatch/api-types'

import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { ACTIVITY_CONTAINER_ID } from 'features/vessel/activity/VesselActivity'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import {
  selectVesselProfileEventsEvents,
  selectVesselProfileGroup,
  selectVirtuosoVesselProfileEventsEvents,
} from 'features/vessel/activity/vessels-activity.selectors'
import { setVesselEventId } from 'features/vessel/vessel.slice'

const virtuosoScrollAtom = atom<{
  virtuosoRef: RefObject<GroupedVirtuosoHandle | null>
  isScrollingRef: RefObject<boolean>
  selectedEventId: string | undefined
}>({
  virtuosoRef: { current: null },
  isScrollingRef: { current: false },
  selectedEventId: undefined,
})

export function useVirtuosoScroll(debouncedTime = 150) {
  const { isScrollingRef, virtuosoRef } = useAtomValue(virtuosoScrollAtom)

  const scrollToIndex = useMemo(
    () =>
      debounce(
        ({ index, behavior = 'smooth' }: { index: number; behavior?: 'auto' | 'smooth' }) => {
          if (!virtuosoRef?.current) {
            return
          }
          isScrollingRef.current = true
          virtuosoRef?.current?.scrollIntoView({
            index,
            align: 'center',
            behavior,
            calculateViewLocation: ({ locationParams: { behavior, align, ...rest } }) => {
              return { ...rest, behavior, align }
            },
            done: () => {
              isScrollingRef.current = false
            },
          })
        },
        debouncedTime
      ),
    [debouncedTime, isScrollingRef, virtuosoRef]
  )

  return { isScrollingRef, virtuosoRef, scrollToIndex }
}

export function useVirtuosoScrollToEvent() {
  const { scrollToIndex } = useVirtuosoScroll()
  const [{ isScrollingRef }, setVirtuosoScrollAtom] = useAtom(virtuosoScrollAtom)
  const events = useSelector(selectVirtuosoVesselProfileEventsEvents)?.events

  const scrollToEvent = useCallback(
    ({
      eventId,
      eventIndex,
      behavior = 'smooth',
    }: {
      eventId?: string
      eventIndex?: number
      behavior?: 'auto' | 'smooth'
    }) => {
      if (eventId || eventIndex !== undefined) {
        const selectedIndex =
          eventIndex !== undefined
            ? eventIndex
            : eventId
              ? events?.findIndex((event) => event?.id.includes(eventId))
              : undefined

        if (selectedIndex !== undefined && selectedIndex !== -1) {
          const selectedEventId = eventId || events?.[selectedIndex]?.id
          isScrollingRef.current = true
          setVirtuosoScrollAtom((prev) => ({ ...prev, selectedEventId }))
          scrollToIndex({ index: selectedIndex, behavior })
        }
      }
    },
    [events, isScrollingRef, scrollToIndex, setVirtuosoScrollAtom]
  )

  return scrollToEvent
}

export function useVesselProfileScrollToEvent() {
  const vesselProfileEvents = useSelector(selectVesselProfileEventsEvents)
  const vesselProfileGroup = useSelector(selectVesselProfileGroup)
  const scrollToEvent = useVirtuosoScrollToEvent()

  const scrollToEventProfile = useCallback(
    ({ eventId, eventType }: { eventId?: string; eventType?: EventType | number | null }) => {
      const activityContainer = getScrollElement(ACTIVITY_CONTAINER_ID)
      const scrollElement = getScrollElement()
      // Needs to scroll to the virtuoso container so elements are rendered
      if (!vesselProfileGroup && scrollElement && activityContainer?.offsetTop) {
        scrollElement.scrollTop = activityContainer?.offsetTop
      }
      if (eventId && eventType) {
        const eventIndex = (vesselProfileEvents as Record<EventType | number, ActivityEvent[]>)[
          eventType
        ]?.findIndex((e) => e.id === eventId)
        scrollToEvent({ eventIndex, eventId, behavior: 'auto' })
      }
    },
    [vesselProfileGroup, vesselProfileEvents, scrollToEvent]
  )

  return scrollToEventProfile
}

export function useEventsScroll(
  eventsRef: React.RefObject<Map<string, HTMLElement>>,
  virtuosoRef: React.RefObject<GroupedVirtuosoHandle | null>
) {
  const dispatch = useDispatch()
  const selectedEventIdRef = useRef<string | undefined>(undefined)
  const [{ selectedEventId, isScrollingRef }, setVirtuosoScrollAtom] = useAtom(virtuosoScrollAtom)
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

  const setSelectedEventId = useCallback(
    (eventId: string | undefined) => {
      setVirtuosoScrollAtom((prev) => ({ ...prev, selectedEventId: eventId }))
    },
    [setVirtuosoScrollAtom]
  )

  const selectEventInCenter = useCallback(() => {
    const cH = document.documentElement.clientHeight
    const wH = window.innerHeight || 0
    const middle = Math.max(cH, wH) / 2
    let selectedEventId: string | undefined = undefined
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
      setSelectedEventId(selectedEventId)
    }
    if (selectedEventIdRef.current !== selectedEventId) {
      selectedEventIdRef.current = selectedEventId
      if (selectedEventId) {
        setSelectedEventId(selectedEventId)
      }
    }
  }, [eventsRef, setSelectedEventId])

  useEffect(() => {
    if (!isScrollingRef.current && scrollTop !== undefined) {
      selectEventInCenter()
    }
  }, [isScrollingRef, selectEventInCenter, scrollTop])

  return useMemo(
    () =>
      ({
        selectedEventId,
        setSelectedEventId,
        scrollToEvent,
        handleScroll,
      }) as const,
    [selectedEventId, setSelectedEventId, scrollToEvent, handleScroll]
  )
}
