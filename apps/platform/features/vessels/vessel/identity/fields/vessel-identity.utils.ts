import { DateTime } from 'luxon'

import type { CombinedSourceInfo } from '@globalfishingwatch/api-types'

import type { VesselLastIdentity } from 'features/vessels/search/search.slice'

export function getIsCombinedSourceInTimerange(
  identity: VesselLastIdentity,
  combinedSource: CombinedSourceInfo
) {
  const { yearTo, yearFrom } = combinedSource
  const startDate = DateTime.fromISO(identity.transmissionDateFrom)
  const endDate = DateTime.fromISO(identity.transmissionDateTo)
  const sourceYearFrom = DateTime.fromISO(yearFrom.toString())
  const sourceYearTo = DateTime.fromISO(yearTo.toString()).endOf('year')
  const sourceOverlapsTimeRange =
    sourceYearFrom.toMillis() <= endDate.toMillis() &&
    sourceYearTo.toMillis() >= startDate.toMillis()
  return sourceOverlapsTimeRange
}

export function getCombinedSourceSort(combinedSource: CombinedSourceInfo[]) {
  return combinedSource.sort((a, b) => (a.yearTo < b.yearTo ? 1 : -1))
}
