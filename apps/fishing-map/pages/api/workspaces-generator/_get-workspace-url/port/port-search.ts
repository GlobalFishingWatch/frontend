import { matchSorter } from 'match-sorter'

import type { PortParams } from '../types'

import allPorts from './data/ports.json'

const PORT_DATASET = 'public-global-port-visits-events:v3.1'

const ports = allPorts.filter((port) => port.name)

type PortSearchResult = {
  dataset: string
  id: string
  label: string
  flag?: string
}

export const searchPort = (port: PortParams): PortSearchResult | null => {
  const { name, country } = port ?? {}
  if (!name && !country) return null

  const matchingPortsById = name
    ? matchSorter(ports, name, {
        keys: ['name'],
      })
    : []

  if (!matchingPortsById.length) {
    return null
  }

  if (matchingPortsById.length === 1) {
    return {
      dataset: PORT_DATASET,
      id: matchingPortsById[0].id,
      label: matchingPortsById[0].name || '',
      flag: matchingPortsById[0].flag,
    }
  }

  const matchingCountryPorts = country
    ? matchSorter(matchingPortsById, country, {
        keys: ['flag'],
        threshold: matchSorter.rankings.EQUAL,
      })
    : []

  if (matchingCountryPorts.length > 1) {
    return {
      dataset: PORT_DATASET,
      id: matchingCountryPorts[0].id,
      label: matchingCountryPorts[0].name || '',
      flag: matchingCountryPorts[0].flag,
    }
  }

  return {
    dataset: PORT_DATASET,
    id: matchingPortsById[0].id,
    label: matchingPortsById[0].name || '',
    flag: matchingPortsById[0].flag,
  }
}
