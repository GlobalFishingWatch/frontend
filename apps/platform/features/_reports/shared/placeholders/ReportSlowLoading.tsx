import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { FeatureFlag, selectFeatureFlags } from 'features/debug/debug.slice'

import styles from './placeholders.module.css'

const SLOW_REPORT_DELAY_MS = 4500
const PROGRESS_STEP_PERCENT = 5
const PROGRESS_INTERVAL_MS = 1000
const PROGRESS_MAX_PERCENT = 95
const FACT_ROTATION_MS = 6000

export function ReportSlowLoading() {
  const { t } = useTranslation()
  const [isSlow, setIsSlow] = useState(false)
  const [progress, setProgress] = useState(0)
  const [factIndex, setFactIndex] = useState(0)
  const featureFlags = useSelector(selectFeatureFlags)
  const isEnabled = featureFlags[FeatureFlag.SlowReportTips]

  // TODO:CONTENT placeholder copy — needs comms/product sign-off
  const facts = useMemo(
    () => [
      t((t) => t.analysis.slowReportTips.positionsMode),
      t((t) => t.analysis.slowReportTips.uploadRaster),
      t((t) => t.analysis.slowReportTips.drawArea),
      t((t) => t.analysis.slowReportTips.bufferArea),
      t((t) => t.analysis.slowReportTips.vesselGroups),
      t((t) => t.analysis.slowReportTips.printReport),
      t((t) => t.analysis.slowReportTips.rangeFilter),
      t((t) => t.analysis.slowReportTips.otherReports),
    ],
    [t]
  )

  useEffect(() => {
    if (!isEnabled) {
      return
    }
    const timeout = setTimeout(() => setIsSlow(true), SLOW_REPORT_DELAY_MS)
    return () => clearTimeout(timeout)
  }, [isEnabled])

  useEffect(() => {
    if (!isSlow) {
      return
    }
    const interval = setInterval(() => {
      setProgress((current) => Math.min(current + PROGRESS_STEP_PERCENT, PROGRESS_MAX_PERCENT))
    }, PROGRESS_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isSlow])

  useEffect(() => {
    if (!isSlow || facts.length <= 1) {
      return
    }
    setFactIndex(Math.floor(Math.random() * facts.length))
    const interval = setInterval(() => {
      setFactIndex((current) => (current + 1) % facts.length)
    }, FACT_ROTATION_MS)
    return () => clearInterval(interval)
  }, [isSlow, facts.length])

  if (!isEnabled || !isSlow) {
    return null
  }

  const message = t((t) => t.analysis.slowReportMessage)

  return (
    <div className={styles.slowLoading}>
      <p className={styles.slowLoadingMessage}>{message}</p>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label={message}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
      <p className={styles.slowLoadingFact} aria-live="polite">
        `{t((t) => t.common.didYouKnow)}`{facts[factIndex]}
      </p>
    </div>
  )
}
