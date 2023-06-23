import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import { upperFirst } from 'lodash'
import bearing from '@turf/bearing'
import { useTranslation } from 'react-i18next'
import {
  getDatasetConfigByDatasetType,
  getDatasetConfigsByDatasetType,
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
} from '@globalfishingwatch/dataviews-client'
import {
  DatasetTypes,
  EventTypes,
  GapEvent,
  GapPosition,
  Regions,
  ResourceStatus,
} from '@globalfishingwatch/api-types'
import { DEFAULT_WORKSPACE, EVENTS_COLORS } from 'data/config'
//import { selectFilters } from 'features/event-filters/filters.slice'
import { t } from 'features/i18n/i18n'
import { ActivityEvent, PortVisitSubEvent } from 'types/activity'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import { getEEZName } from 'utils/region-name-transform'
import { Region } from 'features/regions/regions.slice'
import { selectResources } from 'features/resources/resources.slice'
import { getUTCDateTime } from 'utils/dates'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { selectVesselEventsFilteredByTimerange } from '../vessel.selectors'

export interface RenderedEvent extends ActivityEvent {
  color: string
  description: string
  descriptionGeneric: string
  regionDescription: string
  durationDescription?: string
  duration: number
  subEvent?: PortVisitSubEvent
}

//const { t } = useTranslation(['translations', 'dataTerminology'])
export const selectTrackResources = createSelector(
  [selectVesselEventsFilteredByTimerange, selectResources],
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

export const selectEventsWithRenderingInfo = createSelector(
  [selectVesselEventsFilteredByTimerange, selectEEZs, selectRFMOs, selectMPAs],
  (eventsForTrack, eezs = [], rfmos = [], mpas = []) => {
    console.log(rfmos)
    const eventsWithRenderingInfo: RenderedEvent[] = eventsForTrack.map((event: ActivityEvent) => {
      const regionDescription = getEventRegionDescription(event, eezs, rfmos, mpas)
      let description = ''
      let descriptionGeneric = ''
      switch (event.type) {
        case EventTypes.Encounter:
          if (event.encounter) {
            description = regionDescription
              ? t(
                  'dataTerminology:event.encounterActionWith',
                  'had an encounter with {{vessel}} in {{regionName}}',
                  {
                    vessel:
                      event.encounter.vessel.name ??
                      t('dataTerminology:event.encounterAnotherVessel', 'another vessel'),
                    regionName: regionDescription,
                  }
                )
              : t(
                  'dataTerminology:event.encounterActionWithNoRegion',
                  'Encounter with {{vessel}}',
                  {
                    vessel:
                      event.encounter.vessel.name ??
                      t('dataTerminology:event.encounterAnotherVessel', 'another vessel'),
                  }
                )
          }
          descriptionGeneric = t('dataTerminology:event.encounter')
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
            description = t(
              `dataTerminology:event.${portType}PortAt`,
              `${upperFirst(portType)} Port {{port}}`,
              {
                port: portLabel,
              }
            )
          } else {
            description = t(
              `dataTerminology:event.${portType}PortAction`,
              `${upperFirst(portType)} Port`
            )
          }
          descriptionGeneric = t('dataTerminology:event.port')
          break
        case EventTypes.Loitering:
          description = t('dataTerminology:event.loiteringAction', 'Loitering in {{regionName}}', {
            regionName: regionDescription,
          })
          descriptionGeneric = t('dataTerminology:event.loitering')
          break
        case EventTypes.Fishing:
          description = t('dataTerminology:event.fishingAction', 'Fishing in {{regionName}}', {
            regionName: regionDescription,
          })
          descriptionGeneric = t('dataTerminology:event.fishing')
          break
        case EventTypes.Gap:
          /*
            Will split the gaps?
            description = event.gap.isEventStart ? t('event.gapStart', 'Gap start in {{regionName}}', {
              regionName: regionDescription,
            }) : t('event.gapEnd', 'Gap end in {{regionName}}', {
              regionName: regionDescription,
            }) */
          description = t('dataTerminology:event.gapAction', 'Likely Disabling in {{regionName}}', {
            regionName: regionDescription,
          })
          descriptionGeneric = t('dataTerminology:event.gap', 'Likely Disabling')
          break
        default:
          console.log(event.type)
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
      if (event.type === 'encounter') {
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

    return eventsWithRenderingInfo
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

export const selectFilteredEvents = createSelector([selectEvents], (events) => events)

// t('event.enteredPortAt', 'Entered Port {{port}}')
// t('event.exitedPortAt', 'Exited Port {{port}}')
// t('event.enteredPortAction', 'Entered Port')
// t('event.exitedPortAction', 'Exited Port')
