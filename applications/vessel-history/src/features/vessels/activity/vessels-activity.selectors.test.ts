import { Filters } from 'features/profile/filters/filters.slice'
import { selectFilteredEvents, RenderedEvent } from './vessels-activity.selectors'
import {
  loiteringAndEncounterEvents,
  portVisitEvents,
} from './__mocks__/selectEventsWithRenderingInfo.mock'

jest.mock('features/profile/filters/filters.slice')

describe('selectFilteredEvents', () => {
  const cases: [string, string, string, RenderedEvent[][], Filters, number][] = [
    [
      'encounters',
      '2019-01-01',
      '2019-12-31',
      [...loiteringAndEncounterEvents, ...portVisitEvents] as any,
      {
        encounters: true,
        loiteringEvents: false,
        fishingEvents: false,
        portVisits: false,
        start: '2019-01-01',
        end: '2019-12-31',
      },
      2,
    ],
    [
      'loitering',
      '2019-01-01',
      '2019-12-31',
      [...loiteringAndEncounterEvents, ...portVisitEvents] as any,
      {
        encounters: false,
        loiteringEvents: true,
        fishingEvents: false,
        portVisits: false,
        start: '2019-01-01',
        end: '2019-12-31',
      },
      52,
    ],
    [
      'port_visit',
      '2019-01-01',
      '2019-12-31',
      [...loiteringAndEncounterEvents, ...portVisitEvents] as any,
      {
        encounters: false,
        loiteringEvents: false,
        fishingEvents: false,
        portVisits: true,
        start: '2019-01-01',
        end: '2019-12-31',
      },
      5,
    ],
  ]

  afterEach(() => {
    jest.clearAllMocks()
  })

  test.each(cases)(
    ' filtered by %p between %p and %p',
    (eventType, start, end, selectEventsWithRenderingInfo, selectFilters, expectedCount) => {
      const result = selectFilteredEvents.resultFunc(selectEventsWithRenderingInfo, selectFilters)
      expect(result).toMatchSnapshot()
      expect(result.length).toEqual(expectedCount)
    }
  )
})
