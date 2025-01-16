import { anyRegion } from 'features/regions/regions.slice'
import type { Settings } from 'features/settings/settings.slice'

import { emptySettings,fishingEvents } from './__mocks__/highlight.mock'
import {
  loiteringAndEncounterEvents,
  portVisitEvents,
} from './__mocks__/selectEventsWithRenderingInfo.mock'
import type { RenderedEvent } from './vessels-activity.selectors'
import { filterActivityHighlightEvents } from './vessels-highlight.worker'

describe('filterActivityHighlightEvents', () => {
  const cases: [string, RenderedEvent[], Settings, number][] = [
    [
      'fishing events taking place in any eez',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: [anyRegion.id],
        },
      },
      9,
    ],
    [
      'fishing events taking place in any eez with settings in null',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: [anyRegion.id],
          mpas: [],
          rfmos: [],
          distancePortLonger: null,
          distanceShoreLonger: null,
          duration: null,
        },
      } as any,
      9,
    ],
    [
      'no fishing events',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {},
      },
      0,
    ],
    [
      'fishing events filtered by duration > 5',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          duration: 5,
        },
      },
      6,
    ],
    [
      'fishing events filtered by distance from port > 17',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          distancePortLonger: 18,
        },
      },
      4,
    ],
    [
      'fishing events filtered by duration > 5 in an EEZ without events',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: ['-99999'],
          duration: 5,
        },
      },
      0,
    ],
    [
      'fishing events filtered by duration > 5 inside FINNISH EEZ',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: ['5676'],
          duration: 5,
        },
      },
      5,
    ],
    [
      'fishing events filtered by duration > 5 inside FINNISH EEZ',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: [5676],
          duration: 5,
        },
      },
      5,
    ],
    [
      'fishing events filtered by duration > 5 and distance from shore > 20 inside FINNISH EEZ',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: ['5676'],
          duration: 5,
          distanceShoreLonger: 20,
        },
      },
      1,
    ],
    [
      'fishing events filtered by distance from shore > 20 in any eez',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: [anyRegion.id],
          distanceShoreLonger: 24,
        },
      },
      2,
    ],
    [
      'fishing events filtered inside FINNISH EEZ',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: ['5676'],
        },
      },
      8,
    ],
    [
      'fishing events filtered inside FINNISH EEZ omitting other region filters',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        fishingEvents: {
          eezs: ['5676'],
          rfmos: ['-9'],
          mpas: ['-9'],
        },
      },
      8,
    ],
    [
      'port visit events on NOR country',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        portVisits: {
          flags: ['NOR'],
        },
      },
      11,
    ],
    [
      'port visit events on NOR country and duration > 4',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        portVisits: {
          flags: ['NOR'],
          duration: 4,
        },
      },
      6,
    ],
    [
      'port visit events on NOR country and duration > 4 and distance from shore > 0.1',
      [
        ...loiteringAndEncounterEvents,
        ...portVisitEvents,
        ...fishingEvents,
        {
          // adding a custom port visit to test this filter
          ...(() => {
            const last = portVisitEvents.slice(-1).pop()
            return {
              ...last,
              duration: 4.01,
              distances: {
                ...last?.distances,
                startDistanceFromShoreKm: 0.1,
                endDistanceFromShoreKm: 0.3,
              },
              port_visit: {
                ...last?.port_visit,
                startAnchorage: { ...last?.port_visit.startAnchorage, distance_from_shore_km: 0.1 },
                intermediateAnchorage: {
                  ...last?.port_visit.intermediateAnchorage,
                  distance_from_shore_km: 0.2,
                },
                endAnchorage: { ...last?.port_visit.endAnchorage, distance_from_shore_km: 0.3 },
              },
            }
          })(),
        },
      ] as any,
      {
        ...emptySettings,
        portVisits: {
          flags: ['NOR'],
          duration: 4,
          distanceShoreLonger: 0.1,
        },
      },
      1,
    ],
    [
      'port visit events with duration > 4',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        portVisits: {
          duration: 4,
        },
      },
      6,
    ],
    [
      'port visit events with disabled configuration',
      [...loiteringAndEncounterEvents, ...portVisitEvents, ...fishingEvents] as any,
      {
        ...emptySettings,
        enabled: false,
        portVisits: {
          duration: 4,
        },
      },
      0,
    ],
  ]

  afterEach(() => {
    jest.clearAllMocks()
  })

  test.each(cases)(
    'highlights %p',
    (_, selectEventsWithRenderingInfo, selectSettings, expectedCount) => {
      const result = filterActivityHighlightEvents(selectEventsWithRenderingInfo, selectSettings)
      const startTimes = result.map((event) => event.start)

      expect(result.length).toEqual(expectedCount)
      expect(startTimes).toEqual(startTimes.sort((a, b) => (a > b ? -1 : 1)))
      expect(result).toMatchSnapshot()
    }
  )
})
