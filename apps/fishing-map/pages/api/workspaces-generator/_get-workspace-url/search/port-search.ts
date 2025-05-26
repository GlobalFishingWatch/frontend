import { matchSorter } from 'match-sorter'

import ports from '../data/ports.json'
import type { PortParams } from '../types'

const PORT_DATASET = 'public-global-port-visits-events:v3.1'

export const searchPort = async (port: PortParams) => {
  const { name, country } = port ?? {}
  if (!name && !country) return ''

  const matchingPortsById = name
    ? matchSorter(ports, name, {
        keys: ['name'],
      })
    : []

  if (!matchingPortsById.length) {
    return null
  }

  if (matchingPortsById.length === 1) {
    return { ...matchingPortsById[0], dataset: PORT_DATASET }
  }

  const matchingCountryPorts = country
    ? matchSorter(matchingPortsById, country, {
        keys: ['flag'],
        threshold: matchSorter.rankings.EQUAL,
      })
    : []

  return {
    ...(matchingCountryPorts.length > 1 ? matchingCountryPorts[0] : matchingPortsById[0]),
    dataset: PORT_DATASET,
  }
}
