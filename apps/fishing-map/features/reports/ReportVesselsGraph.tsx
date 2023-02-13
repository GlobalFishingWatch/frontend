import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { useTranslation } from 'react-i18next'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { selectReportVesselGraph } from 'features/app/app.selectors'
import { ReportVesselGraph } from 'types'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import styles from './ReportVesselsGraph.module.css'
import { DEFAULT_NULL_VALUE, selectReportVesselsGraphData } from './reports.selectors'

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
  type: ReportVesselGraph
}

const ReportGraphTooltip = (props: any) => {
  const { active, payload, label, type } = props as ReportGraphTooltipProps
  const { t } = useTranslation()

  let translatedLabel = ''
  if (label === DEFAULT_NULL_VALUE) translatedLabel = t('common.unknown', 'Unknown')
  else if (type === 'geartype') {
    translatedLabel = `${t(`vessel.gearTypes.${label}` as any, label)}`
  } else {
    translatedLabel = t(`flags:${label}` as any, label)
  }
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{translatedLabel}</p>
        <ul>
          {payload
            .slice()
            .reverse()
            .map(({ value, color }, index) => {
              return value !== 0 ? (
                <li key={index} className={styles.tooltipValue}>
                  <span className={styles.tooltipValueDot} style={{ color }}></span>
                  <I18nNumber number={value} /> {t('common.vessel', { count: value }).toLowerCase()}
                </li>
              ) : null
            })}
        </ul>
      </div>
    )
  }

  return null
}

const CustomTick = (props: any) => {
  const { x, y, payload } = props
  const { t } = useTranslation()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  let label = payload.value
  if (label === DEFAULT_NULL_VALUE) {
    label = t('common.unknown', 'Unknown')
  } else {
    label =
      selectedReportVesselGraph === 'geartype'
        ? `${t(`vessel.gearTypes.${label}` as any, label)}`
        : t(`flags:${label}` as any, label)
  }
  const labelChunks = label.split(' ')
  let labelChunksClean = [labelChunks[0]]
  labelChunks.slice(1).forEach((chunk) => {
    let currentChunk = labelChunksClean[labelChunksClean.length - 1]
    if (currentChunk.length + chunk.length >= 15) {
      labelChunksClean.push(chunk)
    } else {
      labelChunksClean[labelChunksClean.length - 1] = currentChunk + ' ' + chunk
    }
  })
  return (
    <text transform={`translate(${x},${y - 3})`}>
      {labelChunksClean.map((chunk) => (
        <tspan key={chunk} className={styles.axisLabel} textAnchor="middle" x="0" dy={12}>
          {chunk}
        </tspan>
      ))}
    </text>
  )
}

export default function ReportVesselsGraph() {
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const data = useSelector(selectReportVesselsGraphData)
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  return (
    <Fragment>
      <div className={styles.graph}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <Tooltip content={<ReportGraphTooltip type={selectedReportVesselGraph} />} />
            {dataviews.map((dataview, index) => {
              return (
                <Bar
                  key={dataview.id}
                  dataKey={dataview.id}
                  stackId="a"
                  fill={dataview.config?.color}
                >
                  {index === dataviews.length - 1 && (
                    <LabelList
                      position="top"
                      valueAccessor={(entry) => formatI18nNumber(entry.value[1])}
                    />
                  )}
                </Bar>
              )
            })}
            <XAxis
              dataKey="name"
              interval="preserveStart"
              tickLine={false}
              minTickGap={-1000}
              tick={<CustomTick />}
              tickMargin={0}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  )
}
