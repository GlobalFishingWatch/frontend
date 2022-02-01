import { createSelector } from 'reselect'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import { EventVessel } from '@globalfishingwatch/api-types'
import { calculateEventsStats, isEventActive } from 'utils/events'
import { filterRfmos, parseVesselType } from 'utils'
import { AppState } from 'types/redux.types'
import { EventType } from 'types/app.types'
import {
  getFlagStatesConfig,
  getPortsConfig,
  getRfmosConfigIds,
} from 'redux-modules/app/app.selectors'
import {
  getVesselTimelineEvents,
  getVesselDetailsData,
} from 'redux-modules/vessel/vessel.selectors'
import { Port } from 'types/api/models'
import {
  getEventType,
  getStartDate,
  getEndDate,
  getRfmos,
  hasVesselSelected,
  getEventFilters,
  getSearchParamsWithLabel,
} from '../router/route.selectors'

const getEvents = (state: AppState) => state.events

export const getCurrentEvents = createSelector(
  [getEvents, getEventType],
  (events, currentEventType: EventType) => {
    return events[currentEventType] !== undefined ? events[currentEventType] : null
  }
)
export const getCurrentEventsFilters = createSelector([getCurrentEvents], (events) => {
  return events ? events.filters : null
})

export const getCurrentEventsList = createSelector(
  [getCurrentEvents, getRfmosConfigIds],
  (eventsData, rfmosConfigIds) => {
    if (!eventsData || !eventsData.events || !rfmosConfigIds) return null
    return eventsData.events.map((event) => ({
      ...event,
      rfmos: filterRfmos(event.rfmos, rfmosConfigIds),
    }))
  }
)

export const getCurrentEventsListFiltered = createSelector(
  [getCurrentEventsList, getEventFilters],
  (events, filters) => {
    if (events === null) return null
    return events.filter((event) => {
      return isEventActive(event, filters)
    })
  }
)

export const getCurrentEventsStats = createSelector([getCurrentEventsList], (events) => {
  return events ? calculateEventsStats(events) : null
})

export const getCurrentEventsListFilteredGeojson = createSelector(
  [getCurrentEventsListFiltered],
  (events) => {
    if (!events) return null
    return {
      type: 'FeatureCollection',
      features: events.map((event) => ({
        type: 'Feature',
        properties: {
          eventId: event.id,
          authorized: event.encounter && event.encounter.authorized,
          authorizationStatus: event.encounter && event.encounter.authorizationStatus,
        },
        geometry: {
          type: 'Point',
          coordinates: [event.position.lon, event.position.lat],
        },
      })),
    }
  }
)

export const getEventsLoaded = createSelector([getCurrentEvents], (events) => {
  return events ? events.loaded : false
})

export const getEventsLoading = createSelector([getCurrentEvents], (events) => {
  return events ? events.loading : false
})

export const getEventsError = createSelector([getCurrentEvents], (events) => {
  return events ? events.error : ''
})

export const getEventsByPage = createSelector(
  [getCurrentEventsListFiltered, getVesselTimelineEvents, hasVesselSelected],
  (homeEvents, vesselEvents, hasVessel) => (hasVessel ? vesselEvents : homeEvents)
)

