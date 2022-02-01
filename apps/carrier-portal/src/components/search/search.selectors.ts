import { createSelector } from 'reselect'
import flatMap from 'lodash/flatMap'
import { addMinutes, subMinutes } from 'date-fns'
import { SEARCH_TYPES, EVENT_DURATION_RANGE, DATE_FORMAT } from 'data/constants'
import {
  getFlagStatesWithCounter,
  getDonorFlagStatesWithCounter,
  getRfmoWithCounter,
  getPortOptions,
  getEezsWithCounter,
} from 'components/filters/filters.selectors'
import { SearchItem } from 'types/app.types'
import { getDatasetDates } from 'redux-modules/app/app.selectors'
import { getVesselWithLabel } from 'redux-modules/vessel/vessel.selectors'
import {
  isDefaultStartDate,
  isDefaultEndDate,
  getDateRange,
} from 'redux-modules/router/route.selectors'
import { parseDurationRangeToString, formatUTCDate } from 'utils'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const offset = new Date().getTimezoneOffset()
const addOffsetFn = offset > 0 ? addMinutes : subMinutes

export const getMonthsAfter = (yearsWithData: number[]): SearchItem[] =>
  flatMap(monthNames, (month, index) => {
    return yearsWithData.map((year) => {
      const date = new Date(year, index)
      const id = addOffsetFn(date, offset).toISOString()
      return { id, label: `${month} ${year}`, key: `start-${id}` }
    })
  })

export const getMonthsBefore = (yearsWithData: number[]): SearchItem[] =>
  flatMap(monthNames, (month, index) => {
    return yearsWithData.map((year) => {
      const date = new Date(year, index + 1, 0)
      const id = addOffsetFn(date, offset).toISOString()
      return { id, label: `End of ${month} ${year}`, key: `end-${id}` }
    })
  })

const getDays = (yearsWithData: number[], key: string): SearchItem[] =>
  flatMap(yearsWithData, (year) => {
    return Array.from(Array(12).keys()).reduce((monthsAccumulate: SearchItem[], month) => {
      //Day 0 is the last day in the previous month
      const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getDate()
      const daysOfMonth = Array.from(Array(daysInMonth).keys()).reduce(
        (daysAccumulate: SearchItem[], day: number) => {
          const date = new Date(Date.UTC(year, month, day + 1))
          const id = date.toISOString()
          daysAccumulate.push({
            id,
            key: `${key}-${id}`,
            label: formatUTCDate(id, DATE_FORMAT),
          })
          return daysAccumulate
        },
        []
      )
      return [...monthsAccumulate, ...daysOfMonth]
    }, [])
  })

export const getDurationRanges = createSelector([], () => {
  const [rangeMin, rangeMax] = EVENT_DURATION_RANGE
  const options = []
  for (let start = rangeMin; start < rangeMax; start++) {
    for (let end = start + 1; end <= rangeMax; end++) {
      const id = parseDurationRangeToString([start, end])
      options.push({
        type: SEARCH_TYPES.duration,
        id: id,
        key: id,
        label: `${id} hours`,
      })
    }
  }
  return options
})

export const getDatasetYears = createSelector(getDatasetDates, (datasetDates) => {
  const initialYear = new Date(datasetDates.start).getFullYear()
  const latestYear = new Date(datasetDates.end).getFullYear()
  const years = []
  for (let i = initialYear; i <= latestYear; i++) {
    years.push(i)
  }
  return years
})

export const getPortOptionsFiltered = createSelector(getPortOptions, (ports) => {
  return ports ? ports.filter((p) => !p.id?.includes('all-ports')) : null
})

export const getStaticOptions = createSelector(
  [
    getVesselWithLabel,
    getRfmoWithCounter,
    getEezsWithCounter,
    getFlagStatesWithCounter,
    getDonorFlagStatesWithCounter,
    getPortOptionsFiltered,
    getDatasetYears,
    getDurationRanges,
  ],
  (vessel, rfmos, eezs, flags, flagsDonor, ports, datasetYears, durationRanges) => {
    if (!rfmos || !eezs || !flags || !flagsDonor || !ports) return []
    const options = [
      ...rfmos.map((rfmo) => ({ ...rfmo, type: SEARCH_TYPES.rfmo })),
      ...flags.map((flag) => ({ ...flag, type: SEARCH_TYPES.flag })),
      ...flagsDonor.map((flag) => ({ ...flag, type: SEARCH_TYPES.flagDonor })),
      ...ports.map((port) => ({ ...port, type: SEARCH_TYPES.port })),
      ...eezs.map((eez) => ({ ...eez, type: SEARCH_TYPES.eez })),
      ...getMonthsAfter(datasetYears).map((after) => ({ ...after, type: SEARCH_TYPES.start })),
      ...getMonthsBefore(datasetYears).map((before) => ({ ...before, type: SEARCH_TYPES.end })),
      ...getDays(datasetYears, 'start').map((after) => ({ ...after, type: SEARCH_TYPES.start })),
      ...getDays(datasetYears, 'end').map((before) => ({
        ...before,
        type: SEARCH_TYPES.end,
      })),
      ...durationRanges,
    ]
    if (vessel) {
      options.push({ ...vessel, type: SEARCH_TYPES.vessel })
    }
    return options
  }
)

export const getStaticOptionsFilteredByDate = createSelector(
  [getStaticOptions, getDateRange, isDefaultStartDate, isDefaultEndDate],
  (options, dates, defaultStartDate, defaultEndDate) => {
    return options.filter((option) => {
      if (option.type === SEARCH_TYPES.start && !defaultEndDate) {
        return option.id < dates.end
      }
      if (option.type === SEARCH_TYPES.end && !defaultStartDate) {
        return option.id > dates.start
      }
      return true
    })
  }
)
