import type { Feature, Point } from 'geojson'
import type { DateTimeUnit, DurationUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { TimeFilterType } from '@globalfishingwatch/api-types'
import { getDateInIntervalResolution, getFeatureTimeRange } from '@globalfishingwatch/deck-layers'
import type {
  FourwingsFeature,
  FourwingsInterval,
  FourwingsPointFeature,
  FourwingsPositionFeature,
  FourwingsValuesAndStartFrameFeature,
} from '@globalfishingwatch/deck-loaders'
import {
  accumulateSublayerValuesByFrame,
  getFourwingsSublayerStartFrame,
} from '@globalfishingwatch/deck-loaders'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'

import type { FourwingsFeaturesToTimeseriesParams } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { getUTCDateTime } from 'utils/dates'

type GetGraphDataFromFourwingsFeaturesParams = Pick<
  FourwingsFeaturesToTimeseriesParams,
  | 'start'
  | 'end'
  | 'compareStart'
  | 'compareEnd'
  | 'interval'
  | 'sublayers'
  | 'aggregationOperation'
  | 'minVisibleValue'
  | 'maxVisibleValue'
>

type FeatureDates = Record<number, ActivityTimeseriesFrame & { count?: number[] }>
function getDatesPopulated({
  start,
  end,
  interval,
  sublayersLength,
  count = true,
}: {
  start: number
  end: number
  interval: FourwingsInterval
  sublayersLength: number
  count?: boolean
}): FeatureDates {
  const data = {} as FeatureDates
  const now = DateTime.now().toUTC().toMillis()
  let date = getUTCDateTime(start)
    .startOf(interval as DateTimeUnit)
    .toMillis()

  const startDate = getUTCDateTime(start)
  const endDate = getUTCDateTime(end && isFinite(end) ? end : now)

  const intervalDiff = Math.ceil(
    Object.values(
      endDate
        .diff(startDate, interval.toLowerCase() as DurationUnit, {
          conversionAccuracy: 'longterm',
        })
        .toObject()
    )[0]
  )
  const endPlusOne = getUTCDateTime(start)
    .plus({ [interval]: intervalDiff })
    .toMillis()

  while (date <= endPlusOne) {
    const dateToUse = date > now ? now : date
    data[dateToUse] = { date: dateToUse }
    if (count) {
      data[dateToUse].count = Array(sublayersLength).fill(0)
    }
    for (let i = 0; i < sublayersLength; i++) {
      data[dateToUse][i] = 0
    }
    date = getUTCDateTime(date)
      .plus({ [interval]: 1 })
      .toMillis()
  }
  return data
}

export function getGraphDataFromFourwingsPositions(
  features: FourwingsPositionFeature[] | FourwingsPointFeature[],
  {
    start,
    end,
    interval,
    sublayersLength,
  }: Pick<GetGraphDataFromFourwingsFeaturesParams, 'start' | 'end' | 'interval'> & {
    sublayersLength: number
  }
): ActivityTimeseriesFrame[] {
  if (!features?.length || !start || !end) {
    return []
  }
  const data = getDatesPopulated({ start, end, interval, sublayersLength, count: false })

  features.forEach((feature) => {
    const { stime, value, layer = 0 } = feature?.properties || {}
    if (stime && value) {
      const date = getDateInIntervalResolution(stime * 1000, interval)
      if (!data[date]) {
        data[date] = { date }
        for (let i = 0; i < sublayersLength; i++) {
          data[date][i] = 0
        }
      }
      data[date][layer] += value
    }
  })
  return Object.values(data)
}

export function getGraphDataFromPoints(
  features: Feature<Point>[],
  {
    start,
    end,
    interval,
    sublayersLength,
    startTimeProperty,
    endTimeProperty,
    timeFilterType,
  }: Pick<GetGraphDataFromFourwingsFeaturesParams, 'start' | 'end' | 'interval'> & {
    sublayersLength: number
    startTimeProperty: string
    endTimeProperty?: string
    timeFilterType?: TimeFilterType
  }
): ActivityTimeseriesFrame[] {
  if (!features?.length || !start || !end) {
    return []
  }
  const data = getDatesPopulated({ start, end, interval, sublayersLength })

  const dateBoundaries = Object.keys(data).map((dateString) => {
    const date = parseInt(dateString)
    const nextDate = getUTCDateTime(date)
      .plus({ [interval]: 1 })
      .toMillis()
    return { date, nextDate }
  })
  const boundaryStartDates = dateBoundaries.map(({ date }) => date)
  const firstBoundaryStart = boundaryStartDates[0]
  const lastBoundaryEnd = dateBoundaries[dateBoundaries.length - 1].nextDate

  const findOverlappingIndex = ({
    timestamp,
    isFirst,
  }: {
    timestamp: number
    isFirst: boolean
  }) => {
    if (isFirst) {
      if (timestamp < firstBoundaryStart) {
        return 0
      }
    } else {
      if (timestamp >= lastBoundaryEnd) {
        return dateBoundaries.length - 1
      }
    }
    let low = 0
    let high = dateBoundaries.length - 1
    let result = -1
    while (low <= high) {
      const mid = (low + high) >> 1
      if (isFirst) {
        if (dateBoundaries[mid].nextDate > timestamp) {
          result = mid
          high = mid - 1
        } else {
          low = mid + 1
        }
      } else {
        if (dateBoundaries[mid].date <= timestamp) {
          result = mid
          low = mid + 1
        } else {
          high = mid - 1
        }
      }
    }
    return result
  }

  features.forEach((feature) => {
    const properties = feature?.properties
    if (!properties) return

    const { featureStart: featureStartRaw, featureEnd: featureEndRaw } = getFeatureTimeRange(
      feature,
      {
        startTimeProperty,
        endTimeProperty,
        timeFilterType,
      }
    )
    const featureStart =
      typeof featureStartRaw === 'string' ? parseInt(featureStartRaw) : (featureStartRaw as number)
    const featureEnd =
      typeof featureEndRaw === 'string' ? parseInt(featureEndRaw) : (featureEndRaw as number)

    if (featureEnd < firstBoundaryStart || featureStart >= lastBoundaryEnd) {
      return
    }

    const startIndex = findOverlappingIndex({ timestamp: featureStart, isFirst: true })
    const endIndex = findOverlappingIndex({ timestamp: featureEnd, isFirst: false })

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return
    }

    const { layer = 0, values } = properties as {
      values?: number[]
      layer?: number
    }

    for (let i = startIndex; i <= endIndex; i++) {
      const { date, nextDate } = dateBoundaries[i]

      if (featureEnd < date || featureStart >= nextDate) {
        continue
      }

      const dateData = data[date]
      if (values?.length) {
        for (let index = 0; index < values.length; index++) {
          dateData[index] += values[index]
          dateData.count![index]++
        }
      } else {
        dateData[layer]++
      }
    }
  })

  return Object.values(data)
}

