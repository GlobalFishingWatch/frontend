import { describe, expect, it } from 'vitest'

import type { IdentityVessel } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { getVesselTransmissionDates, isTimerangeOutsideTransmissions } from './vessel.utils'

const vessel = {
  dataset: 'public-global-vessel-identity:v4.0',
  [VesselIdentitySourceEnum.SelfReported]: [
    { id: 'a', transmissionDateFrom: '2018-05-01', transmissionDateTo: '2019-03-01' },
    { id: 'b', transmissionDateFrom: '2016-01-01', transmissionDateTo: '2017-06-01' },
  ],
  [VesselIdentitySourceEnum.Registry]: [
    {
      vesselInfoReference: 'c',
      transmissionDateFrom: '2010-01-01',
      transmissionDateTo: '2022-11-01',
    },
  ],
} as unknown as IdentityVessel

describe('getVesselTransmissionDates', () => {
  it('spans the earliest and latest dates of the self reported identities, ignoring registry', () => {
    expect(getVesselTransmissionDates(vessel)).toEqual({
      transmissionDateFrom: '2016-01-01',
      transmissionDateTo: '2019-03-01',
    })
  })

  it('returns empty dates without a vessel', () => {
    expect(getVesselTransmissionDates(null)).toEqual({
      transmissionDateFrom: '',
      transmissionDateTo: '',
    })
  })
})

describe('isTimerangeOutsideTransmissions', () => {
  const { transmissionDateFrom, transmissionDateTo } = getVesselTransmissionDates(vessel)
  const check = (start: string, end: string) =>
    isTimerangeOutsideTransmissions({ start, end }, transmissionDateFrom, transmissionDateTo)

  it('is false when the timerange overlaps the transmissions', () => {
    expect(check('2015-01-01', '2016-06-01')).toBe(false)
    expect(check('2019-01-01', '2019-02-01')).toBe(false)
    expect(check('2019-02-01', '2024-01-01')).toBe(false)
  })

  it('is true when the timerange is fully before or after the transmissions', () => {
    expect(check('2010-01-01', '2015-12-31')).toBe(true)
    expect(check('2019-04-01', '2024-01-01')).toBe(true)
  })

  it('is false when dates are missing', () => {
    expect(isTimerangeOutsideTransmissions(null, transmissionDateFrom, transmissionDateTo)).toBe(
      false
    )
    expect(isTimerangeOutsideTransmissions({ start: '2023-01-01', end: '2024-01-01' }, '', '')).toBe(
      false
    )
  })
})
