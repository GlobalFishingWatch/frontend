import { FourwingsInterval } from '../lib/types'

export const CONFIG_BY_INTERVAL: Record<
  FourwingsInterval,
  Record<'getTime' | 'getIntervalFrame', any>
> = {
  HOUR: {
    getTime: (frame: number) => {
      return frame * 1000 * 60 * 60
    },
    getIntervalFrame: (timestamp: number) => {
      return timestamp / (1000 * 60 * 60)
    },
  },
  DAY: {
    getTime: (frame: number) => {
      return frame * 1000 * 60 * 60 * 24
    },
    getIntervalFrame: (timestamp: number) => {
      return timestamp / (1000 * 60 * 60 * 24)
    },
  },
  MONTH: {
    getTime: (frame: number) => {
      const year = Math.floor(frame / 12)
      const month = frame % 12
      return Date.UTC(year, month)
    },
    getIntervalFrame: (timestamp: number) => {
      const date = new Date(timestamp)
      return date.getFullYear() * 12 + date.getMonth()
    },
  },
  YEAR: {
    getTime: (frame: number) => {
      return Date.UTC(frame)
    },
    getIntervalFrame: (timestamp: number) => {
      const date = new Date(timestamp)
      return date.getFullYear()
    },
  },
}

export const getTimeRangeKey = (start: number, end: number) => {
  return `${start}-${end}`
}
