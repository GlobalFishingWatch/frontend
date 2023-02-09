import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { selectReportVesselGraph } from 'features/app/app.selectors'
import { ReportVesselGraph } from 'types'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import I18nNumber from 'features/i18n/i18nNumber'
import styles from './ReportVesselsGraph.module.css'
import { selectReportVesselsGraphData } from './reports.selectors'

type ReportVesselsGraphProps = {}

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

  const translatedLabel =
    type === 'geartype'
      ? `${t(`vessel.gearTypes.${label}` as any, label)}`
      : t(`flags:${label}` as any, EMPTY_FIELD_PLACEHOLDER)
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{translatedLabel}</p>
        <ul>
          {payload.map(({ value, color, unit }, index) => {
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

export default function ReportVesselsGraph(props: ReportVesselsGraphProps) {
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
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Tooltip content={<ReportGraphTooltip type={selectedReportVesselGraph} />} />
            {dataviews.map((dataview) => {
              return (
                <Bar
                  key={dataview.id}
                  dataKey={dataview.id}
                  stackId="a"
                  fill={dataview.config?.color}
                />
              )
            })}
            <XAxis dataKey="name" interval="preserveStart" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  )
}
