import { createSelector } from 'reselect'
import orderBy from 'lodash/orderBy'
import {
  getFlagStatesConfig,
  getRfmosConfig,
  getPortsConfig,
  getLatestFlagSearch,
  getLatestDonorFlagSearch,
  getLatestPortSearch,
  getFlagStateGroups,
  getLatestVesselSearch,
  getEezsConfig,
} from 'redux-modules/app/app.selectors'
import { getCurrentEventsStats } from 'redux-modules/events/events.selectors'
import { getVesselEventsStats, getVesselWithLabel } from 'redux-modules/vessel/vessel.selectors'
import { hasVesselSelected } from 'redux-modules/router/route.selectors'
import { SELECT_GROUPS } from 'data/constants'
import { SelectOptions } from './select/select'

const getEventsStats = createSelector(
  [getCurrentEventsStats, getVesselEventsStats, hasVesselSelected],
  (events, vesselEvents, hasVessel) => {
    return hasVessel ? vesselEvents : events
  }
)

export const getFlagStatesWithCounter = createSelector(
  [getFlagStatesConfig, getEventsStats],
  (flags, eventStats): SelectOptions[] | null => {
    if (!flags) return null

    const flagsWithCounter = flags.map((flag) => ({
      ...flag,
      ...(eventStats && eventStats.flags[flag.id] && { counter: eventStats.flags[flag.id] }),
    }))
    return flagsWithCounter
  }
)

export const getDonorFlagStatesWithCounter = createSelector(
  [getFlagStatesConfig, getEventsStats],
  (donorFlags, eventStats): SelectOptions[] | null => {
    if (!donorFlags) return null

    const donorFlagsWithCounter = donorFlags.map((donorFlag) => ({
      ...donorFlag,
      ...(eventStats &&
        eventStats.donorFlags[donorFlag.id] && { counter: eventStats.donorFlags[donorFlag.id] }),
    }))
    return donorFlagsWithCounter
  }
)

export const getFlagGroupsOptions = createSelector(
  [getFlagStatesConfig, getFlagStateGroups],
  (flags, flagStateGroups): SelectOptions[] | null => {
    if (!flags || !flagStateGroups) return null
    const flagGroups = flagStateGroups.map((group) => {
      return {
        id: group.id,
        label: group.name,
        values: group.isos.map((iso) => {
          const flag = flags.find((f) => f.id === iso)
          return { id: iso, label: flag ? flag.label : '' }
        }),
        group: SELECT_GROUPS.group,
        description: group.descripcion,
      }
    })

    return flagGroups
  }
)

export const getFlagsOptions = createSelector(
  [getFlagStatesWithCounter, getFlagGroupsOptions, getLatestFlagSearch],
  (flagStates, flagStateGroups, latestSearchs = []): SelectOptions[] | null => {
    if (!flagStates || !flagStateGroups) return null
    return [...latestSearchs, ...flagStateGroups, ...flagStates]
  }
)
export const getDonorFlagsOptions = createSelector(
  [getDonorFlagStatesWithCounter, getFlagGroupsOptions, getLatestDonorFlagSearch],
  (flagStates, flagStateGroups, latestSearchs = []): SelectOptions[] | null => {
    if (!flagStates || !flagStateGroups) return null
    return [...latestSearchs, ...flagStateGroups, ...flagStates]
  }
)

export const getRfmoWithCounter = createSelector(
  [getRfmosConfig, getEventsStats],
  (rfmos, eventStats): SelectOptions[] | null => {
    if (!rfmos) return null
    const rfmosWithCounter = rfmos.map((rfmo) => ({
      ...rfmo,
      ...(eventStats && eventStats.rfmos[rfmo.id] && { counter: eventStats.rfmos[rfmo.id] }),
    }))
    return rfmosWithCounter
  }
)

export const getEezsWithCounter = createSelector(
  [getEezsConfig, getEventsStats],
  (eezs, eventStats): SelectOptions[] | null => {
    if (!eezs) return null
    const eezsWithCounter = eezs.map((eez) => ({
      ...eez,
      ...(eventStats && eventStats.eezs[eez.id] && { counter: eventStats.eezs[eez.id] }),
    }))
    return eezsWithCounter
  }
)

export const getPortsWithGroupsOptions = createSelector(
  [getPortsConfig, getFlagStatesConfig],
  (ports, flags) => {
    if (!ports || !flags) return null
    const portsPerCountry: { [country: string]: string[] } = {}
    const portsOrdered: SelectOptions[] = ports.map((port) => {
      const flag = flags.find((f) => f.id === port.iso)
      if (flag) {
        if (!portsPerCountry[flag.id]) {
          portsPerCountry[flag.id] = []
        }
        portsPerCountry[flag.id].push(port.id)
      }
      return {
        id: port.id,
        label: flag ? `${flag.label}‚ ${port.label}` : port.label,
      }
    })
    Object.keys(portsPerCountry).forEach((iso) => {
      const portByCountry = portsPerCountry[iso]
      if (portByCountry.length > 1) {
        const flag = flags.find((f) => f.id === iso)
        if (flag) {
          portsOrdered.push({
            id: `${iso}-all-ports`,
            label: `${flag.label}, All ports`,
            values: portByCountry.map((p) => ({ id: p, label: p })),
          })
        }
      }
    })
    return orderBy(portsOrdered, 'label')
  }
)

export const getPortWithCounter = createSelector(
  [getPortsWithGroupsOptions, getEventsStats],
  (ports, eventStats): SelectOptions[] | null => {
    if (!ports) return null
    const portsWithCounter = ports.map((port) => ({
      ...port,
      ...(eventStats && eventStats.ports[port.id] && { counter: eventStats.ports[port.id] }),
    }))
    return portsWithCounter
  }
)

export const getPortOptions = createSelector(
  [getPortWithCounter, getLatestPortSearch],
  (ports, latestSearchs = []): SelectOptions[] | null => {
    if (!ports) return null
    return [...latestSearchs, ...ports]
  }
)

export const getVesselptions = createSelector(
  [getVesselWithLabel, getLatestVesselSearch],
  (vessel, latestSearchs = []): SelectOptions[] | null => {
    return vessel ? [...latestSearchs, vessel] : latestSearchs
  }
)
