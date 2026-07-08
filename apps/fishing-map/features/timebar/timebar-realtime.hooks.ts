import { useEffect, useRef } from 'react'

import { REAL_TIME_DATA_UPDATE_INTERVAL_MINUTES } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { getMsUntilNextRealTimeUpdate, getRealTimeLatestAvailableDataDate } from 'utils/dates'

import { setRealTimeLatestUpdate } from './timebar.slice'

export function useRealTimeDataUpdates() {
  const dispatch = useAppDispatch()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    const clearTimers = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }

    const tick = () => {
      dispatch(setRealTimeLatestUpdate(getRealTimeLatestAvailableDataDate()))
    }

    tick()

    const msUntilNext = getMsUntilNextRealTimeUpdate()
    timeoutRef.current = setTimeout(() => {
      tick()
      intervalRef.current = setInterval(tick, REAL_TIME_DATA_UPDATE_INTERVAL_MINUTES * 60 * 1000)
    }, msUntilNext)

    return clearTimers
  }, [dispatch])
}
