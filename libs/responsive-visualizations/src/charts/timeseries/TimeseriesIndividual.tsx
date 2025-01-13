import { XAxis, ResponsiveContainer, ComposedChart, Tooltip } from 'recharts'
import cx from 'classnames'
import type { ResponsiveVisualizationAnyItemKey, TimeseriesByTypeProps } from '../types'
import type { ResponsiveVisualizationItem } from '../../types'
import { IndividualPoint } from '../points/IndividualPoint'
import { AXIS_LABEL_PADDING, POINT_GAP, POINT_SIZE, TIMESERIES_PADDING } from '../config'
import styles from './TimeseriesIndividual.module.css'
import { useFullTimeseries, useTimeseriesDomain } from './timeseries.hooks'

const graphMargin = { top: 0, right: POINT_SIZE, left: POINT_SIZE, bottom: 0 }

type IndividualTimeseriesProps = TimeseriesByTypeProps<'individual'> & {
  width: number
}

export function IndividualTimeseries({
  data,
  color,
  start,
  end,
  dateKey,
  valueKey,
  timeseriesInterval,
  tickLabelFormatter,
  customTooltip,
}: IndividualTimeseriesProps) {
  const domain = useTimeseriesDomain({ start, end, timeseriesInterval })
  const fullTimeseries = useFullTimeseries({
    start,
    end,
    data,
    timeseriesInterval,
    dateKey,
    valueKey: valueKey as ResponsiveVisualizationAnyItemKey,
    aggregated: false,
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={fullTimeseries} margin={graphMargin}>
        {/* <CartesianGrid vertical={false} /> */}
        <XAxis
          domain={domain}
          dataKey={dateKey}
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => tickLabelFormatter?.(tick, timeseriesInterval) || tick}
          axisLine={true}
        />
        {/* TODO: restore this and align with the points */}
        {/* <YAxis
          scale="linear"
          // Height minus the padding from the bottom and top
          domain={[0, 19]}
          interval="preserveEnd"
          // tickFormatter={tickFormatter}
          axisLine={false}
          tickLine={false}
          tickCount={4}
        /> */}
        {fullTimeseries?.length && <Tooltip content={customTooltip} />}
        <foreignObject width="100%" height="100%">
          <div
            className={cx(styles.container)}
            style={{ paddingBottom: AXIS_LABEL_PADDING, paddingInline: TIMESERIES_PADDING }}
          >
            {fullTimeseries.map((item, index) => {
              const points = item?.[valueKey] as ResponsiveVisualizationItem[]
              return (
                <div key={index} className={styles.barContainer} style={{ width: POINT_SIZE }}>
                  <ul className={styles.bar} style={{ gap: POINT_GAP }}>
                    {points?.map((point, pointIndex) => (
                      <IndividualPoint
                        key={pointIndex}
                        point={point}
                        color={color}
                        tooltip={customTooltip}
                      />
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </foreignObject>
      </ComposedChart>
    </ResponsiveContainer>
  )
}
