import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import type { ResponsiveVisualizationValue } from '../../types'
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
  const dataKey = typeof data[0][valueKey] === 'number' ? valueKey : `${valueKey}.value`
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
        // TODO: restore this
        // onClick={(d) => onClick?.(d.activePayload)}
      >
        {data && <Tooltip content={customTooltip} />}
        {/* {valueKeys.map((valueKey) => ( */}
        <Bar
          key={valueKey}
          dataKey={dataKey}
          fill={color}
          stackId="a"
          onClick={(e) => onClick?.(e.activePayload as ResponsiveVisualizationValue)}
        >
          <LabelList
            position="top"
            valueAccessor={({ value }: { value: [number, number] }) => {
              return barValueFormatter?.(value[1]) || value[1]
            }}
          />
        </Bar>
        {/* ))} */}
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