export function getGraphDataFromFourwingsHeatmap(
  features: FourwingsFeature[] | FourwingsValuesAndStartFrameFeature[] | Feature<Point>[],
  {
    start,
    end,
    compareStart,
    compareEnd,
    interval,
    sublayers,
    aggregationOperation,
    minVisibleValue,
    maxVisibleValue,
  }: GetGraphDataFromFourwingsFeaturesParams
): ActivityTimeseriesFrame[] {
  if (!features?.length || !start || !end) {
    return []
  }

  const sublayersLength = sublayers.length
  const data = {
    ...getDatesPopulated({ start, end, interval, sublayersLength }),
    ...(compareStart &&
      compareEnd && {
        ...getDatesPopulated({ start: compareStart, end: compareEnd, interval, sublayersLength }),
      }),
  }

  const areFourwingsFeatures = (features as FourwingsFeature[]).some(
    (f) => f.properties !== undefined
  )

  if (areFourwingsFeatures) {
    ;(features as FourwingsFeature[]).forEach((feature) => {
      const { values, velocities, tileStartFrame } = feature.properties

      if (velocities?.length) {
        accumulateSublayerValuesByFrame({
          interval,
          tileStartFrame,
          startOffset: getFourwingsSublayerStartFrame(feature.properties, 0),
          values: velocities,
          data,
          sublayerIndex: 0,
          minVisibleValue,
          maxVisibleValue,
        })
      }

      values?.forEach((sublayerValues, sublayerIndex) => {
        if (!sublayerValues?.length) {
          return
        }
        accumulateSublayerValuesByFrame({
          interval,
          tileStartFrame,
          startOffset: getFourwingsSublayerStartFrame(feature.properties, sublayerIndex),
          values: sublayerValues,
          data,
          sublayerIndex,
          minVisibleValue,
          maxVisibleValue,
        })
      })
    })
  } else {
    ;(features as FourwingsValuesAndStartFrameFeature[]).forEach((feature) => {
      for (let sublayerIndex = 0; sublayerIndex < feature.length; sublayerIndex++) {
        const sublayer = feature[sublayerIndex]
        const [values, startFrame] = sublayer || []
        if (!values || startFrame === undefined) {
          continue
        }
        accumulateSublayerValuesByFrame({
          interval,
          tileStartFrame: 0,
          startOffset: startFrame,
          values,
          data,
          sublayerIndex,
          minVisibleValue,
          maxVisibleValue,
        })
      }
    })
  }

  const timeseries = Object.values(data).map(({ date, count, ...rest }: any) => {
    Object.keys(rest).forEach((key) => {
      if (aggregationOperation === 'avg') {
        const indexKey = parseInt(key)
        if (count && rest[indexKey]) {
          rest[indexKey] = rest[indexKey] / count[indexKey]
        }
      }
    })
    return { date, ...rest }
  })

  // Inserts a middle point for every sublayer at the start and end of the dataset
  const extentStarts = sublayers
    .map((sublayer, index) => ({ extent: sublayer.extentStart, index }))
    .sort((a, b) => (a?.extent ?? 0) - (b?.extent ?? 0))
  const extentEnds = sublayers
    .map((sublayer, index) => ({ extent: sublayer.extentEnd, index }))
    .sort((a, b) => (a?.extent ?? 0) - (b?.extent ?? 0))

  extentStarts.forEach(({ extent, index }) => {
    if (extent) {
      const firstSublayerValueIndex = timeseries.findIndex((v) => v.date >= extent!) - 1
      if (firstSublayerValueIndex >= 0) {
        // Use the initial date as a new element with all values 0
        const initialStartDate = timeseries[firstSublayerValueIndex].date
        const startData = {
          ...timeseries[firstSublayerValueIndex],
          date: initialStartDate,
          [index]: 0,
        }
        timeseries.splice(firstSublayerValueIndex, 0, startData)
        // And replace the original first element with the dataset start extent
        timeseries[firstSublayerValueIndex + 1].date = extent
      }
    }
  })

  extentEnds.forEach(({ extent, index }) => {
    if (extent) {
      const lastSublayerValueIndex = timeseries.findLastIndex((frame) => frame[index] > 0)
      if (lastSublayerValueIndex >= 0) {
        const lastSublayerTime = timeseries[lastSublayerValueIndex]
        const nextIntervalDate = DateTime.fromMillis(lastSublayerTime.date, {
          zone: 'utc',
        })
          .plus({ [interval]: 1 })
          .toMillis()
        if (nextIntervalDate > extent) {
          timeseries.splice(lastSublayerValueIndex + 1, 0, {
            ...lastSublayerTime,
            date: extent,
            [index]: 0,
          })
        }
      }
    }
  })

  return timeseries.sort((a, b) => a.date - b.date)
}
