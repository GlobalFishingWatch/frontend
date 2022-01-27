import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import { upperFirst } from 'lodash'
import bearing from '@turf/bearing'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { GeoJSONSourceSpecification } from '@globalfishingwatch/maplibre-gl'
import { DEFAULT_WORKSPACE, EVENTS_COLORS } from 'data/config'
import { selectFilters } from 'features/event-filters/filters.slice'
import { t } from 'features/i18n/i18n'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.selectors'
import { ActivityEvent, Regions } from 'types/activity'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import { getEEZName } from 'utils/region-name-transform'
import { Region } from 'features/regions/regions.slice'
import { selectResources } from 'features/resources/resources.slice'
import { selectSettings } from 'features/settings/settings.slice'
import { TrackPosition } from 'types'
import { filterActivityHighlightEvents } from './vessels-highlight.worker'

export interface RenderedEvent extends ActivityEvent {
  color: string
  description: string
  descriptionGeneric: string
  regionDescription: string
  durationDescription: string
  duration: number
}

export const selectTrackResources = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    const vesselsPositions = trackDataviews.map((dataview) => {
      const { url: tracksUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      const trackResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Tracks)
      const hasTrackData =
        trackResources?.length && trackResources.every(({ url }) => resources[url]?.data)
      const tracksResourceResolved =
        tracksUrl && resources[tracksUrl]?.status === ResourceStatus.Finished

      if (
        !hasTrackData ||
        !tracksResourceResolved //||
      ) {
        return { dataview, data: [] }
      }

      const data = trackResources.flatMap(({ url }) => {
        if (!url || !resources[url].data) {
          return []
        }

        return resources[url].data
      })
      return { dataview, data }
    })
    return vesselsPositions
  }
)

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
      return (data || []).map((event: ActivityEvent, index) => {
        const regionDescription = getEventRegionDescription(event, eezs, rfmos, mpas)
        let description = ''
        let descriptionGeneric = ''
        switch (event.type) {
          case EventTypes.Encounter:
            if (event.encounter) {
              description = regionDescription
                ? t(
                  'event.encounterActionWith',
                  'had an encounter with {{vessel}} in {{regionName}}',
                  {
                    vessel:
                      event.encounter.vessel.name ??
                      t('event.encounterAnotherVessel', 'another vessel'),
                    regionName: regionDescription,
                  }
                )
                : t('event.encounterActionWithNoRegion', 'Encounter with {{vessel}}', {
                  vessel:
                    event.encounter.vessel.name ??
                    t('event.encounterAnotherVessel', 'another vessel'),
                })
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

export const selectHighlightEventIds = createSelector(
  [selectFilteredActivityHighlightEvents],
  (highlights): { [key: string]: boolean } => {
    return highlights.reduce((map, event) => ({ ...map, [event.id]: true }), {})
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
        return values
          .map((regionId) => rfmos.find((rfmo) => rfmo.id.toString() === regionId)?.label ?? '')
          .filter((value) => value.length > 0)
          .join(', ')
      case 'mpa':
        return values
          .map((mpaId) => mpas.find((mpa) => mpa.id.toString() === mpaId)?.label ?? '')
          .filter((value) => value.length > 0)
          .join(', ')
      default:
        return values.join(', ')
    }
  }

  const regionsDescription = (['mpa', 'eez', 'rfmo'] as (keyof Regions)[])
    // use only regions with values
    .filter((regionType) => event?.regions && event?.regions[regionType].length > 0)

    // retrieve its corresponding names
    .map(
      (regionType) =>
        `${getRegionNamesByType(
          regionType,
          event?.regions[regionType]
            .map((regionId) => `${regionId}`)
            .filter((x: string) => x.length > 0)
        )}`
    )
    // combine all the regions with commas
    .join(', ')

  return regionsDescription ?? ''
}

export const selectEvents = createSelector([selectEventsWithRenderingInfo], (events) =>
  events.sort((a, b) => ((a.timestamp ?? a.start) > (b.timestamp ?? a.start) ? -1 : 1))
)

export const selectFilteredEvents = createSelector(
  [selectEvents, selectFilters],
  (events, filters) => {
    // Need to parse the timerange start and end dates in UTC
    // to not exclude events in the boundaries of the range
    // if the user setting the filter is in a timezone with offset != 0
    const startDate = DateTime.fromISO(filters.start ?? DEFAULT_WORKSPACE.availableStart, {
      zone: 'utc',
    })

    // Setting the time to 23:59:59.99 so the events in that same day
    //  are also displayed
    const endDateUTC = DateTime.fromISO(filters.end ?? DEFAULT_WORKSPACE.availableEnd, {
      zone: 'utc',
    }).toISODate()
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

export const selectVesselLastPositionGEOJson = createSelector(
  [selectTrackResources],
  (trackResources) => {
    const lastSegment: TrackPosition[] = trackResources
      .flatMap(({ data }) => data)
      .flat()
      .slice(-2) as TrackPosition[]

    const prevPosition = lastSegment[0] as TrackPosition
    const lastPosition = lastSegment.pop() as TrackPosition
    if (!lastPosition) return
    const course = prevPosition
      ? bearing(
        [prevPosition.longitude, prevPosition.latitude],
        [lastPosition.longitude, lastPosition.latitude]
      )
      : 0

    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [lastPosition].map((point) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.longitude as number, point.latitude as number],
          },
          properties: {
            id: ['last-position', point.timestamp].join('-'),
            times: point.timestamp,
            course: course,
          },
        })),
      },
    } as GeoJSONSourceSpecification
  }
)

export const selectFilteredEventsHighlighted = createSelector(
  [selectHighlightEventIds, selectFilteredEvents],
  (highlightIds, events) => {
    return events.filter((event) => highlightIds[event.id])
  }
)

export const countFilteredEventsHighlighted = createSelector(
  [selectFilteredEventsHighlighted],
  (events) => {
    return events.length
  }
)
