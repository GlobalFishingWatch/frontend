import { describe, expect, it } from 'vitest'

import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'

import { getActivityLayers } from './report-assistant-tools'

describe('getActivityLayers', () => {
  it('matches the report summary and graph: end exclusive, plotted average, ± %', () => {
    const layer = {
      interval: 'DAY',
      sublayers: [{ id: 'ais', legend: { unit: 'hours' } }],
      timeseries: [
        { date: '2024-03-01T00:00:00.000Z', min: [9], max: [11] },
        // the graph plots the middle of the bounds: 198.79, not the 199.5 upper bound
        { date: '2024-03-02T00:00:00.000Z', min: [198.08], max: [199.5] },
        // the timebar end is exclusive: this bucket is not in the report
        { date: '2024-03-04T00:00:00.000Z', min: [100], max: [100] },
      ],
    } as unknown as ReportGraphProps
    const [ais] = getActivityLayers([layer], '2024-03-01T00:00:00.000Z', '2024-03-04T00:00:00.000Z')
    expect(ais).toMatchObject({
      id: 'ais',
      points: 3,
      total: 208.79,
      max: { date: '2024-03-02T00:00:00.000Z', value: 198.79 },
      // the missing day is an empty bucket, as in the graph
      min: { date: '2024-03-03T00:00:00.000Z', value: 0 },
      imprecision: 1,
    })
  })
})
