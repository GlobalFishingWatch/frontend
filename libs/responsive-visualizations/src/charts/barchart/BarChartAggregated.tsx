import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import type { ResponsiveVisualizationData } from '../../types'
import type { BarChartByTypeProps } from '../types'

type AggregatedBarChartProps = BarChartByTypeProps<'aggregated'>

export function AggregatedBarChart({
  data,
  color,
  barLabel,
  valueKey,
  labelKey,
  onClick,
  customTooltip,
  barValueFormatter,
}: AggregatedBarChartProps) {
  return (
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
        onClick={onClick}
      >
        {data && <Tooltip content={customTooltip} />}
        <Bar dataKey={valueKey} fill={color}>
          <LabelList
            position="top"
            valueAccessor={(entry: ResponsiveVisualizationData<'aggregated'>[0]) =>
              barValueFormatter?.(entry[valueKey] as number) || entry[valueKey]
            }
          />
        </Bar>
        <XAxis
          dataKey={labelKey}
          interval="equidistantPreserveStart"
          tickLine={false}
          minTickGap={-1000}
          tick={barLabel}
          tickMargin={0}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
