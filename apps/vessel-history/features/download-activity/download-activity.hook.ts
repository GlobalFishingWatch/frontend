import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import FileSaver from 'file-saver'
import { DateTime } from 'luxon'

import { BASE_URL } from 'data/constants'
import { selectFiltersUpdated } from 'features/event-filters/filters.selectors'
import type { Filters} from 'features/event-filters/filters.slice';
import { selectFilters } from 'features/event-filters/filters.slice'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { selectVesselById } from 'features/vessels/vessels.slice'
import {
  selectAllEventsByVoyages,
  selectFilteredEventsByVoyages,
} from 'features/vessels/voyages/voyages.selectors'
import { selectMergedVesselId } from 'routes/routes.selectors'
import type { Voyage } from 'types/voyage';
import { EventTypeVoyage } from 'types/voyage'
import { getUTCDateTime } from 'utils/dates'

function useDownloadActivity() {
  const { t, i18n } = useTranslation()
  const eventsList = useSelector(selectFilteredEventsByVoyages)
  const allEvents = useSelector(selectAllEventsByVoyages)
  const mergedVesselId = useSelector(selectMergedVesselId)
  const vessel = useSelector(selectVesselById(mergedVesselId))
  const filters = useSelector(selectFilters)
  const filtersUpdated = useSelector(selectFiltersUpdated)

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
    const downloadDate = DateTime.now().toFormat('yyyyLLddHHmm')
    const fileName =
      `vessel-viewer-activity_${vessel?.shipname}_${vessel?.imo}` +
      `_${downloadDate}` +
      `_all activity` +
      `.csv`
    downloadEvents(allEvents, fileName)
  }, [allEvents, downloadEvents, vessel?.imo, vessel?.shipname])

  const downloadFilteredEvents = useCallback(async () => {
    const downloadDate = DateTime.now().toFormat('yyyyLLddHHmm')
    const dateRange =
      filters.end && filters.start
        ? `_${filters.start}_${filters.end}`
        : filters.start
        ? `_since_${filters.start}`
        : filters.end
        ? `_until_${filters.end}`
        : ''
    const currentFilters: string =
      (filtersUpdated as string[]).filter((filter) => !['start', 'end'].includes(filter)).length > 0
        ? '_' +
          (Object.keys(filters) as (keyof Filters)[])
            // Exclude filters without value or false
            .filter((key) => !!filters[key] && !['start', 'end'].includes(key as string))
            .map((filter) =>
              (t(`settings.${filter}.shortTitle` as any, filter) as string).toLocaleLowerCase()
            )
            .join(',')
        : ''
    const fileName =
      `vessel-viewer-activity_${vessel?.shipname}_${vessel?.imo}` +
      `_${downloadDate}` +
      `_filtered activity` +
      `${dateRange}` +
      `${currentFilters}` +
      `.csv`

    downloadEvents(eventsList, fileName)
  }, [downloadEvents, eventsList, filters, filtersUpdated, t, vessel?.imo, vessel?.shipname])

  // TODO define approach to display readme file
  const readmeUrl = useMemo(
    () => `${BASE_URL}/readme.csv.activity.${i18n.language}.pdf`,
    [i18n.language]
  )

  return {
    downloadAllEvents,
    downloadFilteredEvents,
    downloadingStatus,
    hasEvents: allEvents.length > 0,
    readmeUrl,
  }
}

export default useDownloadActivity
