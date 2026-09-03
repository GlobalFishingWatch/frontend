import { describe, expect, it } from 'vitest'

import { readFourwingsHeaders } from './fourwings-heatmap.fetch'

const responseWith = (headers: Record<string, string>) => new Response(null, { headers })

describe('readFourwingsHeaders', () => {
  it('reads the 4wings tile headers into the given sublayer index', () => {
    const headers = readFourwingsHeaders(
      responseWith({
        'X-columns': '64',
        'X-rows': '64',
        'X-scale': '0.01',
        'X-offset': '-1.5',
        'X-empty-value': '4294967295',
      }),
      1
    )
    expect(headers).toEqual({
      cols: [undefined, 64],
      rows: [undefined, 64],
      scale: [undefined, 0.01],
      offset: [undefined, -1.5],
      noDataValue: [undefined, 4294967295],
    })
  })

  it('keeps a fractional empty value instead of truncating it', () => {
    const { noDataValue } = readFourwingsHeaders(responseWith({ 'X-empty-value': '251.5' }), 0)
    expect(noDataValue[0]).toBe(251.5)
  })

  // a NaN no-data value matches no cell, so the whole no-data grid would render
  it('drops an unparseable empty value rather than storing NaN', () => {
    const { noDataValue } = readFourwingsHeaders(responseWith({ 'X-empty-value': 'nan' }), 0)
    expect(noDataValue[0]).toBeUndefined()
  })

  it('accumulates into a shared target across sublayers', () => {
    const target = readFourwingsHeaders(responseWith({ 'X-columns': '32' }), 0)
    readFourwingsHeaders(responseWith({ 'X-columns': '16' }), 1, target)
    expect(target.cols).toEqual([32, 16])
  })
})
