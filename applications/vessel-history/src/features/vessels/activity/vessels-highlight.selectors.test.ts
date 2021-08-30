import { anyRegion } from 'features/regions/regions.slice'
import { Settings } from 'features/settings/settings.slice'
import { RenderedEvent } from './vessels-activity.selectors'
import { selectActivityHighlightEvents } from './vessels-highlight.selectors'
import { fishingEvents, emptySettings } from './__mocks__/highlight.mock'
import {
  loiteringAndEncounterEvents,
  portVisitEvents,
} from './__mocks__/selectEventsWithRenderingInfo.mock'

describe('selectActivityHighlightEvents', () => {
  const cases: [string, RenderedEvent[][], Partial<Settings>, number][] = [
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
      },
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
  ]

  afterEach(() => {
    jest.clearAllMocks()
  })

  test.each(cases)(
    'highlights %p',
    (testCaseDescription, selectEventsWithRenderingInfo, selectSettings, expectedCount) => {
      const result = selectActivityHighlightEvents.resultFunc(
        selectEventsWithRenderingInfo,
        selectSettings
      )
      expect(result.length).toEqual(expectedCount)
      expect(result).toMatchSnapshot()
    }
  )
})
