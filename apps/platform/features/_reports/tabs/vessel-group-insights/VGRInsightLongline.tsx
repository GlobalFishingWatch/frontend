import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetVesselEventsQuery } from 'queries/map/vessel-events-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { ApiEvents } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { LonglineCategory } from '@globalfishingwatch/deck-loaders'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import UserLoggedIconButton from 'features/_user/UserLoggedIconButton'
import Event from 'features/_vessels/vessel/activity/event/Event'
import InsightError from 'features/_vessels/vessel/insights/InsightErrorMessage'
import { LONGLINE_FISHING_EVENTS_DATASET } from 'features/_vessels/vessel/insights/insights.config'
import { removeNonTunaRFMO } from 'features/_vessels/vessel/insights/insights.utils'
import LonglineSetsGraph from 'features/_vessels/vessel/insights/LonglineSetsGraph'
import { parseLonglineSetsToCSV } from 'features/_vessels/vessel/vessel.download'
import type { VesselEvent } from 'features/_vessels/vessel/vessel.types'
import VesselLink from 'features/_vessels/vessel/VesselLink'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectReportVesselGroupId } from 'router/routes.selectors'
import { formatInfoField } from 'utils/info'

import { selectVGRData } from '../../report-vessel-group/vessel-group-report.slice'

import styles from './VGRInsights.module.css'
import insightStyles from 'features/_vessels/vessel/insights/Insights.module.css'

type VesselWithEvents = {
  id: string
  name: string
  flag: string
  events: ApiEvents['entries']
}

const getVesselsWithEvents = (events: ApiEvents['entries']): VesselWithEvents[] => {
  const byVesselId = events.reduce(
    (acc, event) => {
      const { id, name, flag } = event.vessel || {}
      if (!id) return acc
      if (!acc[id]) acc[id] = { id, name, flag, events: [] }
      acc[id].events.push(event)
      return acc
    },
    {} as Record<string, VesselWithEvents>
  )
  return Object.values(byVesselId).sort((a, b) => b.events.length - a.events.length)
}

const VesselGroupReportInsightLongline = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
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

  const events = useMemo(() => (data || []).map(removeNonTunaRFMO), [data])

  const datasetByVesselId = useMemo(() => {
    return Object.fromEntries(
      (vesselGroup?.vessels || []).map((vessel) => [vessel.vesselId, vessel.dataset])
    )
  }, [vesselGroup])

  const onDownloadClick = async () => {
    const csv = parseLonglineSetsToCSV(events)
    const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
    const { saveAs } = await import('file-saver')
    saveAs(blob, `${vesselGroup?.name}-longline-sets-${start}-${end}.csv`)
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: 'vessel_group_longline_sets_download',
    })
  }

  const onCategoryToggle = (category: LonglineCategory | null) => {
    if (category) {
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_insights_tab_expand_insights',
        label: `longline sets expanded: ${category}`,
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

  const renderCategoryVessels = (categoryEvents: ApiEvents['entries']) => (
    <ul className={styles.nested}>
      {getVesselsWithEvents(categoryEvents).map((vessel) => {
        const isOpen = openVesselId === vessel.id
        return (
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
                onClick={() => setOpenVesselId(isOpen ? null : vessel.id)}
                icon={isOpen ? 'arrow-top' : 'arrow-down'}
                tooltip={
                  isOpen
                    ? t((t) => t.vessel.insights.gapsSeeLess)
                    : t((t) => t.vessel.insights.gapsSeeMore)
                }
              />
            </span>
            {isOpen && (
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
        )
      })}
    </ul>
  )

  return (
    <div id="vessel-group-longline" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t((t) => t.vessel.insights.longline)}</label>
        <div className={insightStyles.insightTitleActions}>
          <UserLoggedIconButton
            loginSource="vessel-download"
            size="medium"
            icon="download"
            className="print-hidden"
            disabled={skip || isFetching || !events.length}
            onClick={onDownloadClick}
            tooltip={t((t) => t.vessel.insights.longlineDownload)}
            loginTooltip={t((t) => t.download.eventsDownloadLogin)}
          />
        </div>
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
          <LonglineSetsGraph
            data={events}
            renderCategoryContent={renderCategoryVessels}
            onCategoryToggle={onCategoryToggle}
          />
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightLongline
