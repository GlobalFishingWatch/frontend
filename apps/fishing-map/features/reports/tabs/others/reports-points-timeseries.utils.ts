import type { FourwingsDeckSublayer } from '@globalfishingwatch/deck-layers'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'

export type FourwingsFeaturesToTimeseriesParams = {
  start: number
  end: number
  interval: FourwingsInterval
  minVisibleValue?: number
  maxVisibleValue?: number
  sublayers: FourwingsDeckSublayer[]
}
export const pointFeaturesToTimeseries = (
  filteredFeatures: FilteredPolygons[],
  {
    start,
    end,
    interval,
    minVisibleValue,
    maxVisibleValue,
    sublayers,
  }: FourwingsFeaturesToTimeseriesParams
): ReportGraphProps[] => {
  return filteredFeatures.map(({ contained }, sourceIndex) => {
    const featureToTimeseries: ReportGraphProps = {
      interval,
      sublayers: sublayers.map((sublayer) => ({
        id: sublayer.id,
        legend: {
          color: sublayer.color,
          unit: sublayer.unit,
        },
      })),
      timeseries: [],
    }
    return featureToTimeseries
  })
}
