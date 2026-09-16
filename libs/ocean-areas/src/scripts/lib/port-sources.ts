import type { Feature } from 'geojson'

export type PortSource = 'ais' | 'vms'

export function getPortSources(port: Feature): PortSource[] {
  const { encounters, loitering, gaps } = port.properties ?? {}
  const tags = [encounters, loitering, gaps].filter(Boolean).join(',').split(',')
  return (['ais', 'vms'] as const).filter((source) => tags.includes(source))
}
