import { DateTime } from 'luxon'
import type { ExportData } from 'types'

import labeledTrackJson from './__mocks__/labeled_track.json'
import { extractLabeledTrack } from './tracks.utils'

describe('tracks.utils', () => {
  test('extractLabeledTrack build segments properly', () => {
    const result = extractLabeledTrack(labeledTrackJson as ExportData)
    expect(result).toEqual({
      end: DateTime.fromISO('2020-07-15T00:25:06.000Z').toJSDate(),
      segments: [
        {
          action: 'dredging',
          end: 1594771215000,
          endLatitude: 55.469683,
          endLongitude: 9.6832,
          start: 1594771215000,
          startLatitude: 55.469683,
          startLongitude: 9.6832,
        },
        {
          action: 'transiting',
          end: 1594771507000,
          endLatitude: 55.469933,
          endLongitude: 9.6845,
          start: 1594771215000,
          startLatitude: 55.469683,
          startLongitude: 9.6832,
        },
        {
          action: 'dredging',
          end: 1594771607000,
          endLatitude: 55.47005,
          endLongitude: 9.684866,
          start: 1594771607000,
          startLatitude: 55.47005,
          startLongitude: 9.684866,
        },
        {
          action: 'transiting',
          end: 1594771811000,
          endLatitude: 55.470483,
          endLongitude: 9.6852,
          start: 1594771811000,
          startLatitude: 55.470483,
          startLongitude: 9.6852,
        },
        {
          action: 'dredging',
          end: 1594771811000,
          endLatitude: 55.470483,
          endLongitude: 9.6852,
          start: 1594771811000,
          startLatitude: 55.470483,
          startLongitude: 9.6852,
        },
        {
          action: 'dumping',
          end: 1594772706000,
          endLatitude: 55.470233,
          endLongitude: 9.684816,
          start: 1594772107000,
          startLatitude: 55.4697,
          startLongitude: 9.682616,
        },
      ],
      start: DateTime.fromISO('2020-07-15T00:00:15.000Z').toJSDate(),
    })
  })
})
