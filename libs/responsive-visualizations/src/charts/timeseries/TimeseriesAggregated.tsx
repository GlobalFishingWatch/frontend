import max from 'lodash/max'
import min from 'lodash/min'
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { ResponsiveVisualizationData } from '../../types'
import type { TimeseriesByTypeProps } from '../types'

import { useFullTimeseries, useTimeseriesDomain } from './timeseries.hooks'

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

type AggregatedTimeseriesProps = TimeseriesByTypeProps<'aggregated'>
export function AggregatedTimeseries({
  data,
  color,
  start,
  end,
  dateKey,
  valueKeys,
  customTooltip,
  timeseriesInterval,
  tickLabelFormatter,
}: AggregatedTimeseriesProps) {
  const dataMin: number = data.length
    ? (min(data.map((item) => item[valueKeys as string])) as number)
    : 0
  const dataMax: number = data.length
    ? (max(data.map((item) => item[valueKeys as string])) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 8
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  const domain = useTimeseriesDomain({ start, end, timeseriesInterval })
  const fullTimeseries = useFullTimeseries({
    start,
    end,
    data,
    timeseriesInterval,
    dateKey,
    valueKey: valueKeys as keyof ResponsiveVisualizationData[0],
  })

  if (!fullTimeseries.length) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={fullTimeseries} margin={graphMargin}>
        <CartesianGrid vertical={false} />
        <XAxis
          domain={domain}
          dataKey={dateKey}
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => tickLabelFormatter?.(tick, timeseriesInterval) || tick}
          axisLine={paddedDomain[0] === 0}
        />
        <YAxis
          scale="linear"
          domain={paddedDomain}
          interval="preserveEnd"
          // tickFormatter={tickFormatter}
          axisLine={false}
          tickLine={false}
          tickCount={4}
        />
        {data?.length && customTooltip ? <Tooltip content={customTooltip} /> : null}
        {Array.isArray(valueKeys) ? (
          valueKeys.map((valueKey) => (
            <Line
              key={valueKey}
              name="line"
              type="monotone"
              dataKey={valueKey}
              dot={false}
              isAnimationActive={false}
              stroke={color}
              strokeWidth={2}
            />
          ))
        ) : (
          <Line
            name="line"
            type="monotone"
            dataKey={valueKeys}
            dot={false}
            isAnimationActive={false}
            stroke={color}
            strokeWidth={2}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
