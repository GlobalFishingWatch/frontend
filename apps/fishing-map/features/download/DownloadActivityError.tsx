import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import {
  selectDownloadActivityErrorMsg,
  selectIsDownloadActivityConcurrentError,
  selectIsDownloadActivityTimeoutError,
  selectIsDownloadAreaTooBig,
} from './downloadActivity.slice'
import styles from './DownloadModal.module.css'

export function useActivityDownloadTimeoutRefresh(callback: () => void) {
  const isDownloadTimeoutError = useSelector(selectIsDownloadActivityTimeoutError)

  useEffect(() => {
    if (isDownloadTimeoutError) {
      const timeout = setTimeout(() => {
        callback()
      }, 5000)

      return () => clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDownloadTimeoutError])
}

function ActivityDownloadError() {
  const { t } = useTranslation()
  const apiDownloadErrorMsg = useSelector(selectDownloadActivityErrorMsg)
  const isDownloadAreaTooBig = useSelector(selectIsDownloadAreaTooBig)
  const isDownloadTimeoutError = useSelector(selectIsDownloadActivityTimeoutError)
  const isDownloadConcurrentError = useSelector(selectIsDownloadActivityConcurrentError)

  let downloadErrorMsg = apiDownloadErrorMsg
  if (isDownloadConcurrentError) {
    downloadErrorMsg = t(
      'download.errorConcurrentReport',
      'Your account is currently loading an analysis report, please wait for the report to finish before downloading data'
    )
  } else if (isDownloadTimeoutError) {
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
