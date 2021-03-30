import { AsyncThunkAction, Dispatch } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { Report, ReportStatus } from '@globalfishingwatch/api-types/dist'
import { AsyncError } from 'utils/async-slice'
import { createSingleReportThunk, CreateReport, DateRange } from './analysis.slice'

jest.mock('@globalfishingwatch/api-client')

describe('Reports Slice', () => {
  let api: jest.Mocked<typeof GFWAPI>

  beforeAll(() => {
    api = GFWAPI as any
  })

  afterAll(() => {
    jest.unmock('@globalfishingwatch/api-client')
  })

  describe('Create single report thunk', () => {
    let action: AsyncThunkAction<
      Report,
      CreateReport,
      {
        rejectValue: AsyncError
      }
    >
    let dispatch: Dispatch // Create the "spy" properties
    let getState: () => unknown

    let arg: CreateReport
    let result: Report

    beforeEach(() => {
      // initialize new spies
      dispatch = jest.fn()
      getState = jest.fn()

      api.fetch.mockClear()
      api.fetch.mockResolvedValue(result)

      arg = {
        datasets: ['public-fishing-tracks:v20190502'],
        dateRange: {
          // Using dates in ART timezone that converted to UTC
          // should fall in the next day (2012-01-01)
          // to ensure we are performing the conversion
          start: '2011-12-31T21:00:00-0300',
          end: '2012-12-31T21:00:00-0300',
        } as DateRange,
        filters: {
          flag: ['CHI', 'ARG'],
          fleet: ['large-fleet'],
          origin: ['some', 'origin'],
          geartype: ['gear', 'types'],
          vessel_type: ['vessel', 'types'],
        },
        geometry: {
          type: 'Feature',
          geometry: {
            coordinates: [
              [
                [0, 0],
                [0, 0],
              ],
            ],
            type: 'Polygon',
          },
          properties: { id: 1 },
        },
        name: 'foo bar report',
      }

      result = {
        id: '9d34df2f-87df-4d5b-baae-1dbb57eda64f',
        name: 'report',
        userId: 95,
        userType: 'user',
        completedDate: undefined,
        startedDate: undefined,
        downloaded: false,
        createdAt: '2021-02-22T17:11:19.681Z',
        status: ReportStatus.NotStarted,
      }

      action = createSingleReportThunk(arg)
    })

    // Test that our thunk is calling the API using the arguments we expect
    it('calls the api correctly', async () => {
      const actual = await action(dispatch, getState, undefined)
      const expectedParams = [
        '/v1/reports',
        {
          body: {
            datasets: ['public-fishing-tracks:v20190502'],
            dateRange: ['2012-01-01', '2013-01-01'],
            filters: [
              "flag IN ('CHI', 'ARG') AND fleet IN ('large-fleet') AND origin IN ('some', 'origin') AND geartype IN ('gear', 'types') AND vessel_type IN ('vessel', 'types')",
            ],
            geometry: {
              type: 'Feature',
              geometry: {
                coordinates: [
                  [
                    [0, 0],
                    [0, 0],
                  ],
                ],
                type: 'Polygon',
              },
              properties: { id: 1 },
            },
            name: 'foo bar report',
            timeGroup: 'none',
            type: 'detail',
          },
          method: 'POST',
        },
      ]
      const expectedResult = {
        meta: {
          arg: {
            datasets: ['public-fishing-tracks:v20190502'],
            dateRange: { end: '2012-12-31T21:00:00-0300', start: '2011-12-31T21:00:00-0300' },
            filters: {
              flag: ['CHI', 'ARG'],
              fleet: ['large-fleet'],
              origin: ['some', 'origin'],
              geartype: ['gear', 'types'],
              vessel_type: ['vessel', 'types'],
            },
            geometry: {
              type: 'Feature',
              geometry: {
                coordinates: [
                  [
                    [0, 0],
                    [0, 0],
                  ],
                ],
                type: 'Polygon',
              },
              properties: { id: 1 },
            },
            name: 'foo bar report',
          },
          requestId: expect.any(String),
          requestStatus: 'fulfilled',
        },
        type: 'report/createsingle/fulfilled',
      }

      expect(api.fetch).toHaveBeenCalledWith(...expectedParams)
      expect(actual).toEqual(expectedResult)
    })
  })
})
