import React, { useCallback, memo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  AxisDomain,
} from 'recharts'
import { DateTime } from 'luxon'
import { Dataview } from '@globalfishingwatch/dataviews-client/dist/types'
import { TEST_DATAVIEW_MONTHLY_STATS, GraphData, DataviewGraphConfig } from 'data/data'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import './DataviewGraph.module.css'

interface DataviewGraphProps {
  dataview: Dataview
  graphConfig: DataviewGraphConfig
}

const DataviewGraph: React.FC<DataviewGraphProps> = (props) => {
  const { dataview, graphConfig } = props
  const { start, end } = useTimerangeConnect()

  const data = (TEST_DATAVIEW_MONTHLY_STATS[`dataview-${dataview.id}`] || []).filter((current) => {
    const currentDate = DateTime.fromISO(current.date).startOf('day')
    const startDate = DateTime.fromISO(start).startOf('day')
    const endDate = DateTime.fromISO(end).startOf('day')
    return currentDate >= startDate && currentDate <= endDate
  })
  const dataMax: AxisDomain = data.length
    ? data.reduce((prev: GraphData, curr: GraphData) => (curr.value > prev.value ? curr : prev))
        .value
    : 0
  const dataMin: AxisDomain = data.length
    ? data.reduce((prev: GraphData, curr: GraphData) => (curr.value < prev.value ? curr : prev))
        .value
    : 0
  const domainPadding = (dataMax - dataMin) / 4
  const paddedDomain: [AxisDomain, AxisDomain] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  const formatDates = useCallback((tick: string, withYear = false) => {
    const tickDate = DateTime.fromISO(tick)
    return tickDate.month === 1 || withYear ? tickDate.toFormat('LLL yy') : tickDate.toFormat('LLL')
  }, [])

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 15, right: 20, left: -20, bottom: -10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => formatDates(tick)}
          axisLine={paddedDomain[0] === 0}
        />
        <YAxis
          scale="linear"
          domain={paddedDomain}
          axisLine={false}
          tickLine={false}
          tickCount={4}
        />
        <Tooltip
          labelFormatter={(label) => formatDates(label as string, true)}
          formatter={(value) => [`${value} ${graphConfig?.unit}`, '']}
          separator=""
        />
        <Line
          type="linear"
          dataKey="value"
          stroke={graphConfig?.color}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default memo(DataviewGraph)
