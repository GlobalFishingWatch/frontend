import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import {
  selectDownloadActivityErrorMsg,
  selectHadDownloadActivityTimeoutError,
  selectIsDownloadActivityConcurrentError,
  selectIsDownloadActivityError,
  selectIsDownloadActivityTimeoutError,
  selectIsDownloadAreaTooBig,
} from './downloadActivity.slice'

import styles from './DownloadModal.module.css'

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
    downloadErrorMsg = t((t) => t.download.errorConcurrentReport)
  } else if (isDownloadTimeoutError || hadDownloadTimeoutError) {
    downloadErrorMsg = t((t) => t.analysis.timeoutError)
  } else if (isDownloadAreaTooBig) {
    downloadErrorMsg = `${t((t) => t.analysis.errorTooComplex)}`
  } else if (!downloadErrorMsg) {
    downloadErrorMsg = `${t((t) => t.analysis.errorMessage)} 🙈`
  }

  return <p className={cx(styles.footerLabel, styles.error)}>{downloadErrorMsg}</p>
}

export default ActivityDownloadError
