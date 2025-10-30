import { Bar, BarChart, LabelList, Tooltip, XAxis } from 'recharts'

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
  valueKeys,
  labelKey,
  onClick,
  customTooltip,
  barValueFormatter,
}: AggregatedBarChartProps) {
  return (
    <BarChart
      responsive
      width={500}
      height={300}
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
        valueKeys.map((valueKey, index) => {
          const value = data?.[index]?.[valueKey]
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
              {index === valueKeys.length - 1 && (
                <LabelList
                  position="top"
                  valueAccessor={({ value }: { value: any }) => {
                    return barValueFormatter?.(value[1]) || value[1]
                  }}
                />
              )}
            </Bar>
          )
        })
      ) : (
        <Bar
          dataKey={valueKeys}
          fill={color}
          onClick={(e) => onClick?.((e as any).payload as ResponsiveVisualizationValue)}
        >
          <LabelList
            position="top"
            valueAccessor={({ value }: { value: any }) => {
              return barValueFormatter?.(value[1]) || value[1]
            }}
          />
        </Bar>
      )}
      <XAxis
        dataKey={labelKey}
        interval="equidistantPreserveStart"
        tickLine={false}
        minTickGap={-1000}
        tick={barLabel}
        tickMargin={0}
      />
    </BarChart>
  )
}
