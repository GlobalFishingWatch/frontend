export type PortSource = 'AIS' | 'VMS'

// A port belongs to a source when that source saw encounters or loitering there.
// Mirrors PORT_SOURCES_PROPERTIES in @globalfishingwatch/api-types.
export function getPortSources(properties?: {
  encounters?: string
  loitering?: string
}): PortSource[] {
  const { encounters, loitering } = properties ?? {}
  const tags = [encounters, loitering].filter(Boolean).join(',').toUpperCase().split(',')
  return (['AIS', 'VMS'] as const).filter((source) => tags.includes(source))
}