function joinArrayReadable(elements: any) {
  return [elements.slice(0, -1).join(', '), elements.slice(-1)[0]].join(
    elements.length < 2 ? '' : ' and '
  )
}
export const getCurrentEventsInfo = createSelector(
  [
    getEventsByPage,
    hasVesselSelected,
    getStartDate,
    getEndDate,
    getRfmos,
    getSearchParamsWithLabel('port'),
    getEventType,
    getFlagStatesConfig,
    getVesselDetailsData,
  ],
  (events, hasVessel, startDate, endDate, rfmos, ports, eventType, flags, vesselData) => {
    let totalCarriers = ''
    let totalFlags = ''
    let numberOfFlags
    let totalEvents
    let rfmo = ''
    let totalPorts: string | number = ''
    let eventsByType = {}
    const vesselInfo = {
      type: '',
      flag: '',
      name: '',
    }
    if (events !== null && events.length > 0) {
      const carriersGrouped = uniqBy(events, 'vessel.id')
      const numberOfCarriers = carriersGrouped.length
      const event = events.find((e) => !!e.vessel.flag && !!e.vessel.name)
      const vessel: any = event ? event.vessel : {}

      if (numberOfCarriers === 1) {
        totalCarriers = vessel && vessel.name
        vesselInfo.type = vesselData ? parseVesselType(vesselData.type) : ''
        vesselInfo.name = vessel.name
      } else totalCarriers = `${numberOfCarriers} carriers`

      numberOfFlags = uniq(events.map((e) => e.vessel && e.vessel.flag).filter((f) => !!f)).length
      if (numberOfFlags === 1) {
        const firstFlag = flags !== null && flags.find((f) => f.id === (vessel && vessel.flag))
        if (firstFlag) {
          totalFlags = firstFlag ? firstFlag.label : ''
          vesselInfo.flag = firstFlag.id
        }
      } else totalFlags = `${numberOfFlags} flag States`

      const numberOfEvents = events.length
      if (numberOfEvents === 1)
        totalEvents = `1 ${!hasVessel ? eventType : 'event'}${
          eventType === 'loitering' && !hasVessel ? ' event' : ''
        }`
      else if (numberOfEvents !== 0)
        totalEvents = `${numberOfEvents} ${!hasVessel ? eventType : 'event'}${
          eventType === 'loitering' && !hasVessel ? ' events' : 's'
        }`

      eventsByType = events.reduce((acc, event) => {
        if (!acc[event.type]) {
          acc[event.type] = 1
        } else {
          acc[event.type] += 1
        }
        return acc
      }, {} as { [key: string]: number })

      rfmo = rfmos === null ? '' : joinArrayReadable(rfmos)
      if (ports !== null) {
        totalPorts = ports.length > 1 ? parseInt(ports.length, 10) : ports[0].label
      }
    }
    return {
      startDate,
      endDate,
      rfmo,
      totalPorts,
      totalCarriers,
      numberOfFlags,
      totalFlags,
      totalEvents,
      eventsByType,
      vessel: vesselInfo,
    }
  }
)

export const getCurrentEventsFlags = createSelector(
  [getCurrentEventsListFiltered, getFlagStatesConfig],
  (events, flagsConfig) => {
    if (events === null || !flagsConfig) return null
    const eventsByFlag = events.reduce((acc, event) => {
      if (!event.vessel || !event.vessel.flag) return acc

      if (!acc[event.vessel.flag]) {
        acc[event.vessel.flag] = 0
      }
      acc[event.vessel.flag] += 1
      return acc
    }, {} as { [key: string]: number })
    const flags = Object.keys(eventsByFlag).map((flag) => {
      const { id, label }: any = flagsConfig.find((f) => f.id === flag) || {}
      return {
        id,
        label,
        flag,
        events: eventsByFlag[flag],
      }
    })
    return orderBy(flags, ['events', 'label'], ['desc', 'asc'])
  }
)

export const getCurrentEventsCarriers = createSelector([getCurrentEventsListFiltered], (events) => {
  if (!events) return null
  const eventsByCarrier = groupBy(events, 'vessel.id')
  const carriers = Object.keys(eventsByCarrier)
    .filter((k) => k !== 'undefined')
    .map((carrier) => {
      const event = eventsByCarrier[carrier][0]
      const vessel = event.vessel || ({} as EventVessel)
      return {
        ...vessel,
        id: carrier,
        label: vessel.name || vessel.ssvid,
        flag: vessel.flag,
        events: eventsByCarrier[carrier].length,
      }
    })
  return orderBy(carriers, ['events', 'label'], ['desc', 'asc'])
})

interface EventPort extends Port {
  flag: string
  events: number
}

export const getCurrentEventsPorts = createSelector(
  [getCurrentEventsListFiltered, getPortsConfig],
  (events, portsData) => {
    if (!events || !portsData) return null

    const eventsByPort = groupBy(events, 'nextPort.id')
    const ports: EventPort[] = Object.keys(eventsByPort).flatMap<any>((port) => {
      const portData = portsData.find((p) => p.id === port)
      if (!portData) return []

      return {
        id: portData.id || 'unknown',
        label: portData.label || 'Unknown',
        iso: portData.iso,
        flag: portData.iso,
        events: eventsByPort[port].length,
        coordinates: {
          lat: portData.lat,
          lon: portData.lon,
        },
      }
    })
    return orderBy(ports, ['events', 'label'], ['desc', 'asc'])
  }
)

export const getCurrentEventsPortsGeojson = createSelector(
  [getCurrentEventsPorts],
  (eventsPorts) => {
    if (!eventsPorts) return null
    return {
      type: 'FeatureCollection',
      features: eventsPorts.map((port) => ({
        type: 'Feature',
        properties: {
          id: port.id,
          iso: port.iso,
          label: port.label,
          events: port.events,
        },
        geometry: {
          type: 'Point',
          coordinates: [port.coordinates.lon, port.coordinates.lat],
        },
      })),
    }
  }
)
