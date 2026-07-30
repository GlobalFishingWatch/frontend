import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetVesselEventsQuery } from 'queries/map/vessel-events-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { ApiEvents } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Collapsable, IconButton } from '@globalfishingwatch/ui-components'

import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import Event from 'features/_vessels/vessel/activity/event/Event'
import InsightError from 'features/_vessels/vessel/insights/InsightErrorMessage'
import { LONGLINE_FISHING_EVENTS_DATASET } from 'features/_vessels/vessel/insights/InsightLongline'
import { removeNonTunaRFMO } from 'features/_vessels/vessel/insights/insights.utils'
import LonglineSetsGraph from 'features/_vessels/vessel/insights/LonglineSetsGraph'
import type { VesselEvent } from 'features/_vessels/vessel/vessel.types'
import VesselLink from 'features/_vessels/vessel/VesselLink'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectReportVesselGroupId } from 'router/routes.selectors'
import { formatInfoField } from 'utils/info'

import { selectVGRData } from '../../report-vessel-group/vessel-group-report.slice'

import styles from './VGRInsights.module.css'
import insightStyles from 'features/_vessels/vessel/insights/Insights.module.css'

const VesselGroupReportInsightLongline = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [openVesselId, setOpenVesselId] = useState<string | null>(null)
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
    const byVesselId = (data || []).map(removeNonTunaRFMO).reduce(
      (acc, event) => {
        const { id, name, flag } = event.vessel || {}
        if (!id) return acc
        if (!acc[id]) acc[id] = { id, name, flag, events: [] }
        acc[id].events.push(event)
        return acc
      },
      {} as Record<string, { id: string; name: string; flag: string; events: ApiEvents['entries'] }>
    )
    return Object.values(byVesselId).sort((a, b) => b.events.length - a.events.length)
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
        <LonglineSetsGraph loading showEvents={false} />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : data.length === 0 ? (
        <p className={cx(styles.nested, styles.secondary, styles.row)}>
          {t((t) => t.vessel.insights.longlineEventsEmpty)}
        </p>
      ) : (
        <div className={cx(styles.nested, styles.row)}>
          <LonglineSetsGraph data={data} showEvents={false} />
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
                <li key={vessel.id}>
                  <span className={cx(styles.row, styles.vesselRow)}>
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
                      <span className={styles.secondary}>({vessel.events.length})</span>
                    </span>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setOpenVesselId((open) => (open === vessel.id ? null : vessel.id))
                      }
                      icon={openVesselId === vessel.id ? 'arrow-top' : 'arrow-down'}
                      tooltip={
                        openVesselId === vessel.id
                          ? t((t) => t.vessel.insights.gapsSeeLess)
                          : t((t) => t.vessel.insights.gapsSeeMore)
                      }
                    />
                  </span>
                  {openVesselId === vessel.id && (
                    <ul className={insightStyles.eventDetailsList}>
                      {vessel.events.map((event) => (
                        <Event
                          key={event.id}
                          event={event as VesselEvent}
                          className={insightStyles.event}
                        />
                      ))}
                    </ul>
                  )}
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
