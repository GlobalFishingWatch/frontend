// @ts-nocheck
import dayjs from 'dayjs'
import { getDefaultFormat } from './internal-utils'

export const getHumanizedDates = (start, end) => {
  const format = getDefaultFormat(start, end)
  const mStart = dayjs(start).utc()
  const mEnd = dayjs(end).utc()
  const humanizedStart = mStart.format(format)
  const humanizedEnd = mEnd.format(format)
  const interval = mEnd.diff(mStart, 'day')
  return { humanizedStart, humanizedEnd, interval }
}

const getTimebarRangeAuto = (auto) => {
  const ONE_DAY = 24 * 60 * 60 * 1000
  const daysEndInnerOuterFromToday = auto.daysEndInnerOuterFromToday || 4
  const daysInnerExtent = auto.daysInnerExtent || 30
  // today - n days
  const now = new Date()
  // Minus the timezone offset to normalize dates
  const end = now.getTime() - now.getTimezoneOffset() * 60000 - daysEndInnerOuterFromToday * ONE_DAY
  // inner should be 30 days long
  const start = end - daysInnerExtent * ONE_DAY
  // start outer at beginning of year
  return { start, end }
}

const getTimebarRangeDefault = (range) => {
  return {
    start: range.innerExtent[0],
    end: range.innerExtent[1],
  }
}

export const getTimebarRangeByWorkspace = (timeline) => {
  return timeline.auto !== undefined
    ? getTimebarRangeAuto(timeline.auto)
    : getTimebarRangeDefault(timeline)
}

export const geoJSONTrackToTimebarFeatureSegments = ({ features = [] } = {}) => {
  const graph = features
    .filter((feature) => feature.properties.type === 'track')
    .map((feature) => {
      const coordProps = feature.properties.coordinateProperties
      const featureKeys = Object.keys(coordProps)
      const segment = []
      coordProps.times.forEach((time, i) => {
        const point = {
          date: time,
        }
        featureKeys.forEach((key) => {
          point[key] = coordProps[key][i]
        })
        segment.push(point)
      })
      return segment
    })
  return graph
}

export const getLastX = (num, unit, latestAvailableDataDate) => {
  const latestAvailableDataDateUTC = dayjs(
    latestAvailableDataDate ? new Date(latestAvailableDataDate) : new Date()
  ).utc()
  return {
    start: latestAvailableDataDateUTC.subtract(num, unit).toISOString(),
    end: latestAvailableDataDateUTC.toISOString(),
  }
}

export const getLast30Days = (latestAvailableDataDate) => {
  return getLastX(30, 'day', latestAvailableDataDate)
}
