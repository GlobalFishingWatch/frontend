import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import type { ResponsiveVisualizationData } from '../../types'
import type { BaseResponsiveBarChartProps, ResponsiveBarChartInteractionCallback } from './BarChart'

type AggregatedBarChartProps = BaseResponsiveBarChartProps & {
  data: ResponsiveVisualizationData<'aggregated'>
  onClick?: ResponsiveBarChartInteractionCallback
}
export function AggregatedBarChart({
  data,
  color,
  customTick,
  customTooltip,
  valueFormatter,
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
        // onClick={onBarClick}
      >
        {data && <Tooltip content={customTooltip} />}
        <Bar dataKey="value" fill={color}>
          <LabelList
            position="top"
            valueAccessor={(entry: any) => valueFormatter?.(entry.value) || entry.value}
          />
        </Bar>
        <XAxis
          dataKey="name"
          interval="equidistantPreserveStart"
          tickLine={false}
          minTickGap={-1000}
          tick={customTick}
          tickMargin={0}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
