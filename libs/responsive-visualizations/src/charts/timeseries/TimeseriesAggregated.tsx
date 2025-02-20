import { format } from 'd3-format'
import { getResponsiveVisualizationItemValue } from 'libs/responsive-visualizations/src/lib/density'
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

import type { ResponsiveVisualizationAggregatedObjectValue } from '../../types'
import type { TimeseriesByTypeProps } from '../types'

import { useFullTimeseries, useTimeseriesDomain } from './timeseries.hooks'

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

const tickFormatter = (tick: number) => {
  const formatter = tick < 1 && tick > -1 ? '~r' : '~s'
  return format(formatter)(tick)
}

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
  const valueKeysArray = Array.isArray(valueKeys) ? valueKeys : [valueKeys]
  const allValues = data.flatMap((item) =>
    valueKeysArray.map((valueKey) => getResponsiveVisualizationItemValue(item[valueKey as string]))
  )
  const dataMin: number = allValues.length ? (min(allValues) as number) : 0
  const dataMax: number = allValues.length ? (max(allValues) as number) : 0

  const domainPadding = (dataMax - dataMin) / 10
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
    valueKeys: valueKeysArray,
  })

  if (!fullTimeseries.length) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={fullTimeseries} margin={graphMargin}>
        <CartesianGrid vertical={false} syncWithTicks />
        <XAxis
          domain={domain}
          dataKey={dateKey}
          interval="equidistantPreserveStart"
          tickFormatter={(tick: string) => tickLabelFormatter?.(tick, timeseriesInterval) || tick}
          axisLine={paddedDomain[0] === 0}
        />
        <YAxis
          scale="linear"
          domain={paddedDomain}
          interval="preserveEnd"
          tickFormatter={tickFormatter}
          axisLine={false}
          tickLine={false}
        />
        {data?.length && customTooltip ? <Tooltip content={customTooltip} /> : null}
        {Array.isArray(valueKeys) ? (
          valueKeys.map((valueKey) => {
            const isValueObject = typeof data?.[0]?.[valueKey] === 'object'
            const dataKey = isValueObject ? `${valueKey}.value` : valueKey
            const lineColor = isValueObject
              ? (data[0][valueKey] as ResponsiveVisualizationAggregatedObjectValue).color || color
              : color
            return (
              <Line
                key={valueKey}
                name="line"
                type="monotone"
                dataKey={dataKey}
                dot={false}
                isAnimationActive={false}
                stroke={lineColor}
                strokeWidth={2}
              />
            )
          })
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
