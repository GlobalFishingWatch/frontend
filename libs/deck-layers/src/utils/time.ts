import { Interval } from '@globalfishingwatch/layer-composer'

export const CONFIG_BY_INTERVAL: Record<Interval, Record<string, any>> = {
  HOUR: {
    getTime: (frame: number) => {
      return frame * 1000 * 60 * 60
    },
  },
  DAY: {
    getTime: (frame: number) => {
      return frame * 1000 * 60 * 60 * 24
    },
  },
  MONTH: {
    getTime: (frame: number) => {
      const year = Math.floor(frame / 12)
      const month = frame % 12
      return new Date(year, month, 1).getTime()
    },
  },
  YEAR: {
    getTime: (frame: number) => {
      return new Date(frame, 0, 1).getTime()
    },
  },
}