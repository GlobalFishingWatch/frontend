import type { Field } from '@globalfishingwatch/api-types'

import { trackValueArrayToSegments } from './track-value-array-to-segments'

describe('trackValueArrayToSegments', () => {
  test('parses elevation properly', () => {
    const valueArray = [
      -2147483648, 1, 0, -42342480, 47021440, 1562724078, 10300000, -3943, 270600000, 1, 782340,
    ]
    const fields: Field[] = [
      'lonlat' as Field,
      'timestamp' as Field,
      'speed' as Field,
      'elevation' as Field,
      'course' as Field,
      'night' as Field,
      'distance_from_port' as Field,
    ]
    const result = trackValueArrayToSegments(valueArray, fields)
    expect(result).toEqual([
      [
        {
          longitude: -42.34248,
          latitude: 47.02144,
          timestamp: 1562724078000,
          speed: 10.3,
          elevation: -3943,
          course: 270.6,
          night: 1,
          distance_from_port: 782340,
        },
      ],
    ])
  })
})
