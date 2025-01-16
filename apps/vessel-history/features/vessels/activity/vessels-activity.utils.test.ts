import { AuthorizationOptions, EventTypes } from '@globalfishingwatch/api-types'

import type { ActivityEvent } from 'types/activity'

import { getEncounterStatus } from './vessels-activity.utils'

describe('vessels.activity.utils', () => {
  it('check the vessel event type', () => {
    const vesselEvent: ActivityEvent = {
      regions: {
        arg: [],
        eez: [],
        fao: [],
        hsp: [],
        kkp: [],
        vme: [],
        ames: [],
        rfmo: [],
        mpant: [],
        mparu: [],
        ocean: [],
        other: [],
        mregion: [],
        majorFao: [],
      },
      boundingBox: [],
      distances: {
        endDistanceFromShoreKm: 1,
        endDistanceFromPortKm: 1,
      },
      //fishing: undefined,
      id: '',
      type: EventTypes.Encounter,
      vessel: {
        id: '',
        ssvid: '',
        name: 'string',
      },
      start: '',
      end: '',
      rfmos: [],
      eezs: [],
      position: {
        lat: 1,
        lon: 1,
      },
      encounter: {
        authorizationStatus: AuthorizationOptions.Authorized,
        medianDistanceKilometers: 1,
        medianSpeedKnots: 1,
        vessel: {
          id: '',
          ssvid: '',
          name: 'string',
        },
        authorized: true,
        regionAuthorizations: [],
        vesselAuthorizations: [],
      },
      fishing: {
        totalDistanceKm: 1,
        averageSpeedKnots: 1,
        averageDurationHours: 1,
      },
    }
    const result = getEncounterStatus(vesselEvent)
    expect(result).toMatchSnapshot()
  })
})
