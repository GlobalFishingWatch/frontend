import { useCallback } from 'react'

import type { ApiEvents } from '@globalfishingwatch/api-types'
import { RegionType } from '@globalfishingwatch/api-types'

import { useFetchRegionsData } from 'features/_vessels/vessel/activity/event/event.hook'
import { removeNonTunaRFMO } from 'features/_vessels/vessel/insights/insights.utils'
import { parseLonglineSetsToCSV } from 'features/_vessels/vessel/vessel.download'
import { useRegionNamesByType } from 'features/data/regions/regions.hooks'

// shared by the vessel and vessel group longline insights so both CSVs stay identical
export function useLonglineSetsCSV() {
  useFetchRegionsData()
  const { getRegionNamesByType } = useRegionNamesByType()
  return useCallback(
    (
      events: ApiEvents['entries'],
      vessels: Parameters<typeof parseLonglineSetsToCSV>[0]['vessels']
    ) =>
      parseLonglineSetsToCSV({
        events: events.map(removeNonTunaRFMO),
        vessels,
        getEEZNames: (ids) => getRegionNamesByType(RegionType.eez, ids),
      }),
    [getRegionNamesByType]
  )
}
