import { Bar, BarChart, LabelList, Tooltip, XAxis } from 'recharts'

import { getResponsiveVisualizationItemValue } from '../../lib/values'
import type {
  ResponsiveVisualizationAggregatedObjectValue,
  ResponsiveVisualizationValue,
} from '../../types'
import type { BarChartByTypeProps } from '../types'

type AggregatedBarChartProps = BarChartByTypeProps<'aggregated'>

export function AggregatedBarChart({
  data,
  color,
  barLabel,
  barLabelInterval = 'equidistantPreserveStart',
  valueKeys,
  labelKey,
  onClick,
  customTooltip,
  barValueFormatter,
}: AggregatedBarChartProps) {
  const getStackTotal = (payload: any) =>
    (Array.isArray(valueKeys) ? valueKeys : [valueKeys]).reduce(
      (acc, key) => acc + (getResponsiveVisualizationItemValue(payload?.[key]) || 0),
      0
    )

  const stackTopLabelAccessor = ({ value, payload }: { value: any; payload: any }) => {
    const segmentTop = Array.isArray(value) ? value[1] : value
    const total = getStackTotal(payload)
    if (segmentTop !== total) return ''
    return barValueFormatter?.(total) ?? total
  }

  return (
    <BarChart
      responsive
      width="100%"
      height="100%"
      data={data}
      margin={{
        top: 15,
        right: 0,
        left: 0,
        bottom: 0,
      }}
      onClick={(d: any) => {
        onClick?.(d.activePayload?.[0]?.payload)
      }}
    >
      {data && <Tooltip content={customTooltip} />}
      {Array.isArray(valueKeys) ? (
        valueKeys.map((valueKey) => {
          const value = data?.find((d) => d?.[valueKey] !== undefined)?.[valueKey]
          const isValueObject = typeof value === 'object'
          const dataKey = isValueObject ? `${valueKey}.value` : valueKey
          const barColor = isValueObject
            ? (value as ResponsiveVisualizationAggregatedObjectValue)?.color || color
            : color
          return (
            <Bar
              key={valueKey}
              dataKey={dataKey}
              fill={barColor}
              stackId="a"
              onClick={(e) => {
                onClick?.((e as any).payload as ResponsiveVisualizationValue)
              }}
              isAnimationActive={false}
            >
              <LabelList position="top" valueAccessor={stackTopLabelAccessor as any} />
            </Bar>
          )
        })
      ) : (
        <Bar
          dataKey={valueKeys}
          fill={color}
          onClick={(e) => onClick?.((e as any).payload as ResponsiveVisualizationValue)}
        >
          <LabelList position="top" valueAccessor={stackTopLabelAccessor as any} />
        </Bar>
      )}
      <XAxis
        dataKey={labelKey}
        interval={barLabelInterval}
        tickLine={false}
        minTickGap={-1000}
        tick={barLabel}
        tickMargin={0}
      />
    </BarChart>
  )
}
