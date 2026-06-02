import { DateTime } from 'luxon'

import type { VesselDataIdentity } from 'features/vessel/vessel.slice'

export function isRegistryInTimerange(registry: VesselDataIdentity, start: string, end: string) {
  const registryStart = DateTime.fromISO(registry.transmissionDateFrom).toMillis()
  const registryEnd = DateTime.fromISO(registry.transmissionDateTo).toMillis()
  const timerangeStart = DateTime.fromISO(start).toMillis()
  const timerangeEnd = DateTime.fromISO(end).toMillis()
  return Math.max(registryStart, timerangeStart) < Math.min(registryEnd, timerangeEnd)
}
