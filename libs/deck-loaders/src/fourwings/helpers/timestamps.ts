import type { FourwingsFeatureProperties, FourwingsInterval } from '../lib/types'

import { CONFIG_BY_INTERVAL } from './time'

/** Absolute interval frame for a sublayer. Use as startOffset only when tileStartFrame is 0. */
export function getFourwingsSublayerStartFrame(
  properties: Pick<FourwingsFeatureProperties, 'tileStartFrame' | 'startOffsets'>,
  sublayerIndex: number
) {
  return (properties.tileStartFrame ?? 0) + (properties.startOffsets?.[sublayerIndex] ?? 0)
}

export function getFourwingsValueTimestamp(
  interval: FourwingsInterval,
  tileStartFrame: number,
  startOffset: number,
  valueIndex: number
): number {
  return CONFIG_BY_INTERVAL[interval].getIntervalTimestamp(
    tileStartFrame + startOffset + valueIndex
  )
}

export function findFourwingsValueIndexByTimestamp({
  interval,
  tileStartFrame = 0,
  startOffset = 0,
  valuesLength,
  timestamp,
}: {
  interval: FourwingsInterval
  tileStartFrame?: number
  startOffset?: number
  valuesLength: number
  timestamp: number
}): number {
  for (let valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
    if (
      getFourwingsValueTimestamp(interval, tileStartFrame, startOffset, valueIndex) === timestamp
    ) {
      return valueIndex
    }
  }
  return -1
}

export type FourwingsDateBucket = Record<number, number> & { count?: number[] }

export function accumulateSublayerValuesByFrame({
  interval,
  tileStartFrame = 0,
  startOffset = 0,
  values,
  data,
  sublayerIndex,
  minVisibleValue,
  maxVisibleValue,
}: {
  interval: FourwingsInterval
  tileStartFrame?: number
  startOffset?: number
  values: number[]
  data: Record<number, FourwingsDateBucket>
  sublayerIndex: number
  minVisibleValue?: number
  maxVisibleValue?: number
}) {
  const hasMinVisibleValue = minVisibleValue !== undefined
  const hasMaxVisibleValue = maxVisibleValue !== undefined

  for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
    const value = values[valueIndex]
    if (value === undefined) {
      continue
    }
    const sublayerDateData =
      data[getFourwingsValueTimestamp(interval, tileStartFrame, startOffset, valueIndex)]
    if (
      sublayerDateData &&
      (!hasMinVisibleValue || value >= minVisibleValue!) &&
      (!hasMaxVisibleValue || value <= maxVisibleValue!)
    ) {
      sublayerDateData[sublayerIndex] += value
      sublayerDateData.count![sublayerIndex]++
    }
  }
}

export function accumulateFourwingsSublayerByFrame({
  interval,
  properties,
  chunkBufferedStart,
  sublayerIndex,
  values,
  data,
  minVisibleValue,
  maxVisibleValue,
}: {
  interval: FourwingsInterval
  properties: Pick<FourwingsFeatureProperties, 'tileStartFrame' | 'startOffsets'>
  chunkBufferedStart: number
  sublayerIndex: number
  values: number[]
  data: Record<number, FourwingsDateBucket>
  minVisibleValue?: number
  maxVisibleValue?: number
}) {
  const chunkTileStartFrame = CONFIG_BY_INTERVAL[interval].getIntervalFrame(chunkBufferedStart)

  return accumulateSublayerValuesByFrame({
    interval,
    tileStartFrame: 0,
    startOffset: getFourwingsSublayerStartFrame(
      {
        tileStartFrame: properties.tileStartFrame ?? chunkTileStartFrame,
        startOffsets: properties.startOffsets,
      },
      sublayerIndex
    ),
    values,
    data,
    sublayerIndex,
    minVisibleValue,
    maxVisibleValue,
  })
}
