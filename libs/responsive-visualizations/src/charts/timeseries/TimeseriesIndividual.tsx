import { XAxis, ResponsiveContainer, ComposedChart, Tooltip } from 'recharts'
import cx from 'classnames'
import type { ReactElement } from 'react'
import type { TimeseriesByTypeProps } from '../types'
import type { ResponsiveVisualizationData, ResponsiveVisualizationValue } from '../../types'
import { IndividualPoint } from '../points/IndividualPoint'
import { AXIS_LABEL_PADDING, POINT_GAP, DEFAULT_POINT_SIZE, TIMESERIES_PADDING } from '../config'
import styles from './TimeseriesIndividual.module.css'
import { useFullTimeseries, useTimeseriesDomain } from './timeseries.hooks'

const graphMargin = { top: 0, right: DEFAULT_POINT_SIZE, left: DEFAULT_POINT_SIZE, bottom: 0 }

type IndividualTimeseriesProps = TimeseriesByTypeProps<'individual'> & {
  width: number
  icon?: ReactElement
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
  icon,
}: IndividualTimeseriesProps) {
  const domain = useTimeseriesDomain({ start, end, timeseriesInterval })
  const fullTimeseries = useFullTimeseries({
    start,
    end,
    data,
    timeseriesInterval,
    dateKey,
    valueKey: valueKey as keyof ResponsiveVisualizationData[0],
    aggregated: false,
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={fullTimeseries} margin={graphMargin}>
        <XAxis
          domain={domain}
          dataKey={dateKey}
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => tickLabelFormatter?.(tick, timeseriesInterval) || tick}
          axisLine={true}
        />
        {fullTimeseries?.length && <Tooltip content={customTooltip} />}
        <foreignObject width="100%" height="100%">
          <div
            className={cx(styles.container)}
            style={{ paddingBottom: AXIS_LABEL_PADDING, paddingInline: TIMESERIES_PADDING }}
          >
            {fullTimeseries.map((item, index) => {
              const points = item?.[valueKey] as ResponsiveVisualizationValue<'individual'>[]
              return (
                <div
                  key={index}
                  className={styles.barContainer}
                  style={{ width: DEFAULT_POINT_SIZE }}
                >
                  <ul className={styles.bar} style={{ gap: POINT_GAP }}>
                    {points?.map((point, pointIndex) => (
                      <IndividualPoint
                        key={pointIndex}
                        point={point}
                        color={color}
                        tooltip={customTooltip}
                        icon={icon}
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
