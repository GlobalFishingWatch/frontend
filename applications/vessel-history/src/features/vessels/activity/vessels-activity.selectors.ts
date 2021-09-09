import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import { upperFirst } from 'lodash'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { EVENTS_COLORS } from 'data/config'
import { Filters, initialState, selectFilters } from 'features/event-filters/filters.slice'
import { t } from 'features/i18n/i18n'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.selectors'
import { ActivityEvent, Regions } from 'types/activity'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import { getEEZName } from 'utils/region-name-transform'
import { Region } from 'features/regions/regions.slice'
import { selectSettings } from 'features/settings/settings.slice'
import { filterActivityHighlightEvents } from './vessels-highlight.worker'

export interface RenderedEvent extends ActivityEvent {
  color: string
  description: string
  descriptionGeneric: string
  regionDescription: string
  durationDescription: string
  duration: number
}

export const selectEventsResources = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    return trackDataviews.flatMap((dataview) => {
      return resolveDataviewDatasetResources(dataview, DatasetTypes.Events).flatMap(
        (eventResource) => {
          return resources[eventResource.url] || []
        }
      )
    })
  }
)

export const selectEventsLoading = createSelector([selectEventsResources], (resources) =>
  resources.map((resource) => resource?.status).includes(ResourceStatus.Loading)
)

export const selectEventsForTracks = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    // const visibleEvents: (EventType[] | 'all') = 'all'
    const vesselsEvents = trackDataviews.map((dataview) => {
      const { url: tracksUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      // const { url: eventsUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Events)
      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
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
      return { dataview, data: data as ActivityEvent[] }
    })
    return vesselsEvents
  }
)

export const selectEventsWithRenderingInfo = createSelector(
  [selectEventsForTracks, selectEEZs, selectRFMOs, selectMPAs],
  (eventsForTrack, eezs = [], rfmos = [], mpas = []) => {
    const eventsWithRenderingInfo: RenderedEvent[][] = eventsForTrack.map(({ dataview, data }) => {
      const portExitEvents = (data || [])
        .filter((event) => event.type === EventTypes.Port)
        .map((event) => ({ ...event, timestamp: event.end as number, id: `${event.id}-exit` }))
      return (data || []).concat(portExitEvents).map((event: ActivityEvent, index) => {
        const regionDescription = getEventRegionDescription(event, eezs, rfmos, mpas)

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

            const portType = event.id.endsWith('-exit') ? 'exited' : 'entered'
            if (name) {
              const portLabel = [
                name,
                ...(flag ? [t(`flags:${flag}`, flag.toLocaleUpperCase())] : []),
              ].join(', ')
              description = t(`event.${portType}PortAt`, `${upperFirst(portType)} Port {{port}}`, {
                port: portLabel,
              })
            } else {
              description = t(`event.${portType}portAction`, `${upperFirst(portType)} Port`)
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
        const durationDiff = DateTime.fromMillis(event.end as number).diff(
          DateTime.fromMillis(event.start as number),
          ['hours', 'minutes']
        )

        const duration = durationDiff.toObject()

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
          duration: durationDiff.hours,
          timestamp: event.timestamp ?? (event.start as number),
        }
      })
    })
    return eventsWithRenderingInfo.flat()
  }
)
export const selectFilteredActivityHighlightEvents = createSelector(
  [selectEventsWithRenderingInfo, selectSettings],
  (eventsWithRenderingInfo, settings) => {
    return filterActivityHighlightEvents(eventsWithRenderingInfo, settings)
  }
)

const getEventRegionDescription = (
  event: ActivityEvent,
  eezs: Region[],
  rfmos: Region[],
  mpas: Region[]
) => {
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
      case 'mpa':
        return values
          .map((mpaId) => mpas.find((eez) => eez.id.toString() === mpaId)?.label ?? '')
          .filter((value) => value.length > 0)
          .join(', ')
      default:
        return values.join(', ')
    }
  }

  const regionsDescription = (['eez', 'rfmo', 'mpa'] as (keyof Regions)[])
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

export const selectEvents = createSelector([selectEventsWithRenderingInfo], (events) =>
  events.sort((a, b) => (a.start > b.start ? -1 : 1))
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

    return events.filter((event: RenderedEvent) => {
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
