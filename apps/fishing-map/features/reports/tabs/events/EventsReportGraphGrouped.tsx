import type { ReactElement } from 'react'
import React, { Fragment, useCallback } from 'react'
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
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveBarChart } from '@globalfishingwatch/responsive-visualizations'
import { Tooltip as GFWTooltip } from '@globalfishingwatch/ui-components'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/reports/report-area/area-reports.selectors'
import {
  EMPTY_API_VALUES,
  MAX_CATEGORIES,
  OTHERS_CATEGORY_LABEL,
} from 'features/reports/reports.config'
import { selectReportAreaId, selectReportDatasetId } from 'features/reports/reports.selectors'
import { useLocationConnect } from 'routes/routes.hook'

import EncounterIcon from './icons/event-encounter.svg'
import LoiteringIcon from './icons/event-loitering.svg'
import PortVisitIcon from './icons/event-port.svg'

import styles from './EventsReportGraph.module.css'

const IndividualGraphTooltip = ({ data }: { data?: any }) => {
  const { t } = useTranslation()
  if (!data?.vessel) {
    return null
  }

  return <div className={styles.event}>TODO</div>
}

type EventsReportGraphGroupedTooltipProps = {
  active: boolean
  payload: {
    label: string
    dataKey: string
    value: number
    payload: any
    color: string
    unit: string
  }[]
  label: number
}

const AggregatedGraphTooltip = (props: any) => {
  const { active, payload: tooltipPayload, label } = props as EventsReportGraphGroupedTooltipProps
  const { t } = useTranslation()

  const isOthersCategory = tooltipPayload?.some((p) => p.label === OTHERS_CATEGORY_LABEL)
  let otherLabelCounted = false
  if (active && tooltipPayload && tooltipPayload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{label}</p>
        <ul className={isOthersCategory ? styles.maxHeight : ''}>
          {tooltipPayload
            .map(({ value, color, payload }, index) => {
              if (value === 0 || otherLabelCounted) {
                return null
              }
              if (payload.label === OTHERS_CATEGORY_LABEL && payload.others) {
                otherLabelCounted = true
                const top = payload.others.slice(0, MAX_CATEGORIES)
                const restValue = payload.others
                  .slice(MAX_CATEGORIES)
                  .reduce((acc: number, curr: { value: number }) => {
                    return acc + curr.value
                  }, 0)
                return (
                  <Fragment>
                    {top.map(({ label, value }: { label: string; value: number }) => (
                      <li key={label} className={styles.tooltipValue}>
                        {label}: <I18nNumber number={value} />
                      </li>
                    ))}
                    {restValue !== 0 && (
                      <li key="others" className={styles.tooltipValue}>
                        {t('analysis.others', 'Others')}: {restValue}
                      </li>
                    )}
                  </Fragment>
                )
              }
              return (
                <li key={index} className={styles.tooltipValue}>
                  {tooltipPayload.length > 1 && (
                    <span className={styles.tooltipValueDot} style={{ color }}></span>
                  )}
                  <I18nNumber number={value} /> {t('common.events', { count: value }).toLowerCase()}
                </li>
              )
            })
            .reverse()}
        </ul>
      </div>
    )
  }

  return null
}

const ReportGraphTick = (props: any) => {
  const { x, y, payload, width, visibleTicksCount } = props

  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const isOtherCategory = payload.value === OTHERS_CATEGORY_LABEL
  const isCategoryInteractive =
    !EMPTY_API_VALUES.includes(payload.value) && payload.value !== OTHERS_CATEGORY_LABEL

  // const getTickLabel = (label: string) => {
  //   if (label === EMPTY_FIELD_PLACEHOLDER) {
  //     return t('analysis.unknownProperty', 'Unknown')
  //   }
  //   if (EMPTY_API_VALUES.includes(label)) {
  //     return t('analysis.unknown', 'Unknown')
  //   }
  //   switch (property) {
  //     case 'flag':
  //       return formatInfoField(label, 'flag') as string
  //     case 'geartype':
  //       return formatInfoField(label, 'geartypes') as string
  //     case 'vesselType':
  //       return formatInfoField(label, 'vesselType') as string
  //     default:
  //       return label
  //   }
  // }

  const onLabelClick = () => {
    if (payload.value !== OTHERS_CATEGORY_LABEL) {
      // TODO:CVP
      // dispatchQueryParams({
      //   [filterQueryParam]: `${FILTER_PROPERTIES[property as ReportVesselsSubCategory]}:${
      //     payload.value
      //   }`,
      //   [pageQueryParam]: 0,
      // })
    }
  }

  const label = isOtherCategory ? t('analysis.others', 'Others') : payload.value
  const labelChunks = label.split(' ')
  const labelChunksClean = [labelChunks[0]]
  labelChunks.slice(1).forEach((chunk: any) => {
    const currentChunk = labelChunksClean[labelChunksClean.length - 1]
    if (currentChunk.length + chunk.length >= width / visibleTicksCount / 8) {
      labelChunksClean.push(chunk)
    } else {
      labelChunksClean[labelChunksClean.length - 1] = currentChunk + ' ' + chunk
    }
  })

  return (
    <GFWTooltip content={label} placement="bottom">
      <text
        className={cx({ [styles.axisLabel]: isCategoryInteractive })}
        transform={`translate(${x},${y - 3})`}
        onClick={onLabelClick}
      >
        {labelChunksClean.map((chunk) => (
          <Fragment key={chunk}>
            <tspan textAnchor="middle" x="0" dy={12}>
              {chunk}{' '}
            </tspan>
          </Fragment>
        ))}
      </text>
    </GFWTooltip>
  )
}

export default function EventsReportGraphGrouped({
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
    <div ref={containerRef} className={cx(styles.graph, styles.groupBy)}>
      <ResponsiveBarChart
        color={color}
        // getIndividualData={getIndividualData}
        aggregatedValueKey={valueKeys}
        getAggregatedData={getAggregatedData}
        barValueFormatter={(value: any) => {
          return formatI18nNumber(value).toString()
        }}
        barLabel={<ReportGraphTick />}
        individualTooltip={<IndividualGraphTooltip />}
        aggregatedTooltip={<AggregatedGraphTooltip />}
        // individualItem={<VesselGraphLink />}
      />
    </div>
  )
}
