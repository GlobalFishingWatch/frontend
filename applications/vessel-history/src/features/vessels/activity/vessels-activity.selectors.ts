import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import {
  resolveDataviewDatasetResource,
  resolveDataviewEventsResources,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { EVENTS_COLORS } from 'data/config'
import { Filters, initialState, selectFilters } from 'features/profile/filters/filters.slice'
import { t } from 'features/i18n/i18n'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.selectors'
import { ActivityEvent, Regions } from 'types/activity'
import { selectEEZs, selectRFMOs } from 'features/regions/regions.selectors'
import { getEEZName } from 'utils/region-name-transform'
import { Region } from 'features/regions/regions.slice'

export interface RenderedEvent extends ActivityEvent {
  color: string
  description: string
  descriptionGeneric: string
  regionDescription: string
  durationDescription: string
}

export const selectEventsForTracks = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    // const visibleEvents: (EventType[] | 'all') = 'all'
    const vesselsEvents = trackDataviews.map((dataview) => {
      const { url: tracksUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      // const { url: eventsUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Events)
      const eventsResources = resolveDataviewEventsResources(dataview)
      const hasEventData =
        eventsResources?.length && eventsResources.every(({ url }) => resources[url]?.data)
      const tracksResourceResolved =
        tracksUrl && resources[tracksUrl]?.status === ResourceStatus.Finished

      // Waiting for the tracks resource to be resolved to show the events
      if (
        !hasEventData ||
        !tracksResourceResolved //||
        // (Array.isArray(visibleEvents) && visibleEvents?.length === 0)
      ) {
        return { dataview, data: [] }
      }

      const eventsResourcesFiltered = eventsResources
      // .filter(({ dataset }) => {
      //   if (visibleEvents === 'all') {
      //     return true
      //   }
      //   return (
      //     dataset.configuration?.type &&
      //     visibleEvents?.includes(dataset.configuration?.type))
      //   )
      // })

      const data = eventsResourcesFiltered.flatMap(({ url }) => {
        if (!url || !resources[url].data) {
          return []
        }

        return resources[url].data as ActivityEvent[]
      })
      return { dataview, data }
    })
    return vesselsEvents
  }
)

export const selectEventsWithRenderingInfo = createSelector(
  [selectEventsForTracks, selectEEZs, selectRFMOs],
  (eventsForTrack, eezs, rfmos) => {
    const eventsWithRenderingInfo: RenderedEvent[][] = eventsForTrack.map(({ dataview, data }) => {
      return (data || []).map((event: ActivityEvent, index) => {
        // const vesselName = event.vessel.name || event.vessel.id

        const regionDescription = getEventRegionDescription(event, eezs, rfmos)

        let description = ''
        let descriptionGeneric = ''
        switch (event.type) {
          case EventTypes.Encounter:
            if (event.encounter) {
              description = t(
                'event.encounterActionWith',
                'had an encounter with {{vessel}} in {{regionName}}',
                {
                  vessel:
                    event.encounter.vessel.name ??
                    t('event.encounterAnotherVessel', 'another vessel'),
                  regionName: regionDescription,
                }
              )
            }
            descriptionGeneric = t('event.encounter')
            break
          case EventTypes.Port:
            const { name, flag } = event.port_visit?.intermediateAnchorage ??
              event.port_visit?.startAnchorage ??
              event.port_visit?.endAnchorage ?? { name: undefined, flag: undefined }
            if (name) {
              const portLabel = [
                name,
                ...(flag ? [t(`flags:${flag}`, flag.toLocaleUpperCase())] : []),
              ].join(', ')
              description = t('event.portAt', { port: portLabel })
            } else {
              description = t('event.portAction')
            }
            descriptionGeneric = t('event.port')
            break
          case EventTypes.Loitering:
            description = t('event.loiteringAction', 'Loitering in {{regionName}}', {
              regionName: regionDescription,
            })
            descriptionGeneric = t('event.loitering')
            break
          case EventTypes.Fishing:
            description = t('event.fishingAction', 'Fishing in {{regionName}}', {
              regionName: regionDescription,
            })
            descriptionGeneric = t('event.fishing')
            break
          default:
            description = t('event.unknown', 'Unknown event')
            descriptionGeneric = t('event.unknown', 'Unknown event')
        }
        const duration = DateTime.fromMillis(event.end as number)
          .diff(DateTime.fromMillis(event.start as number), ['hours', 'minutes'])
          .toObject()

        const durationDescription = [
          duration.hours && duration.hours > 0
            ? t('event.hourAbbreviated', '{{count}}h', { count: duration.hours })
            : '',
          duration.minutes && duration.minutes > 0
            ? t('event.minuteAbbreviated', '{{count}}m', {
              count: Math.round(duration.minutes as number),
            })
            : '',
        ].join(' ')

        let colorKey = event.type as string
        if (event.type === 'encounter' && dataview.config?.showAuthorizationStatus) {
          colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
        }
        const color = EVENTS_COLORS[colorKey]
        const colorLabels = EVENTS_COLORS[`${colorKey}Labels`]

        return {
          ...event,
          color,
          colorLabels,
          description,
          descriptionGeneric,
          regionDescription,
          durationDescription,
        }
      })
    })
    return eventsWithRenderingInfo
  }
)

