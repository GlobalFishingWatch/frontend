import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ComposedChart,
} from 'recharts'
import { Interval } from '@globalfishingwatch/layer-composer'
import i18n from 'features/i18n/i18n'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'
import styles from './ReportActivityGraph.module.css'
import ReportActivityGraphSelector from './ReportActivityGraphSelector'
import { selectReportActivityGraphData } from './reports.selectors'
import { formatTooltipValue, tickFormatter } from './reports.utils'

type AnalysisGraphTooltipProps = {
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
  timeChunkInterval: Interval
}
const AnalysisGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as AnalysisGraphTooltipProps

  if (active && payload && payload.length) {
    const date = getUTCDateTime(label).setLocale(i18n.language)
    const formattedLabel = formatDateForInterval(date, timeChunkInterval)
    const formattedValues = payload.filter(({ name }) => name === 'line')
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          {formattedValues.map(({ value, color, unit }, index) => {
            return (
              <li key={index} className={styles.tooltipValue}>
                <span className={styles.tooltipValueDot} style={{ color }}></span>
                {formatTooltipValue(value, unit)}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return null
}

type ReportActivityProps = {}
export default function ReportActivityGraph(props: ReportActivityProps) {
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const data = useSelector(selectReportActivityGraphData)

  return (
    <Fragment>
      <ReportActivityGraphSelector />
      <div className={styles.graph}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 15, right: 20, left: -20, bottom: -10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              // domain={domain}
              dataKey="date"
              interval="preserveStartEnd"
              // tickFormatter={(tick: number) => formatDateTicks(tick, interval)}
              // axisLine={paddedDomain[0] === 0}
              // scale={'time'}
              // type={'number'}
            />
            <YAxis
              scale="linear"
              domain={([dataMin, dataMax]) => {
                const domainPadding = (dataMax - dataMin) / 8
                return [
                  Math.max(0, Math.floor(dataMin - domainPadding)),
                  Math.ceil(dataMax + domainPadding),
                ]
              }}
              tickFormatter={tickFormatter}
              axisLine={false}
              tickLine={false}
              tickCount={4}
            />
            <Tooltip content={<AnalysisGraphTooltip timeChunkInterval={'day'} />} />
            {dataviews.map(({ id, config, datasets }) => {
              const unit = datasets[0]?.unit
              return (
                <Line
                  key={`${id}-line`}
                  name="line"
                  type="monotone"
                  dataKey={id}
                  unit={unit}
                  dot={false}
                  isAnimationActive={false}
                  stroke={config?.color}
                  strokeWidth={2}
                />
              )
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  )
}
