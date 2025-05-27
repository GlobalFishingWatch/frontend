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

export const searchPorts = (port: PortParams): PortSearchResult[] => {
  const { name, country } = port ?? {}
  if (!name && !country) return []

  const matchingPortsById = name
    ? matchSorter(ports, name, {
        keys: ['name'],
        threshold: matchSorter.rankings.CONTAINS,
      })
    : []

  if (matchingPortsById.length) {
    return matchingPortsById.slice(0, 10).map((port) => ({
      dataset: PORT_DATASET,
      id: port.id,
      label: port.name || '',
      flag: port.flag,
    }))
  }

  const matchingCountryPorts = country
    ? matchSorter(ports, country, {
        keys: ['flag'],
        threshold: matchSorter.rankings.EQUAL,
      })
    : []

  return matchingCountryPorts.slice(0, 10).map((port) => ({
    dataset: PORT_DATASET,
    id: port.id,
    label: port.name || '',
    flag: port.flag,
  }))
}
