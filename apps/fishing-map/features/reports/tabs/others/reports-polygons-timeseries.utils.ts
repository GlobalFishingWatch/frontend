import type { Feature, Geometry } from 'geojson'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getFourwingsInterval, isFeatureInFilters } from '@globalfishingwatch/deck-loaders'

import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import type { ReportPolygonsDeckLayer } from 'features/reports/reports-timeseries.utils'
import { getUTCDateTime } from 'utils/dates'

function generateTimeBins(
  start: number,
  end: number,
  interval: FourwingsInterval
): { date: string; startMs: number; endMs: number }[] {
  const bins = []
  const now = DateTime.now().toUTC().toMillis()
  let current = getUTCDateTime(start)
    .startOf(interval.toLowerCase() as DateTimeUnit)
    .toMillis()

  while (current <= end) {
    const next = getUTCDateTime(current)
      .plus({ [interval]: 1 })
      .toMillis()
    const binStart = current > now ? now : current
    bins.push({
      date: new Date(binStart).toISOString(),
      startMs: binStart,
      endMs: next,
    })
    current = next
  }
  return bins
}

function toMs(value: unknown): number {
  if (value === undefined || value === null || value === '') return NaN
  return typeof value === 'string' ? parseInt(value) : (value as number)
}

function isPolygonInBin(
  feature: Feature<Geometry>,
  binStart: number,
  binEnd: number,
  startTimeProperty?: string,
  endTimeProperty?: string
): boolean {
  const props = (feature.properties || {}) as Record<string, unknown>
  const featureStart = startTimeProperty ? toMs(props[startTimeProperty]) || 0 : 0
  const rawEnd = endTimeProperty ? toMs(props[endTimeProperty]) : NaN
  const featureEnd = isNaN(rawEnd) ? Infinity : rawEnd
  return featureStart < binEnd && featureEnd >= binStart
}

export type GetPolygonsTimeseriesParams = {
  features: FilteredPolygons[]
  instance: ReportPolygonsDeckLayer
}

const getEmptyPolygonsTimeseries = (
  sublayers: ReportGraphProps['sublayers']
): ReportGraphProps => ({
  timeseries: [],
  interval: 'MONTH' as FourwingsInterval,
  sublayers,
})

export const getPolygonsTimeseries = ({
  features,
  instance,
}: GetPolygonsTimeseriesParams): ReportGraphProps => {
  const { startTime, endTime, startTimeProperty, endTimeProperty, layers } = instance.props
  const sublayerConfigs = layers?.flatMap((l) => l?.sublayers) || []
  const sublayers = sublayerConfigs.map((sublayer) => ({
    id: sublayer.id,
    legend: { color: sublayer.color },
  }))

  if (!startTime || !endTime || (!startTimeProperty && !endTimeProperty)) {
    return getEmptyPolygonsTimeseries(sublayers)
  }

  const featureGroup = features?.[0]
  if (!featureGroup) return getEmptyPolygonsTimeseries(sublayers)

  const { contained, overlapping } = featureGroup
  const interval = getFourwingsInterval(startTime, endTime)
  const bins = generateTimeBins(startTime, endTime, interval)

  const timeseries = bins.map(({ date, startMs, endMs }) => {
    const containedCounts = new Array(sublayers.length).fill(0)
    const overlappingCounts = new Array(sublayers.length).fill(0)

    for (const f of contained as Feature<Geometry>[]) {
      if (!isPolygonInBin(f, startMs, endMs, startTimeProperty, endTimeProperty)) continue
      for (let i = 0; i < sublayerConfigs.length; i++) {
        const sublayerConfig = sublayerConfigs[i]
        if (isFeatureInFilters(f, sublayerConfig?.filters, sublayerConfig?.filterOperators)) {
          containedCounts[i]++
        }
      }
    }
    for (const f of overlapping as Feature<Geometry>[]) {
      if (!isPolygonInBin(f, startMs, endMs, startTimeProperty, endTimeProperty)) continue
      for (let i = 0; i < sublayerConfigs.length; i++) {
        const sublayerConfig = sublayerConfigs[i]
        if (isFeatureInFilters(f, sublayerConfig?.filters, sublayerConfig?.filterOperators)) {
          overlappingCounts[i]++
        }
      }
    }

    return {
      date,
      min: containedCounts,
      max: overlappingCounts,
    }
  })

  return { interval, sublayers, timeseries }
}
