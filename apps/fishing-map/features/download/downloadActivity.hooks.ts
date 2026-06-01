import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'

import {
  downloadActivityLastReportThunk,
  selectHadDownloadActivityTimeoutError,
} from './downloadActivity.slice'

export function useActivityDownloadTimeoutRefresh() {
  const dispatch = useAppDispatch()
  const hadDownloadTimeoutError = useSelector(selectHadDownloadActivityTimeoutError)
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (!hadDownloadTimeoutError && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [hadDownloadTimeoutError])

  useEffect(() => {
    if (hadDownloadTimeoutError && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        dispatch(downloadActivityLastReportThunk())
      }, 10000)
    }
  }, [dispatch, hadDownloadTimeoutError])
}
