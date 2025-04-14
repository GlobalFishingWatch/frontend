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
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
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
  MAX_CATEGORIES,
  OTHERS_CATEGORY_LABEL,
  REPORT_EVENTS_GRAPH_EVOLUTION,
  REPORT_EVENTS_RFMO_AREAS,
} from 'features/reports/reports.config'
import { selectReportAreaId, selectReportDatasetId } from 'features/reports/reports.selectors'
import type { ReportEventsGraph } from 'features/reports/reports.types'
import { useGetEventReportGraphLabel } from 'features/reports/tabs/events/events-report.hooks'
import { selectEventsGraphDatasetAreaId } from 'features/reports/tabs/events/events-report.selectors'
import { EventsReportIndividualGraphTooltip } from 'features/reports/tabs/events/EventsReportGraphEvolution'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { WORKSPACE_REPORT } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { selectLocationQuery } from 'routes/routes.selectors'

import EncounterIcon from './icons/event-encounter.svg'
import LoiteringIcon from './icons/event-loitering.svg'
import PortVisitIcon from './icons/event-port.svg'

import styles from './EventsReportGraph.module.css'

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
  graphType?: ReportEventsGraph
  dataview: UrlDataviewInstance
}

const AggregatedGraphTooltip = (props: any) => {
  const { active, payload: tooltipPayload, label } = props as EventsReportGraphGroupedTooltipProps
  const { t } = useTranslation()
  const getReportAreaLabel = useGetEventReportGraphLabel()
  const isOthersCategory = tooltipPayload?.some((p) => p.label === OTHERS_CATEGORY_LABEL)
  let otherLabelCounted = false
  if (active && tooltipPayload && tooltipPayload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{getReportAreaLabel(label?.toString())}</p>
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
                  <Fragment key={label}>
                    {top.map(({ label, value }: { label: string; value: number }) => (
                      <li key={label} className={styles.tooltipValue}>
                        {getReportAreaLabel(label)}: <I18nNumber number={value} />
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
  const { x, y, payload, width, visibleTicksCount, graphType, dataview } = props
  const { t } = useTranslation()
  const getReportAreaLabel = useGetEventReportGraphLabel()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchLocation } = useLocationConnect()
  const query = useSelector(selectLocationQuery)
  const datasetAreaId = useSelector(selectEventsGraphDatasetAreaId)
  const isOtherCategory = payload.value === OTHERS_CATEGORY_LABEL
  const isCategoryInteractive = graphType !== REPORT_EVENTS_GRAPH_EVOLUTION && !isOtherCategory

  const onLabelClick = async () => {
    if (!isOtherCategory) {
      if (graphType === 'byFlag') {
        const newDataviewConfig = {
          filters: {
            ...(dataview.config?.filters || {}),
            flag: [payload.value],
          },
        }
        upsertDataviewInstance({
          id: dataview.id,
          config: newDataviewConfig,
        })
      } else if (datasetAreaId) {
        const areaId = graphType === 'byRFMO' ? payload.value.toUpperCase() : payload.value
        dispatchLocation(WORKSPACE_REPORT, {
          payload: { datasetId: datasetAreaId, areaId },
          query: {
            ...query,
            reportEventsGraph: 'evolution',
          },
        })
      }
    }
  }

  const label = isOtherCategory
    ? t('analysis.others', 'Others')
    : getReportAreaLabel(payload.value) || ''
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

  const tooltip =
    graphType === 'byFlag'
      ? `${t('analysis.clickToFilterBy', 'Click to filter by:')} ${label}`
      : `${t('analysis.clickToSeeAreaReport', 'Click to see the {{area}} report', {
          area: getReportAreaLabel(payload.value),
        })}`

  return (
    <GFWTooltip content={tooltip} placement="bottom">
      <text transform={`translate(${x},${y - 3})`} onClick={onLabelClick}>
        {labelChunksClean.map((chunk) => (
          <Fragment key={chunk}>
            <tspan
              textAnchor="middle"
              x="0"
              dy={12}
              className={cx({ [styles.interactiveTick]: isCategoryInteractive })}
            >
              {chunk}{' '}
            </tspan>
          </Fragment>
        ))}
      </text>
    </GFWTooltip>
  )
}

export default function EventsReportGraphGrouped({
  dataview,
  datasetId,
  filters,
  includes,
  color = COLOR_PRIMARY_BLUE,
  end,
  start,
  data,
  valueKeys,
  graphType,
  eventType,
}: {
  datasetId: string
  dataview: UrlDataviewInstance
  filters?: BaseReportEventsVesselsParamsFilters
  includes?: string[]
  color?: string
  end: string
  start: string
  data: ResponsiveVisualizationData<'aggregated'>
  valueKeys: string[]
  graphType?: ReportEventsGraph
  eventType?: EventType
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const filtersMemo = useMemoCompare(filters)
  const includesMemo = useMemoCompare(includes)
  const reportAreaDataset = useSelector(selectReportDatasetId)
  const reportAreaId = useSelector(selectReportAreaId)
  const reportBufferValue = useSelector(selectReportBufferValue)
  const reportBufferUnit = useSelector(selectReportBufferUnit)
  const reportBufferOperation = useSelector(selectReportBufferOperation)

  // let icon: ReactElement | undefined
  // if (eventType === 'encounter') {
  //   icon = <EncounterIcon />
  // } else if (eventType === 'loitering') {
  //   icon = <LoiteringIcon />
  // } else if (eventType === 'port_visit') {
  //   icon = <PortVisitIcon />
  // }

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
    const uniqueIds = new Set<string>()
    const dataWithoutDuplicates = data.entries.filter((event) => {
      const id = event.id.split('.')[0]
      if (uniqueIds.has(id)) {
        return false
      }
      uniqueIds.add(id)
      return true
    })

    if (graphType === 'evolution') {
      const startMillis = DateTime.fromISO(start).toMillis()
      const endMillis = DateTime.fromISO(end).toMillis()
      const interval = getFourwingsInterval(startMillis, endMillis)
      const groupedData = groupBy(dataWithoutDuplicates, (event) => {
        return getISODateByInterval(event.start, interval)
      })
      return Object.entries(groupedData)
        .map(([date, events]) => ({ date, values: events }))
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    const groupedData = dataWithoutDuplicates.reduce(
      (acc, event) => {
        const regions = []
        if (graphType === 'byFlag') {
          regions.push(event.vessel.flag)
        }
        if (graphType === 'byRFMO' && event.regions?.rfmo) {
          regions.push(
            ...event.regions.rfmo.filter((rfmo) => REPORT_EVENTS_RFMO_AREAS.includes(rfmo))
          )
        }
        if (graphType === 'byFAO' && event.regions?.majorFao) {
          regions.push(...event.regions.majorFao)
        }
        if (graphType === 'byEEZ' && event.regions?.eez) {
          regions.push(...event.regions.eez)
        }
        regions.forEach((region) => {
          if (!acc[region]) {
            acc[region] = []
          }
          acc[region].push(event)
        })
        return acc
      },
      {} as Record<string, ApiEvent[]>
    )

    return Object.entries(groupedData)
      .map(([label, events]) => ({ label, values: events }))
      .sort((a, b) => b.values.length - a.values.length)
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
    graphType,
  ])

  let icon: ReactElement | undefined

  if (eventType === 'encounter') {
    icon = <EncounterIcon />
  } else if (eventType === 'loitering') {
    icon = <LoiteringIcon />
  } else if (eventType === 'port_visit') {
    icon = <PortVisitIcon />
  }

  if (!data.length) {
    return null
  }

  return (
    <div ref={containerRef} className={cx(styles.graph, styles.groupBy)}>
      <ResponsiveBarChart
        color={color}
        getIndividualData={getIndividualData}
        aggregatedValueKey={valueKeys}
        getAggregatedData={getAggregatedData}
        barValueFormatter={(value: any) => {
          return formatI18nNumber(value).toString()
        }}
        barLabel={<ReportGraphTick graphType={graphType} dataview={dataview} />}
        individualTooltip={<EventsReportIndividualGraphTooltip eventType={eventType} />}
        aggregatedTooltip={<AggregatedGraphTooltip graphType={graphType} dataview={dataview} />}
        individualIcon={icon}
      />
    </div>
  )
}
