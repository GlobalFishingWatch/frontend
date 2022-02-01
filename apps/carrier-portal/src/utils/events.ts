import differenceInMinutes from 'date-fns/differenceInMinutes'
import { Event, EventVessel, EventNextPort } from 'types/api/models'
import { EventsFilter, EventsDurationRange } from 'types/app.types'
import { EVENT_DURATION_RANGE, EVENT_TYPES } from 'data/constants'

export const isDurationRangeDefault = (
  durationRange: EventsDurationRange,
  defaultSelection = EVENT_DURATION_RANGE
) => {
  const [durationMin, durationMax] = durationRange
  const [defaultMin, defaultMax] = defaultSelection

  return durationMin === defaultMin && durationMax === defaultMax
}

export const isEventInDurationRange = (event: Event, durationRange: EventsDurationRange) => {
  if (isDurationRangeDefault(durationRange)) return true
  const eventDuration = differenceInMinutes(event.end, event.start) / 60
  const [durationMin, durationMax] = durationRange

  // When default selected on max limit means there is no maximum filter
  if (durationMax === EVENT_DURATION_RANGE[1]) {
    return eventDuration >= durationMin
  }

  return eventDuration >= durationMin && eventDuration <= durationMax
}

export const isEventActive = (event: Event, filters: EventsFilter) => {
  const { rfmos, eezs, ports, flags, donorFlags, dateRange, durationRange } = filters

  const vesselFlag = event.vessel && event.vessel.flag
  const donorVesselFlag = event.encounter && event.encounter.vessel.flag
  const matchesEez =
    !eezs || !eezs.length || (event.eezs && event.eezs.some((eez) => eezs.includes(eez)))

  const matchesRfmo =
    !rfmos ||
    !rfmos.length ||
    (event.eezs &&
      event.eezs.length === 0 &&
      event.rfmos &&
      event.rfmos.some((rfmo) => rfmos.includes(rfmo)))
  let nextPortMatch = event.nextPort ? event.nextPort.id : ''
  if (!nextPortMatch && event.vessel.nextPort) {
    nextPortMatch = event.vessel.nextPort.id
  }
  const portMatch = event.port ? event.port.id : ''
  const matchesPort =
    !ports ||
    !ports.length ||
    (ports && (ports.includes(nextPortMatch) || ports.includes(portMatch)))
  const matchesFlag = !flags || !flags.length || (flags && flags.includes(vesselFlag))
  const matchesDonorFlag =
    !donorFlags ||
    !donorFlags.length ||
    !donorVesselFlag ||
    (donorFlags && donorFlags.includes(donorVesselFlag))
  const matchesDateRange = event.start >= dateRange.start && event.end <= dateRange.end
  const matchesDurationRange = isEventInDurationRange(event, durationRange)

  return (
    matchesRfmo &&
    matchesEez &&
    matchesPort &&
    matchesFlag &&
    matchesDonorFlag &&
    matchesDateRange &&
    matchesDurationRange
  )
}

export const parseEvent = (event: Event, carrierAsMainVessel = false): Event => {
  let carrierVessel: EventVessel
  let encounterVessel: EventVessel | undefined
  let nextPort: EventNextPort | undefined
  if (event.type === EVENT_TYPES.encounter && event.encounter) {
    carrierVessel = event.vessel
    if (carrierAsMainVessel) {
      carrierVessel = event.vessel.type === 'carrier' ? event.vessel : event.encounter.vessel
    }
    encounterVessel = event.encounter.vessel
    if (carrierAsMainVessel) {
      encounterVessel = event.vessel.type === 'fishing' ? event.vessel : event.encounter.vessel
    }
    if (carrierVessel.flag === 'TWN') {
      carrierVessel.flag = 'TAI'
    }
    if (encounterVessel.flag === 'TWN') {
      encounterVessel.flag = 'TAI'
    }
    nextPort = carrierVessel && carrierVessel.nextPort
  } else {
    carrierVessel = event.vessel
    if (carrierVessel.flag === 'TWN') {
      carrierVessel.flag = 'TAI'
    }
    nextPort = event.vessel.nextPort
  }

  return {
    ...event,
    vessel: carrierVessel,
    nextPort,
    ...(event.encounter && {
      encounter: {
        ...event.encounter,
        ...(encounterVessel && {
          vessel: encounterVessel,
        }),
      },
    }),
  }
}

