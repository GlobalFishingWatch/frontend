import type { Filters } from 'features/event-filters/filters.slice'

import {
  loiteringAndEncounterEvents,
  portVisitEvents,
} from './__mocks__/selectEventsWithRenderingInfo.mock'
import type { RenderedEvent } from './vessels-activity.selectors';
import { selectFilteredEvents } from './vessels-activity.selectors'

jest.mock('features/event-filters/filters.slice')

describe('selectFilteredEvents', () => {
  const cases: [string, string, string, RenderedEvent[], Filters, number][] = [
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
      6,
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
