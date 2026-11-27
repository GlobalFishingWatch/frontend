import { describe, expect, it } from 'vitest'

import { getGraphLayers, getTrackTimeline } from './timebar-assistant-tool'

const day = (d: string) => new Date(`${d}T00:00:00.000Z`).getTime()

describe('getGraphLayers', () => {
  it('summarizes each sublayer of the frames inside the time range', () => {
    const layers = getGraphLayers(
      {
        loading: false,
        interval: 'DAY',
        sublayers: [
          { id: 'ais', unit: 'hours' },
          { id: 'vms', unit: 'hours' },
        ],
        frames: [
          // the chunk is buffered: frames outside the time range are left out
          { date: day('2024-12-31'), 0: 100, 1: 100 },
          { date: day('2025-01-01'), 0: 2, 1: 1 },
          { date: day('2025-01-02'), 0: 8, 1: 0 },
        ],
      },
      day('2025-01-01'),
      day('2025-01-03')
    )
    expect(layers[0]).toEqual({
      id: 'ais',
      unit: 'hours',
      points: 2,
      total: 10,
      mean: 5,
      max: { date: '2025-01-02T00:00:00.000Z', value: 8 },
      min: { date: '2025-01-01T00:00:00.000Z', value: 2 },
      series: [
        ['2025-01-01', 2],
        ['2025-01-02', 8],
      ],
    })
    expect(layers[1]).toMatchObject({ id: 'vms', total: 1 })
  })
})

describe('getTrackTimeline', () => {
  it('groups speed and depth by day and keeps the whole track span', () => {
    const timeline = getTrackTimeline(
      [
        [
          { timestamp: day('2024-12-30'), speed: 20 },
          { timestamp: day('2025-01-01'), speed: 2, elevation: -100 },
          { timestamp: day('2025-01-01') + 3_600_000, speed: 4, elevation: -300 },
          { timestamp: day('2025-01-02'), speed: 10 },
        ],
      ],
      day('2025-01-01'),
      day('2025-01-10')
    )
    expect(timeline).toEqual({
      trackStart: '2024-12-30T00:00:00.000Z',
      trackEnd: '2025-01-02T00:00:00.000Z',
      interval: 'day',
      speedKnots: [
        ['2025-01-01', 3, 4],
        ['2025-01-02', 10, 10],
      ],
      depthM: [['2025-01-01', -200, -300]],
    })
  })

  it('goes by month past two months', () => {
    const timeline = getTrackTimeline(
      [[{ timestamp: day('2025-01-05'), speed: 1 }]],
      day('2025-01-01'),
      day('2026-01-01')
    )
    expect(timeline).toMatchObject({ interval: 'month', speedKnots: [['2025-01', 1, 1]] })
  })
})
