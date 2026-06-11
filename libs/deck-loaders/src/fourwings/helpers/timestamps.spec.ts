import { describe, expect, it } from 'vitest'

import {
  accumulateSublayerValuesByFrame,
  findFourwingsValueIndexByTimestamp,
  getFourwingsSublayerStartFrame,
  getFourwingsValueTimestamp,
} from './timestamps'

describe('fourwings timestamps', () => {
  describe('getFourwingsSublayerStartFrame', () => {
    it('sums tileStartFrame and the sublayer start offset', () => {
      expect(
        getFourwingsSublayerStartFrame({ tileStartFrame: 2, startOffsets: [0, 3] }, 1)
      ).toBe(5)
    })

    it('defaults missing values to zero', () => {
      expect(getFourwingsSublayerStartFrame({}, 0)).toBe(0)
    })
  })

  describe('getFourwingsValueTimestamp', () => {
    it('derives HOUR timestamps from tileStartFrame, startOffset and index', () => {
      expect(getFourwingsValueTimestamp('HOUR', 0, 0, 0)).toBe(0)
      expect(getFourwingsValueTimestamp('HOUR', 0, 0, 1)).toBe(3_600_000)
      expect(getFourwingsValueTimestamp('HOUR', 2, 1, 0)).toBe(10_800_000)
    })
  })

  describe('findFourwingsValueIndexByTimestamp', () => {
    it('returns the matching value index for a derived timestamp', () => {
      const timestamp = getFourwingsValueTimestamp('HOUR', 0, 0, 1)

      expect(
        findFourwingsValueIndexByTimestamp({
          interval: 'HOUR',
          tileStartFrame: 0,
          startOffset: 0,
          valuesLength: 3,
          timestamp,
        })
      ).toBe(1)
    })

    it('returns -1 when the timestamp is not in range', () => {
      expect(
        findFourwingsValueIndexByTimestamp({
          interval: 'HOUR',
          tileStartFrame: 0,
          startOffset: 0,
          valuesLength: 2,
          timestamp: 9_999_999,
        })
      ).toBe(-1)
    })
  })

  describe('accumulateSublayerValuesByFrame', () => {
    it('accumulates values into the date map using derived timestamps', () => {
      const data = {
        0: { 0: 0, count: [0] },
        3_600_000: { 0: 0, count: [0] },
      }

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
      expect(data[0].count![0]).toBe(1)
      expect(data[3_600_000].count![0]).toBe(1)
    })
  })
})
