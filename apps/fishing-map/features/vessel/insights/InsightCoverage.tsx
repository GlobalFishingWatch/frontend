import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import { EventTypes } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { Tooltip } from '@globalfishingwatch/ui-components'

import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import { selectVesselEventsByType } from 'features/vessel/selectors/vessel.resources.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessel/vessel.hooks'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import styles from './Insights.module.css'

const InsightCoverage = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const vesselLayer = useVesselProfileLayer()
  const portEvents = useSelector(selectVesselEventsByType(EventTypes.Port))
  const visibleEvents = useSelector(selectVisibleEvents)
  const portEventsActive = visibleEvents === 'all' || visibleEvents.includes(EventTypes.Port)

  const isLoading = !vesselLayer?.loaded && !vesselLayer?.instance?.getVesselLayersError('track')
  const hasError = !!vesselLayer?.instance?.getVesselLayersError('track')

  const coverage = useMemo(() => {
    if (!vesselLayer?.instance || !start || !end || !vessel) return undefined
    const startMs = getUTCDateTime(start).toMillis()
    const endMs = getUTCDateTime(end).toMillis()

    const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(vessel)

    const clippedStartMs = transmissionDateFrom
      ? Math.max(startMs, DateTime.fromISO(transmissionDateFrom, { zone: 'utc' }).toMillis())
      : startMs
    const clippedEndMs = transmissionDateTo
      ? Math.min(endMs, DateTime.fromISO(transmissionDateTo, { zone: 'utc' }).toMillis())
      : endMs

    const clippedTimerangeDuration = clippedEndMs - clippedStartMs
    if (clippedTimerangeDuration <= 0) return undefined

    const segments = vesselLayer.instance.getVesselTrackSegments({
      startTime: clippedStartMs,
      endTime: clippedEndMs,
      includeMiddlePoints: true,
    })

    const portTime = portEvents.reduce((acc, event) => {
      const eventStart = event.start as number
      const eventEnd = event.end as number
      const overlapStart = Math.max(clippedStartMs, eventStart)
      const overlapEnd = Math.min(clippedEndMs, eventEnd)
      return acc + Math.max(0, overlapEnd - overlapStart)
    }, 0)

    const totalTrackTime = segments.reduce((acc, segment) => {
      if (segment.length < 2) {
        return acc
      }
      const segmentStart = segment[0].timestamp
      const segmentEnd = segment[segment.length - 1].timestamp
      if (!segmentStart || !segmentEnd) {
        return acc
      }
      const duration = segmentEnd - segmentStart
      const overlapInPort = portEvents.reduce((accPort, event) => {
        const eventStart = event.start as number
        const eventEnd = event.end as number
        const overlapStart = Math.max(segmentStart, eventStart)
        const overlapEnd = Math.min(segmentEnd, eventEnd)
        const overlapDuration = Math.max(0, overlapEnd - overlapStart)
        return accPort + overlapDuration
      }, 0)

      return acc + duration - overlapInPort
    }, 0)
    const effectiveDuration = clippedTimerangeDuration - portTime
    if (effectiveDuration <= 0) return 100

    return Math.min(100, (totalTrackTime / effectiveDuration) * 100)
  }, [vesselLayer?.instance, vesselLayer?.loaded, start, end, vessel, portEvents])

  return (
    <div id="coverage" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <Tooltip content={t((t) => t.common.experimentalTooltip)}>
          <label className="experimental">{t((t) => t.vessel.insights.coverage)}</label>
        </Tooltip>
        <DataTerminology
          title={t((t) => t.vessel.insights.coverage)}
          terminologyKey="insightsCoverage"
        />
      </div>

      {!portEventsActive ? (
        <div className={styles.noData}>{t((t) => t.vessel.noPortVisitsVisible)}</div>
      ) : isLoading ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : hasError ? (
        <InsightError error={{ name: 'Error', message: t((t) => t.errors.vesselLoading) } as any} />
      ) : coverage !== undefined ? (
        <div className={styles.coverageBar}>
          <div className={styles.coverageIndicator} style={{ left: `${Math.round(coverage)}%` }}>
            <span className={styles.coverageLabel}>{Math.round(coverage)}%</span>
            <span className={styles.coverageDot} />
          </div>
        </div>
      ) : (
        EMPTY_FIELD_PLACEHOLDER
      )}
    </div>
  )
}

export default InsightCoverage