const getEventRegionDescription = (event: ActivityEvent, eezs: Region[], rfmos: Region[]) => {
  const getRegionNamesByType = (regionType: string, values: string[]) => {
    switch (regionType) {
      case 'eez':
        return values
          .map((eezId) => getEEZName(eezs.find((eez) => eez.id.toString() === eezId)))
          .filter((value) => value.length > 0)
          .join(', ')
      case 'rfmo':
        return (
          t('event.internationalWaters', 'International Waters') +
          ': ' +
          values
            .map((regionId) => rfmos.find((rfmo) => rfmo.id.toString() === regionId)?.label ?? '')
            .filter((value) => value.length > 0)
            .join(', ')
        )
      case 'ocean':
        return t('event.internationalWaters', 'International Waters') //values.map((ocean) => ocean).join(', ')
      default:
        return values.join(', ')
    }
  }

  const regionsDescription = (['eez', 'rfmo', 'ocean'] as (keyof Regions)[])
    // use only regions with values
    .filter((regionType) => event?.regions && event?.regions[regionType].length > 0)
    // take only the first found
    .slice(0, 1)
    // retrieve its corresponding names
    .map(
      (regionType) =>
        `${getRegionNamesByType(
          regionType,
          event?.regions[regionType].filter((x: string) => x.length > 0)
        )}`
    )
    .pop()

  return regionsDescription ?? ''
}

export const selectEvents = createSelector(
  [selectEventsWithRenderingInfo],
  (events) => events.flat().sort((a, b) => (a.start > b.start ? -1 : 1))
)

export const selectFilteredEvents = createSelector(
  [selectEvents, selectFilters],
  (events, filters) => {
    // Need to parse the timerange start and end dates in UTC
    // to not exclude events in the boundaries of the range
    // if the user setting the filter is in a timezone with offset != 0
    const startDate = DateTime.fromISO(filters.start, { zone: 'utc' })

    // Setting the time to 23:59:59.99 so the events in that same day
    //  are also displayed
    const endDateUTC = DateTime.fromISO(filters.end, { zone: 'utc' }).toISODate()
    const endDate = DateTime.fromISO(`${endDateUTC}T23:59:59.999Z`, { zone: 'utc' })
    const interval = Interval.fromDateTimes(startDate, endDate)

    return events
      .filter((event: RenderedEvent) => {
        if (
          !interval.contains(DateTime.fromMillis(event.start as number)) &&
          !interval.contains(DateTime.fromMillis(event.end as number))
        ) {
          return false
        }
        if (event.type === 'fishing') {
          return filters.fishingEvents
        }
        if (event.type === 'loitering') {
          return filters.loiteringEvents
        }
        if (event.type === 'encounter') {
          return filters.encounters
        }
        if (event.type === 'port_visit') {
          return filters.portVisits
        }

        return true
      })

  }
)

export const selectFilterUpdated = createSelector([selectFilters], (filters) => {
  const keys1 = Object.keys(initialState.filters)
  const keys2 = Object.keys(filters)
  if (keys1.length !== keys2.length) {
    return true
  }

  for (const key of keys1) {
    const filterKey = key as keyof Filters
    if (initialState.filters[filterKey] !== filters[filterKey]) {
      return true
    }
  }

  return false
})
