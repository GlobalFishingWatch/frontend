import type { ReactElement } from 'react'
import React, { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { type ApiEvent, type EventType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveBarChart } from '@globalfishingwatch/responsive-visualizations'
import { Tooltip as GFWTooltip } from '@globalfishingwatch/ui-components'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import {
  MAX_CATEGORIES,
  OTHERS_CATEGORY_LABEL,
  REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS,
  REPORT_EVENTS_GRAPH_EVOLUTION,
  REPORT_EVENTS_RFMO_AREAS,
} from 'features/reports/reports.config'
import type { ReportEventsGraph } from 'features/reports/reports.types'
import {
  useFetchEventReportGraphEvents,
  useGetEventReportGraphLabel,
} from 'features/reports/tabs/events/events-report.hooks'
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
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const { dispatchLocation } = useLocationConnect()
  const query = useSelector(selectLocationQuery)
  const datasetAreaId = useSelector(selectEventsGraphDatasetAreaId)
  const isOtherCategory = payload.value === OTHERS_CATEGORY_LABEL
  const isCategoryInteractive =
    payload.value && graphType !== REPORT_EVENTS_GRAPH_EVOLUTION && !isOtherCategory

  const onLabelClick = async () => {
    if (isCategoryInteractive) {
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
        const reportAreaDataviewId =
          REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS[
            graphType as keyof typeof REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS
          ]
        const dataviewInstancesWithAreaLayerVisible = workspace.dataviewInstances.map(
          (dataviewInstance) => {
            if (dataviewInstance.dataviewId === reportAreaDataviewId) {
              return {
                ...dataviewInstance,
                config: {
                  ...dataviewInstance.config,
                  visible: true,
                },
              }
            }
            return dataviewInstance
          }
        )
        dispatchLocation(WORKSPACE_REPORT, {
          payload: { datasetId: datasetAreaId, areaId },
          query: {
            ...query,
            reportEventsGraph: 'evolution',
            dataviewInstances: dataviewInstancesWithAreaLayerVisible,
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
    <GFWTooltip content={isCategoryInteractive ? tooltip : ''} placement="bottom">
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
  dataviews,
  includes,
  color = COLOR_PRIMARY_BLUE,
  end,
  start,
  data,
  valueKeys,
  graphType,
  eventType,
}: {
  dataviews: UrlDataviewInstance[]
  includes?: string[]
  color?: string
  end: string
  start: string
  data: ResponsiveVisualizationData<'aggregated'>
  valueKeys: string[]
  graphType?: ReportEventsGraph
  eventType?: EventType
}) {
  const { t } = useTranslation()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const includesMemo = useMemoCompare(includes)
  const fetchEventsData = useFetchEventReportGraphEvents()

  const getAggregatedData = useCallback(async () => data, [data])

  const getIndividualData = useCallback(async () => {
    const data = await fetchEventsData({ dataviews, start, end, includes: includesMemo })

    const groupedData = data.reduce(
      (acc, event) => {
        const regions = []
        if (graphType === 'byFlag') {
          regions.push(event.vessel?.flag || t('common.unknownProperty', 'Unknown'))
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

    const dataGroups = Object.entries(groupedData)
      .map(([label, events]) => ({ label, values: events }))
      .sort((a, b) => b.values.length - a.values.length)

    if (dataGroups.length <= MAX_CATEGORIES) {
      return dataGroups
    }

    const top = dataGroups.slice(0, MAX_CATEGORIES)
    const rest = dataGroups.slice(MAX_CATEGORIES)
    const others = {
      label: OTHERS_CATEGORY_LABEL,
      values: rest.flatMap((other) => other.values),
    }

    return [...top, others]
  }, [fetchEventsData, dataviews, start, end, includesMemo, graphType, t])

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
        barLabel={<ReportGraphTick graphType={graphType} dataview={dataviews[0]} />}
        individualTooltip={<EventsReportIndividualGraphTooltip eventType={eventType} />}
        aggregatedTooltip={<AggregatedGraphTooltip graphType={graphType} dataview={dataviews[0]} />}
        individualIcon={icon}
      />
    </div>
  )
}
