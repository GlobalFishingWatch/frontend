import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetVesselEventsQuery } from 'queries/vessel-events-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Collapsable } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import { LONGLINE_FISHING_EVENTS_DATASET } from 'features/vessel/insights/InsightLongline'
import LonglineSetsGraph from 'features/vessel/insights/LonglineSetsGraph'
import VesselLink from 'features/vessel/VesselLink'
import { selectReportVesselGroupId } from 'router/routes.selectors'
import { formatInfoField } from 'utils/info'

import { selectVGRData } from '../../report-vessel-group/vessel-group-report.slice'

import styles from './VGRInsights.module.css'

const VesselGroupReportInsightLongline = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const vesselGroup = useSelector(selectVGRData)
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const { start, end } = useSelector(selectTimeRange)

  const { data, isFetching, error } = useGetVesselEventsQuery(
    {
      'vessel-groups': [vesselGroupId],
      datasets: [LONGLINE_FISHING_EVENTS_DATASET],
      'start-date': start,
      'end-date': end,
    },
    { skip: skip || !vesselGroupId }
  )

  const vessels = useMemo(() => {
    const byVesselId = (data || []).reduce(
      (acc, event) => {
        const { id, name, flag } = event.vessel || {}
        if (!id) return acc
        if (!acc[id]) acc[id] = { id, name, flag, count: 0 }
        acc[id].count++
        return acc
      },
      {} as Record<string, { id: string; name: string; flag: string; count: number }>
    )
    return Object.values(byVesselId).sort((a, b) => b.count - a.count)
  }, [data])

  const datasetByVesselId = useMemo(() => {
    return Object.fromEntries(
      (vesselGroup?.vessels || []).map((vessel) => [vessel.vesselId, vessel.dataset])
    )
  }, [vesselGroup])

  const onInsightToggle = (isOpen: boolean) => {
    if (isOpen !== isExpanded) {
      setIsExpanded(!isExpanded)
    }
    if (isOpen) {
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_insights_tab_expand_insights',
        label: 'longline sets expanded',
      })
    }
  }

  const onVesselClick = (e: MouseEvent, vesselId?: string) => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: 'vessel_group_profile_insights_longline_go_to_vessel',
      label: vesselId,
    })
  }

  return (
    <div id="vessel-group-longline" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t((t) => t.vessel.insights.longline)}</label>
      </div>
      {skip || isFetching || !data ? (
        <LonglineSetsGraph loading />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : data.length === 0 ? (
        <p className={cx(styles.nested, styles.secondary, styles.row)}>
          {t((t) => t.vessel.insights.longlineEventsEmpty)}
        </p>
      ) : (
        <div className={cx(styles.nested, styles.row)}>
          <LonglineSetsGraph data={data} />
          <Collapsable
            id="longline-sets-vessels"
            open={isExpanded}
            className={styles.collapsable}
            labelClassName={styles.collapsableLabel}
            label={t((t) => t.vesselGroups.insights.longline, {
              count: data.length,
              vessels: String(vessels.length),
            })}
            onToggle={onInsightToggle}
          >
            <ul className={styles.nested}>
              {vessels.map((vessel) => (
                <li className={styles.row} key={vessel.id}>
                  <span className={styles.vesselName}>
                    <VesselLink
                      className={styles.link}
                      vesselId={vessel.id}
                      datasetId={datasetByVesselId[vessel.id]}
                      onClick={onVesselClick}
                      query={{ vesselIdentitySource: VesselIdentitySourceEnum.SelfReported }}
                    >
                      {formatInfoField(vessel.name, 'shipname')}
                    </VesselLink>{' '}
                    <span className={styles.secondary}>
                      ({formatInfoField(vessel.flag, 'flag')}) - {vessel.count}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Collapsable>
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightLongline
