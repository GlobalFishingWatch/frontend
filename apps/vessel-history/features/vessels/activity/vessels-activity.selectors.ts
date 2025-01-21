import { createSelector } from '@reduxjs/toolkit'
import bearing from '@turf/bearing'
import { upperFirst } from 'lodash'
import { DateTime, Interval } from 'luxon'
import type { TrackPosition } from 'types'

import type {
  GapEvent,
  GapPosition,
  Regions} from '@globalfishingwatch/api-types';
import {
  DatasetTypes,
  EventTypes,
  ResourceStatus,
} from '@globalfishingwatch/api-types'
import {
  getDatasetConfigByDatasetType,
  getDatasetConfigsByDatasetType,
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
} from '@globalfishingwatch/dataviews-client'
import type { GeoJSONSourceSpecification } from '@globalfishingwatch/maplibre-gl'

import { APP_PROFILE_VIEWS, DEFAULT_WORKSPACE, EVENTS_COLORS } from 'data/config'
import {
  selectActiveTrackDataviews,
  selectTrackDatasetConfigsCallback,
} from 'features/dataviews/dataviews.selectors'
import { selectFilters } from 'features/event-filters/filters.slice'
import { t } from 'features/i18n/i18n'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import type { Region } from 'features/regions/regions.slice'
import { selectResources } from 'features/resources/resources.slice'
import { selectSettings } from 'features/settings/settings.slice'
import { selectWorkspaceProfileView } from 'features/workspace/workspace.selectors'
import type { ActivityEvent, PortVisitSubEvent } from 'types/activity'
import { getUTCDateTime } from 'utils/dates'
import { getEEZName } from 'utils/region-name-transform'

import { filterActivityHighlightEvents } from './vessels-highlight.worker'

export interface RenderedEvent extends ActivityEvent {
  color: string
  description: string
  descriptionGeneric: string
  regionDescription: string
  durationDescription?: string
  duration: number
  subEvent?: PortVisitSubEvent
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

      if (!hasTrackData || !tracksResourceResolved) {
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
    if (Object.keys(resources).length === 0) return []

    const vesselsEvents = trackDataviews.map((dataview) => {
      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
      const hasEventData =
        eventsResources?.length && eventsResources.every(({ url }) => resources[url]?.data)

      if (!hasEventData) {
        return { dataview, data: [] }
      }

      const data = eventsResources.flatMap(({ url }) => {
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

// This selet will split the gaps in two events before add the rendering data
export const selectEventsWithGapsSplit = createSelector([selectEventsForTracks], (events) => {
  return events // I dont know if this change is temporaly
  const eventsWithGapsSplit = events.map(({ dataview, data }) => {
    const updatedGaps = (data || []).reduce((newListEvents, event) => {
      if (event.type === EventTypes.Gap) {
        return [
          ...newListEvents,
          {
            ...event,
            timestamp: event.start,
            gap: {
              ...event.gap,
              isEventStart: true,
            } as GapEvent,
          },
          {
            ...event,
            timestamp: event.end,
            gap: {
              ...event.gap,
              isEventEnd: true,
            } as GapEvent,
          },
        ]
      }
      return [...newListEvents, event]
    }, [])

    return {
      dataview,
      data: updatedGaps,
    }
  })
  return eventsWithGapsSplit
})

export const selectEventsWithRenderingInfo = createSelector(
  [selectEventsWithGapsSplit, selectEEZs, selectRFMOs, selectMPAs],
  (eventsForTrack, eezs = [], rfmos = [], mpas = []) => {
    const eventsWithRenderingInfo: RenderedEvent[][] = eventsForTrack.map(({ dataview, data }) => {
      return (data || []).map((event: ActivityEvent) => {
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
            const { name, flag } = [
              event.port_visit?.intermediateAnchorage,
              event.port_visit?.startAnchorage,
              event.port_visit?.endAnchorage,
            ].reduce(
              (prev, curr) => {
                if (prev.name && prev.flag) return prev
                if (curr?.name && curr?.flag) return { name: curr.name, flag: curr.flag }
                return prev
              },
              { name: undefined, flag: undefined }
            )

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
              description = t(`event.${portType}PortAction`, `${upperFirst(portType)} Port`)
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
          case EventTypes.Gap:
            /*
            Will split the gaps?
            description = event.gap.isEventStart ? t('event.gapStart', 'Gap start in {{regionName}}', {
              regionName: regionDescription,
            }) : t('event.gapEnd', 'Gap end in {{regionName}}', {
              regionName: regionDescription,
            }) */
            description = t('event.gapAction', 'Likely Disabling in {{regionName}}', {
              regionName: regionDescription,
            })
            descriptionGeneric = t('event.gap', 'Likely Disabling')
            break
          default:
            description = t('event.unknown', 'Unknown event')
            descriptionGeneric = t('event.unknown', 'Unknown event')
        }
        const durationDiff = getUTCDateTime(event.end as number).diff(
          getUTCDateTime(event.start as number),
          ['hours', 'minutes']
        )

        const duration = durationDiff.toObject()

        const durationDescription =
          event.end > event.start
            ? [
                duration.hours && duration.hours > 0
                  ? t('event.hourAbbreviated', '{{count}}h', { count: duration.hours })
                  : '',
                duration.minutes && duration.minutes > 0
                  ? t('event.minuteAbbreviated', '{{count}}m', {
                      count: Math.round(duration.minutes as number),
                    })
                  : '',
              ].join(' ')
            : null

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

export const getEventRegionDescription = (
  event: ActivityEvent | GapPosition,
  eezs: Region[],
  rfmos: Region[],
  mpas: Region[]
) => {
  const getRegionNamesByType = (regionType: string, values: string[]) => {
    switch (regionType) {
      case 'eez':
        return values
          .map((eezId) =>
            getEEZName(
              eezs.find((eez) => {
                return eez.id?.toString() === eezId
              })
            )
          )
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
    .filter((regionType) => event?.regions && event?.regions[regionType]?.length > 0)
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
  [selectEvents, selectFilters, selectWorkspaceProfileView],
  (events, filters, profileView) => {
    const datasetStartDate =
      APP_PROFILE_VIEWS.filter((v) => v.id === profileView)
        .shift()
        ?.events_query_params.filter((query) => query.id === 'start-date')
        ?.shift()?.value ?? null

    // Need to parse the timerange start and end dates in UTC
    // to not exclude events in the boundaries of the range
    // if the user setting the filter is in a timezone with offset != 0
    const startDate = getUTCDateTime(
      datasetStartDate ?? filters.start ?? DEFAULT_WORKSPACE.availableStart
    )

    // Setting the time to 23:59:59.99 so the events in that same day
    //  are also displayed
    const endDateUTC = getUTCDateTime(filters.end ?? DEFAULT_WORKSPACE.availableEnd).toISODate()
    const endDate = getUTCDateTime(`${endDateUTC}T23:59:59.999Z`)
    const interval = Interval.fromDateTimes(startDate, endDate)

    return events.filter((event: RenderedEvent) => {
      if (
        !interval.contains(getUTCDateTime(event.start as number)) &&
        !interval.contains(getUTCDateTime(event.end as number))
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
      if (event.type === 'gap') {
        return filters.gapEvents
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

// t('event.enteredPortAt', 'Entered Port {{port}}')
// t('event.exitedPortAt', 'Exited Port {{port}}')
// t('event.enteredPortAction', 'Entered Port')
// t('event.exitedPortAction', 'Exited Port')
