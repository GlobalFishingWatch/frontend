import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

  // TODO:CONTENT placeholder copy — needs comms/product sign-off
  const facts = useMemo(
    () => [
      t((t) => t.analysis.slowReportFacts.ais, {
        defaultValue:
          'AIS was built to stop ships colliding, not to track fishing. Global Fishing Watch repurposed it to make fishing activity visible.',
      }),
      t((t) => t.analysis.slowReportFacts.founders, {
        defaultValue:
          'Global Fishing Watch began as a collaboration between Oceana, SkyTruth and Google.',
      }),
      t((t) => t.analysis.slowReportFacts.openData, {
        defaultValue: 'All of our fishing activity data is free and open to anyone.',
      }),
      t((t) => t.analysis.slowReportFacts.machineLearning, {
        defaultValue:
          'Machine learning infers when a vessel is fishing from the shape of its track.',
      }),
      t((t) => t.analysis.slowReportFacts.radar, {
        defaultValue:
          'Satellite radar can spot vessels at night and through cloud, including ones not broadcasting their position.',
      }),
      t((t) => t.analysis.slowReportFacts.gearTypes, {
        defaultValue:
          'A vessel’s track can reveal its gear — trawlers, longliners and purse seiners each move differently.',
      }),
      t((t) => t.analysis.slowReportFacts.transshipment, {
        defaultValue:
          'Transshipment — moving catch between vessels at sea — can break the link between a fish and where it was caught.',
      }),
      t((t) => t.analysis.slowReportFacts.governments, {
        defaultValue: 'Governments around the world use our tools to monitor their own waters.',
      }),
    ],
    [t]
  )

  useEffect(() => {
    const timeout = setTimeout(() => setIsSlow(true), SLOW_REPORT_DELAY_MS)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!isSlow) return
    const interval = setInterval(() => {
      setProgress((current) => Math.min(current + PROGRESS_STEP_PERCENT, PROGRESS_MAX_PERCENT))
    }, PROGRESS_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isSlow])

  useEffect(() => {
    if (!isSlow || facts.length <= 1) return
    setFactIndex(Math.floor(Math.random() * facts.length))
    const interval = setInterval(() => {
      setFactIndex((current) => (current + 1) % facts.length)
    }, FACT_ROTATION_MS)
    return () => clearInterval(interval)
  }, [isSlow, facts.length])

  if (!isSlow) return null

  const message = t((t) => t.analysis.slowReportMessage, {
    defaultValue: 'You requested a lot of data, this is taking longer than expected',
  })

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
