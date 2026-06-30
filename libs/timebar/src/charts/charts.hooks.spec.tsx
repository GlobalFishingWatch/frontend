import { describe, expect, it } from 'vitest'

import { filterData } from './charts.hooks'
import type { TimebarChartData } from './charts.types'

describe('filterData', () => {
  it('keeps only chunks overlapping the range and uses start when end is missing', () => {
    const data: TimebarChartData = [
      {
        color: 'x',
        chunks: [
          { start: 0, end: 10 }, // overlaps [5,20]
          { start: 15 }, // no end -> treated as [15,15], overlaps
          { start: 1000, end: 1010 }, // outside
        ],
      },
    ]
    const result = filterData(data, new Date(5).toISOString(), new Date(20).toISOString())
    expect(result[0].chunks).toHaveLength(2)
    expect(result[0].chunks.map((c) => c.start)).toEqual([0, 15])
  })
})
