import type { ReactElement } from 'react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { groupBy } from 'es-toolkit'
import { DateTime } from 'luxon'
import { stringify } from 'qs'
import {
  type BaseReportEventsVesselsParamsFilters,
  getEventsStatsQuery,
} from 'queries/report-events-stats-api'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { ApiEvent, APIPagination, EventType } from '@globalfishingwatch/api-types'
import { getISODateByInterval } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import type {
  BaseResponsiveTimeseriesProps,
  ResponsiveVisualizationData,
} from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveTimeseries } from '@globalfishingwatch/responsive-visualizations'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import i18n from 'features/i18n/i18n'
import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/reports/report-area/area-reports.selectors'
import { formatTooltipValue } from 'features/reports/report-area/area-reports.utils'
import { selectReportAreaId, selectReportDatasetId } from 'features/reports/reports.selectors'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'
import { getTimeLabels } from 'utils/events'
import { formatInfoField, upperFirst } from 'utils/info'

import EncounterIcon from './icons/event-encounter.svg'
import LoiteringIcon from './icons/event-loitering.svg'
import PortVisitIcon from './icons/event-port.svg'

import styles from './EventsReportGraph.module.css'

type EventsReportGraphEvolutionTooltipProps = {
  active: boolean
  payload: {
    name: string
    dataKey: string
    label: number
    value: number
    payload: any
    color: string
    unit: string
  }[]
  label: number
  timeChunkInterval: FourwingsInterval
}

const AggregatedGraphTooltip = (props: any) => {
  const { t } = useTranslation()
  const { active, payload, label, timeChunkInterval } =
    props as EventsReportGraphEvolutionTooltipProps

  if (active && payload && payload.length) {
    const date = getUTCDateTime(label).setLocale(i18n.language)
    const formattedLabel = formatDateForInterval(date, timeChunkInterval)
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          {payload
            .sort((a: any, b: any) => b.value - a.value)
            .map(({ value, color }: any, index: number) => {
              return (
                <li key={index} className={styles.tooltipValue}>
                  <span className={styles.tooltipValueDot} style={{ color }}></span>
                  {formatTooltipValue(value, t('common.events', 'Events').toLowerCase())}
                </li>
              )
            })}
        </ul>
      </div>
    )
  }

  return null
}

export const EventsReportIndividualGraphTooltip = ({
  data,
  eventType,
}: {
  data?: ApiEvent
  eventType?: EventType
}) => {
  const { t } = useTranslation()
  if (!data?.vessel) {
    return null
  }
  const { start, duration } = getTimeLabels({ start: data.start, end: data.end })

  return (
    <div className={styles.event}>
      {eventType && upperFirst(t(`event.${eventType}`, eventType))}
      <div className={styles.properties}>
        <div className={styles.property}>
          <label>
            {`${formatInfoField(data.vessel?.type, 'shiptypes')} ${t('common.vessel', 'vessel')}`}
          </label>
          <span>
            {formatInfoField(data.vessel?.name, 'shipname')}{' '}
            {data.vessel?.flag && <span>({formatInfoField(data.vessel?.flag, 'flag')})</span>}
          </span>
        </div>
        {eventType === 'encounter' && data.encounter?.vessel && (
          <div className={styles.property}>
            <label>{`${formatInfoField(data.encounter.vessel.type, 'shiptypes')} ${t('common.vessel', 'vessel')}`}</label>
            <span>{`${formatInfoField(data.encounter.vessel.name, 'shipname')} ${data.encounter.vessel.flag ? `(${formatInfoField(data.encounter.vessel.flag, 'flag')}` : ''}`}</span>
          </div>
        )}
      </div>
      <div className={styles.properties}>
        <div className={styles.property}>
          <label>{t('eventInfo.start', 'Start')}</label>
          <span>{start}</span>
        </div>
        <div className={styles.property}>
          <label>{t('eventInfo.duration', 'Duration')}</label>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  )
}

const formatDateTicks: BaseResponsiveTimeseriesProps['tickLabelFormatter'] = (
  tick,
  timeChunkInterval
) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

export default function EventsReportGraphEvolution({
  datasetId,
  filters,
  includes,
  color = COLOR_PRIMARY_BLUE,
  end,
  start,
  data,
  valueKeys,
  eventType,
}: {
  datasetId: string
  filters?: BaseReportEventsVesselsParamsFilters
  includes?: string[]
  color?: string
  end: string
  start: string
  data: ResponsiveVisualizationData<'aggregated'>
  valueKeys: string[]
  eventType?: EventType
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const startMillis = DateTime.fromISO(start).toMillis()
  const endMillis = DateTime.fromISO(end).toMillis()
  const interval = getFourwingsInterval(startMillis, endMillis)
  const filtersMemo = useMemoCompare(filters)
  const includesMemo = useMemoCompare(includes)
  const reportAreaDataset = useSelector(selectReportDatasetId)
  const reportAreaId = useSelector(selectReportAreaId)
  const reportBufferValue = useSelector(selectReportBufferValue)
  const reportBufferUnit = useSelector(selectReportBufferUnit)
  const reportBufferOperation = useSelector(selectReportBufferOperation)

  let icon: ReactElement | undefined
  if (eventType === 'encounter') {
    icon = <EncounterIcon />
  } else if (eventType === 'loitering') {
    icon = <LoiteringIcon />
  } else if (eventType === 'port_visit') {
    icon = <PortVisitIcon />
  }

  const getAggregatedData = useCallback(async () => data, [data])

  const getIndividualData = useCallback(async () => {
    const params = {
      ...getEventsStatsQuery({
        start,
        end,
        filters: filtersMemo || {},
        dataset: datasetId,
        regionDataset: reportAreaDataset,
        regionId: reportAreaId,
        bufferValue: reportBufferValue,
        bufferUnit: reportBufferUnit,
        bufferOperation: reportBufferOperation,
      }),
      ...(includesMemo && { includes: includesMemo }),
      limit: 1000,
      offset: 0,
    }
    const data = await GFWAPI.fetch<APIPagination<ApiEvent>>(`/v3/events?${stringify(params)}`)
    const groupedData = groupBy(data.entries, (item) => getISODateByInterval(item.start, interval))

    return Object.entries(groupedData)
      .map(([date, events]) => ({ date, values: events }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [
    start,
    end,
    filtersMemo,
    datasetId,
    reportAreaDataset,
    reportAreaId,
    reportBufferValue,
    reportBufferUnit,
    reportBufferOperation,
    includesMemo,
    interval,
  ])

  if (!data.length) {
    return null
  }

  return (
    <div ref={containerRef} className={cx(styles.graph, styles.evolution)}>
      <ResponsiveTimeseries
        start={start}
        end={end}
        timeseriesInterval={interval}
        aggregatedValueKey={valueKeys}
        getAggregatedData={getAggregatedData}
        getIndividualData={getIndividualData}
        tickLabelFormatter={formatDateTicks}
        aggregatedTooltip={<AggregatedGraphTooltip />}
        individualTooltip={<EventsReportIndividualGraphTooltip eventType={eventType} />}
        color={color}
        individualIcon={icon}
      />
    </div>
  )
}