export const transformDownloadEvent = (event: Event) => {
  const {
    start,
    end,
    type,
    position,
    rfmos,
    eezs,
    vessel,
    encounter,
    loitering,
    port,
  } = parseEvent(event, true)
  return {
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    latitude: position.lat,
    longitude: position.lon,
    type,
    rfmos,
    eezs,
    vessel: {
      name: vessel.name,
      flag: vessel.flag,
      ssvid: vessel.ssvid,
      ...(event.type === 'encounter' && {
        type: vessel.type,
      }),
    },
    ...(encounter && {
      encounter: {
        vessel: {
          name: encounter.vessel.name,
          flag: encounter.vessel.flag,
          ssvid: encounter.vessel.ssvid,
          type: encounter.vessel.type,
        },
        medianDistanceKilometers: encounter.medianDistanceKilometers,
        medianSpeedKnots: encounter.medianSpeedKnots,
        authorized: encounter.authorized,
        authorizationStatus: encounter.authorizationStatus,
        regionAuthorizations: encounter.regionAuthorizations,
        vesselAuthorizations: encounter.vesselAuthorizations.map(({ id, authorizations }) => {
          const vesselAuthorization = vessel.id === id ? vessel : encounter.vessel
          return {
            name: vesselAuthorization?.name,
            authorizations,
          }
        }),
      },
    }),
    ...(port && {
      port: {
        name: port.name,
        flag: port.flag,
        latitude: port.position.lat,
        longitude: port.position.lon,
      },
    }),
    ...(loitering && {
      loitering,
    }),
  }
}

interface EventStats {
  flags: { [key: string]: number }
  donorFlags: { [key: string]: number }
  rfmos: { [key: string]: number }
  ports: { [key: string]: number }
  eezs: { [key: string]: number }
}
export const calculateEventsStats = (events: Event[]): EventStats | null => {
  // TODO add also ports by country stats
  return events
    ? events.reduce<EventStats>(
        (acc, event) => {
          const { vessel, encounter, rfmos, eezs, nextPort } = event

          const eventFlag = (vessel && vessel.flag) || ''
          if (eventFlag) {
            if (!acc.flags[eventFlag]) acc.flags[eventFlag] = 0
            acc.flags[eventFlag] += 1
          }
          const eventDonorFlag = (encounter && encounter.vessel.flag) || ''
          if (eventDonorFlag) {
            if (!acc.donorFlags[eventDonorFlag]) acc.donorFlags[eventDonorFlag] = 0
            acc.donorFlags[eventDonorFlag] += 1
          }
          if (nextPort && nextPort.id) {
            if (!acc.ports[nextPort.id]) acc.ports[nextPort.id] = 0
            acc.ports[nextPort.id] += 1
          }
          if (rfmos) {
            rfmos.forEach((rfmo) => {
              if (!acc.rfmos[rfmo]) acc.rfmos[rfmo] = 0
              acc.rfmos[rfmo] += 1
            })
          }
          if (eezs) {
            eezs.forEach((eez) => {
              if (!acc.eezs[eez]) acc.eezs[eez] = 0
              acc.eezs[eez] += 1
            })
          }
          return acc
        },
        { flags: {}, donorFlags: {}, rfmos: {}, ports: {}, eezs: {} }
      )
    : null
}

export const getAuthorizationsByVesselType = (event: Event, vesselType: 'carrier' | 'fishing') => {
  const vesselId = event.vessel.type === vesselType ? event.vessel.id : event.encounter?.vessel.id
  if (!vesselId) return []
  return event.encounter?.vesselAuthorizations?.find(({ id }) => id === vesselId)?.authorizations
}
