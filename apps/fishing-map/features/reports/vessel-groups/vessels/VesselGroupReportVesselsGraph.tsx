import React, { Fragment } from 'react'
import cx from 'classnames'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { useTranslation } from 'react-i18next'
import { VesselGroupEventsStatsResponseGroups } from 'queries/vessel-group-events-stats-api'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import { EMPTY_API_VALUES, OTHERS_CATEGORY_LABEL } from 'features/reports/areas/area-reports.config'
import { formatInfoField } from 'utils/info'
import { useLocationConnect } from 'routes/routes.hook'
import {
  VesselGroupReportState,
  VGRVesselsSubsection,
} from 'features/vessel-groups/vessel-groups.types'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { OTHER_CATEGORY_LABEL } from 'features/reports/vessel-groups/vessel-group-report.config'
import styles from './VesselGroupReportVesselsGraph.module.css'

type ReportGraphTooltipProps = {
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
  label: string
  type: VGRVesselsSubsection | 'geartype'
}

const ReportGraphTooltip = (props: any) => {
  const { active, payload, label, type } = props as ReportGraphTooltipProps
  const { t } = useTranslation()

  let parsedLabel = label
  if (EMPTY_API_VALUES.includes(label)) parsedLabel = t('common.unknown', 'Unknown')
  else if (type === 'flag') {
    parsedLabel = formatInfoField(label, 'flag') as string
  } else if (type === 'geartype') {
    parsedLabel = formatInfoField(label, 'geartypes') as string
  }
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{parsedLabel}</p>
        <ul>
          {payload
            .map(({ value }, index) => {
              return value !== 0 ? (
                <li key={index} className={styles.tooltipValue}>
                  <I18nNumber number={value} /> {t('common.vessel', { count: value }).toLowerCase()}
                </li>
              ) : null
            })
            .reverse()}
        </ul>
      </div>
    )
  }

  return null
}

const CustomTick = (props: any) => {
  const { x, y, payload, width, visibleTicksCount, property, filterQueryParam, pageQueryParam } =
    props
  console.log(props)

  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const isOtherCategory = payload.value === OTHERS_CATEGORY_LABEL
  const isCategoryInteractive = !EMPTY_API_VALUES.includes(payload.value)

  const getTickLabel = (label: string) => {
    if (EMPTY_API_VALUES.includes(label)) return t('analysis.unknown', 'Unknown')
    switch (property) {
      case 'flag':
        return formatInfoField(label, 'flag') as string
      case 'geartype':
        return formatInfoField(label, 'geartypes') as string
      default:
        return label
    }
  }
  const filterProperties: Record<VGRVesselsSubsection | 'geartype', string> = {
    flag: 'flag',
    shiptypes: 'type',
    geartypes: 'gear',
    geartype: 'gear',
    source: 'source',
  }

  const onLabelClick = () => {
    if (payload.value !== OTHER_CATEGORY_LABEL) {
      dispatchQueryParams({
        [filterQueryParam]: `${filterProperties[property as VGRVesselsSubsection]}:${
          payload.value
        }`,
        [pageQueryParam]: 0,
      })
    }
  }

  const label = isOtherCategory ? t('analysis.others', 'Others') : getTickLabel(payload.value)
  const labelChunks = label.split(' ')
  let labelChunksClean = [labelChunks[0]]
  labelChunks.slice(1).forEach((chunk: any) => {
    let currentChunk = labelChunksClean[labelChunksClean.length - 1]
    if (currentChunk.length + chunk.length >= width / visibleTicksCount / 8) {
      labelChunksClean.push(chunk)
    } else {
      labelChunksClean[labelChunksClean.length - 1] = currentChunk + ' ' + chunk
    }
  })

  return (
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
          {isOtherCategory && (
            <Fragment>
              <tspan>&nbsp;</tspan>
              <tspan className={styles.info}>i</tspan>
            </Fragment>
          )}
        </Fragment>
      ))}
    </text>
  )
}

export type VesselGroupReportVesselsGraphProperty = 'flag' | 'geartype'

export default function VesselGroupReportVesselsGraph({
  data,
  color = COLOR_PRIMARY_BLUE,
  property,
  filterQueryParam,
  pageQueryParam,
}: {
  data: VesselGroupEventsStatsResponseGroups
  color?: string
  property: VesselGroupReportVesselsGraphProperty
  filterQueryParam: keyof VesselGroupReportState
  pageQueryParam: keyof VesselGroupReportState
}) {
  return (
    <Fragment>
      <div className={styles.graph} data-test="report-vessels-graph">
        {data && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 15,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              {data && <Tooltip content={<ReportGraphTooltip type={property} />} />}
              <Bar className={styles.bar} dataKey="value" fill={color}>
                <LabelList
                  position="top"
                  valueAccessor={(entry: any) => formatI18nNumber(entry.value)}
                />
              </Bar>
              <XAxis
                dataKey="name"
                interval="equidistantPreserveStart"
                tickLine={false}
                minTickGap={-1000}
                tick={
                  <CustomTick
                    property={property}
                    filterQueryParam={filterQueryParam}
                    pageQueryParam={pageQueryParam}
                  />
                }
                tickMargin={0}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Fragment>
  )
}
