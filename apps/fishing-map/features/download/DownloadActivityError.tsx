import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { useAppDispatch } from 'features/app/app.hooks'

import {
  downloadActivityLastReportThunk,
  selectDownloadActivityErrorMsg,
  selectHadDownloadActivityTimeoutError,
  selectIsDownloadActivityConcurrentError,
  selectIsDownloadActivityError,
  selectIsDownloadActivityTimeoutError,
  selectIsDownloadAreaTooBig,
} from './downloadActivity.slice'

import styles from './DownloadModal.module.css'

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

function ActivityDownloadError() {
  const { t } = useTranslation()
  const isDownloadActivityError = useSelector(selectIsDownloadActivityError)
  const apiDownloadErrorMsg = useSelector(selectDownloadActivityErrorMsg)
  const isDownloadAreaTooBig = useSelector(selectIsDownloadAreaTooBig)
  const isDownloadTimeoutError = useSelector(selectIsDownloadActivityTimeoutError)
  const isDownloadConcurrentError = useSelector(selectIsDownloadActivityConcurrentError)
  const hadDownloadTimeoutError = useSelector(selectHadDownloadActivityTimeoutError)

  if (!isDownloadActivityError && !hadDownloadTimeoutError) {
    return null
  }

  let downloadErrorMsg = apiDownloadErrorMsg
  if (isDownloadConcurrentError && !hadDownloadTimeoutError) {
    downloadErrorMsg = t(
      'download.errorConcurrentReport',
      'Your account is currently loading an analysis report, please wait for the report to finish before downloading data'
    )
  } else if (isDownloadTimeoutError || hadDownloadTimeoutError) {
    downloadErrorMsg = t('analysis.timeoutError', 'This is taking more than expected, please wait')
  } else if (isDownloadAreaTooBig) {
    downloadErrorMsg = `${t(
      'analysis.errorTooComplex',
      'The geometry of the area is too complex to perform a report, try to simplify and upload again.'
    )}`
  } else if (!downloadErrorMsg) {
    downloadErrorMsg = `${t('analysis.errorMessage', 'Something went wrong')} 🙈`
  }

  return <p className={cx(styles.footerLabel, styles.error)}>{downloadErrorMsg}</p>
}

export default ActivityDownloadError
