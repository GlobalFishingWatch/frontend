import { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import FileSaver from 'file-saver'
// import { selectResourcesLoading } from 'features/resources/resources.slice'
import { EventTypeVoyage, Voyage } from 'types/voyage'
import { getUTCDateTime } from 'utils/dates'
import {
  selectAllEventsByVoyages,
  selectFilteredEventsByVoyages,
} from 'features/vessels/voyages/voyages.selectors'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { selectMergedVesselId } from 'routes/routes.selectors'
import { selectVesselById } from 'features/vessels/vessels.slice'

function useDownloadActivity() {
  const eventsList = useSelector(selectFilteredEventsByVoyages)
  const allEvents = useSelector(selectAllEventsByVoyages)
  const mergedVesselId = useSelector(selectMergedVesselId)
  const vessel = useSelector(selectVesselById(mergedVesselId))

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

  const downloadAllEvents = useCallback(async () => {
    // TODO Customize filename
    const date = DateTime.now().toFormat('yyyyLLddHHmm')
    const fileName = `vessel-activity-all-${date}.csv`
    downloadEvents(allEvents, fileName)
  }, [allEvents, downloadEvents])

  const downloadFilteredEvents = useCallback(async () => {
    // TODO Customize filename
    const date = DateTime.now().toFormat('yyyyLLddHHmm')
    // vessel_viewer_activity_[vessel name]_[IMO (if available)]_[date of export]_[all activity/filtered activity (depending on which it is)]_[date range (whether all or filtered)]_[event types (if filtered by event)]
    const fileName = `/tmp/vessel-viewer-activity-${date}.csv`

    downloadEvents(eventsList, fileName)
  }, [downloadEvents, eventsList])

  // TODO define approach to display readme file
  const viewReadme = useCallback(
    () =>
      'https://github.com/GlobalFishingWatch/frontend/blob/develop/apps/vessel-history/feature/download-activity/README.md',
    []
  )
  return {
    downloadAllEvents,
    downloadFilteredEvents,
    downloadingStatus,
    viewReadme,
  }
}

export default useDownloadActivity
