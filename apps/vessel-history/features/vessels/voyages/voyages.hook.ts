import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import FileSaver from 'file-saver'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { EventTypeVoyage, RenderedVoyage, Voyage } from 'types/voyage'
import { selectMergedVesselId } from 'routes/routes.selectors'
import { getUTCDateTime } from 'utils/dates'
import { RenderedEvent } from '../activity/vessels-activity.selectors'
import {
  upsertVesselVoyagesExpanded,
  setVesselVoyagesInitialized,
  VoyagesState,
} from '../vessels.slice'
import { selectCurrentVesselVoyagesState } from '../vessels.selectors'
import { selectAllEventsByVoyages, selectFilteredEventsByVoyages } from './voyages.selectors'

function useVoyagesConnect() {
  const dispatch = useAppDispatch()
  const eventsLoading = useSelector(selectResourcesLoading)
  const eventsList = useSelector(selectFilteredEventsByVoyages)
  const mergedVesselId = useSelector(selectMergedVesselId)
  const { expanded: expandedVoyages, initialized }: VoyagesState = {
    ...(useSelector(selectCurrentVesselVoyagesState) ?? { expanded: {}, initialized: false }),
  }

  const toggleVoyage = useCallback(
    (voyage: RenderedVoyage) => {
      dispatch(
        upsertVesselVoyagesExpanded({
          [mergedVesselId]: {
            ...expandedVoyages,
            [voyage.timestamp]: expandedVoyages[voyage.timestamp] ? undefined : voyage,
          },
        })
      )
    },
    [dispatch, expandedVoyages, mergedVesselId]
  )

  const events: (RenderedEvent | RenderedVoyage)[] = useMemo(() => {
    const hasVoyages = !!eventsList.find((event) => event.type === EventTypeVoyage.Voyage)
    if (!hasVoyages) return eventsList as RenderedEvent[]

    const eventsListParsed = eventsList.map((event) => {
      if (event.type === EventTypeVoyage.Voyage) {
        return {
          ...event,
          status: expandedVoyages[event.timestamp] ? 'expanded' : 'collapsed',
        } as RenderedVoyage
      } else {
        return event as RenderedEvent
      }
    })

    return eventsListParsed.filter((event) => {
      return (
        event.type === EventTypeVoyage.Voyage ||
        Object.values(expandedVoyages).find(
          (voyage) =>
            voyage !== undefined &&
            // event timestamp or start is inside the voyage
            voyage.start <= (event.timestamp ?? event.start) &&
            voyage.end >= (event.timestamp ?? event.start)
        )
      )
    })
  }, [eventsList, expandedVoyages])

  useEffect(() => {
    if (initialized || events.length === 0) return

    const lastVoyage = events.find(
      (event) => event.type === EventTypeVoyage.Voyage
    ) as RenderedVoyage
    if (lastVoyage) {
      dispatch(
        upsertVesselVoyagesExpanded({
          [mergedVesselId]: {
            [lastVoyage.timestamp]: lastVoyage as RenderedVoyage,
          },
        })
      )
      dispatch(setVesselVoyagesInitialized({ [mergedVesselId]: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, expandedVoyages])

  const getVoyageByEvent = useCallback(
    (event: RenderedEvent) => {
      return events.find(
        (voyage) =>
          voyage.type === EventTypeVoyage.Voyage &&
          (event?.timestamp ?? event?.start) >= voyage.start &&
          (event?.timestamp ?? event?.start) <= voyage.end
      ) as RenderedVoyage
    },
    [events]
  )

  const getLastEventInVoyage = useCallback(
    (voyage: Voyage) => {
      return eventsList.find(
        (event) =>
          event?.type !== EventTypeVoyage.Voyage &&
          (event?.timestamp ?? event?.start) >= voyage.start &&
          (event?.timestamp ?? event?.start) <= voyage.end
      ) as RenderedEvent
    },
    [eventsList]
  )

  const CSVParser = useRef<any>(null)
  const [downloadingStatus, setDownloadingStatus] = useState(false)

  const downloadEvents = useCallback(
    async (events: (RenderedEvent | Voyage)[], filename: string) => {
      setDownloadingStatus(true)
      try {
        if (!CSVParser.current) {
          const node = await import('json2csv')
          CSVParser.current = node
        }
        const data = (events as any[])
          .filter((event) => event.type !== EventTypeVoyage.Voyage)
          .map(
            ({
              id,
              key,
              type,
              subEvent,
              timestamp,
              position,
              start,
              end,
              color,
              colorLabels,
              description,
              descriptionGeneric,
              regionDescription,
              durationDescription,
              duration,
              vessel,
              ...rest
            }) => ({
              timestamp: getUTCDateTime(timestamp).toISO(),
              type,
              subType: subEvent,
              latitude: position.lat,
              longitude: position.lon,
              start: getUTCDateTime(start).toISO(),
              end: getUTCDateTime(end).toISO(),
              description,
              regionDescription,
              durationDescription,
              duration,
              vessel,
              ...rest,
              eventId: id,
            })
          )
        const { parse, transforms } = CSVParser.current
        const csv = parse(data, {
          transforms: [transforms.flatten({ objects: true, arrays: true })],
        })
        FileSaver(new Blob([csv], { type: 'text/plain;charset=utf-8' }), filename)
      } catch (e) {
        console.warn(e)
      }
      setDownloadingStatus(false)
    },
    []
  )

  const allEvents = useSelector(selectAllEventsByVoyages)
  const downloadAllEvents = useCallback(async () => {
    // TODO Customize filename
    const date = DateTime.now().toFormat('yyyyLLddHHmm')
    const fileName = `vessel-activity-all-${date}.csv`
    downloadEvents(allEvents, fileName)
  }, [allEvents, downloadEvents])

  const downloadFilteredEvents = useCallback(async () => {
    // TODO Customize filename
    const date = DateTime.now().toFormat('yyyyLLddHHmm')
    const fileName = `vessel-activity-filtered-${date}.csv`
    downloadEvents(eventsList, fileName)
  }, [downloadEvents, eventsList])

  // TODO define approach to display readme file
  const viewReadme = useCallback(
    () =>
      'https://github.com/GlobalFishingWatch/frontend/blob/develop/apps/vessel-history/feature/download-activity-csv/README.md',
    []
  )
  return {
    downloadAllEvents,
    downloadFilteredEvents,
    downloadingStatus,
    eventsLoading,
    events,
    getLastEventInVoyage,
    getVoyageByEvent,
    toggleVoyage,
    viewReadme,
  }
}

export default useVoyagesConnect
