import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import { parseFourwings } from './parse-fourwings'

describe('parse-fourwings', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  describe('parseFourwings', () => {
    it('should return empty array when no options', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwings(buffer)

      expect(result).toEqual([])
    })

    it('should return empty array when options has no fourwings', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwings(buffer, {})

      expect(result).toEqual([])
    })

    it('should return empty array when fourwings has no buffersLength', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwings(buffer, {
        fourwings: {
          cols: [113],
          rows: [53],
          bufferedStartDate: 0,
          interval: 'HOUR',
          sublayers: 1,
        } as any,
      })

      expect(result).toEqual([])
    })

    it('should return empty array when buffersLength is empty array', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwings(buffer, {
        fourwings: {
          cols: [113],
          rows: [53],
          bufferedStartDate: 0,
          interval: 'HOUR',
          sublayers: 1,
          buffersLength: [],
        } as any,
      })

      expect(result).toEqual([])
    })
  })
})
