import type { FourwingsFeatureProperties, FourwingsInterval } from '../lib/types'

import { CONFIG_BY_INTERVAL } from './time'

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
    const sublayerDateData = data[
      getFourwingsValueTimestamp(interval, tileStartFrame, startOffset, valueIndex)
    ]
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
