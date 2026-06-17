import { describe, expect, it } from 'vitest'

import { CONFIG_BY_INTERVAL } from './time'
import {
  accumulateFourwingsSublayerByFrame,
  accumulateSublayerValuesByFrame,
  getFourwingsValueTimestamp,
} from './timestamps'

/**
 * getGraphDataFromFourwingsHeatmap (fishing-map) delegates feature accumulation
 * to accumulateSublayerValuesByFrame. These tests guard the timestamp migration
 * that removed stored dates arrays from heatmap and vector tiles.
 */
describe('fourwings graph aggregation', () => {
  const createDateMap = (timestamps: number[]) =>
    timestamps.reduce(
      (acc, timestamp) => {
        acc[timestamp] = { [0]: 0, count: [0] }
        return acc
      },
      {} as Record<number, Record<number, number> & { count: number[] }>
    )

  it('aggregates heatmap values using derived timestamps', () => {
    const data = createDateMap([0, 3_600_000])

    accumulateSublayerValuesByFrame({
      interval: 'HOUR',
      tileStartFrame: 0,
      startOffset: 0,
      values: [10, 20],
      data,
      sublayerIndex: 0,
    })

    expect(data[0][0]).toBe(10)
    expect(data[3_600_000][0]).toBe(20)
  })

  it('aggregates vector velocities using derived timestamps', () => {
    const data = createDateMap([0, 3_600_000])

    accumulateSublayerValuesByFrame({
      interval: 'HOUR',
      tileStartFrame: 0,
      startOffset: 0,
      values: [5, 15],
      data,
      sublayerIndex: 0,
    })

    expect(data[0][0]).toBe(5)
    expect(data[3_600_000][0]).toBe(15)
  })

  it('falls back to chunkBufferedStart when tileStartFrame is missing on the feature', () => {
    const bufferedStart = Date.UTC(2024, 5, 1)
    const chunkTileStartFrame = CONFIG_BY_INTERVAL.DAY.getIntervalFrame(bufferedStart)
    const timestamps = [0, 1].map((index) =>
      CONFIG_BY_INTERVAL.DAY.getIntervalTimestamp(chunkTileStartFrame + index)
    )
    const data = createDateMap(timestamps)

    accumulateFourwingsSublayerByFrame({
      interval: 'DAY',
      properties: { startOffsets: [0] },
      chunkBufferedStart: bufferedStart,
      values: [10, 20],
      data,
      sublayerIndex: 0,
    })

    expect(data[timestamps[0]][0]).toBe(10)
    expect(data[timestamps[1]][0]).toBe(20)
  })

  it('aggregates with tileStartFrame and sublayer startOffset passed separately', () => {
    const timestamp = getFourwingsValueTimestamp('HOUR', 2, 1, 0)
    const data = createDateMap([timestamp])

    accumulateSublayerValuesByFrame({
      interval: 'HOUR',
      tileStartFrame: 2,
      startOffset: 1,
      values: [42],
      data,
      sublayerIndex: 0,
    })

    expect(data[timestamp][0]).toBe(42)
  })

  it('matches legacy dates-based aggregation for the same cell values', () => {
    const values = [10, 20]
    const legacyDates = values.map((_, index) => getFourwingsValueTimestamp('HOUR', 0, 0, index))
    const legacyData = legacyDates.reduce(
      (acc, date, index) => {
        acc[date] = { 0: values[index], count: [1] }
        return acc
      },
      {} as Record<number, Record<number, number> & { count: number[] }>
    )

    const derivedData = createDateMap(legacyDates)
    accumulateSublayerValuesByFrame({
      interval: 'HOUR',
      tileStartFrame: 0,
      startOffset: 0,
      values,
      data: derivedData,
      sublayerIndex: 0,
    })

    legacyDates.forEach((date) => {
      expect(derivedData[date][0]).toBe(legacyData[date][0])
    })
  })
})
