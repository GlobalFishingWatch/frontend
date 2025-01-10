import { XAxis, ResponsiveContainer, ComposedChart } from 'recharts'
import { DateTime } from 'luxon'
import cx from 'classnames'
import { useMemo } from 'react'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { TimeseriesByTypeProps } from '../types'
import type { ResponsiveVisualizationItem } from '../../types'
import { IndividualPoint } from '../points/IndividualPoint'
import { AXIS_LABEL_PADDING, POINT_SIZE } from '../config'
import styles from './TimeseriesIndividual.module.css'

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
  tickLabelFormatter,
  customTooltip,
}: IndividualTimeseriesProps) {
  const startMillis = DateTime.fromISO(start).toMillis()
  const endMillis = DateTime.fromISO(end).toMillis()
  const interval = getFourwingsInterval(startMillis, endMillis)

  // const intervalDiff = Math.floor(
  //   Duration.fromMillis(endMillis - startMillis).as(interval.toLowerCase() as DurationUnit)
  // )

  const domain = useMemo(() => {
    if (start && end && interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
  }, [start, end, interval])

  // const fullTimeseries = useMemo(() => {
  //   if (!data || !domain) {
  //     return []
  //   }
  //   return Array(intervalDiff)
  //     .fill(0)
  //     .map((_, i) => i)
  //     .map((i) => {
  //       const d = DateTime.fromMillis(startMillis, { zone: 'UTC' })
  //         .plus({ [interval]: i })
  //         .toISO()
  //       return {
  //         [dateKey]: d,
  //         [valueKey]: data.find((item) => item[dateKey] === d)?.[valueKey] || 0,
  //       }
  //     })
  // }, [data, domain, intervalDiff, startMillis, interval, dateKey, valueKey])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={graphMargin}>
        {/* <CartesianGrid vertical={false} /> */}
        <XAxis
          domain={domain}
          dataKey={dateKey}
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => tickLabelFormatter?.(tick, interval) || tick}
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
        {/* {fullTimeseries?.length && (
          <Tooltip content={<ReportGraphTooltip timeChunkInterval={interval} />} />
        )} */}
        <foreignObject width="100%" height="100%">
          <div className={cx(styles.container, {[styles.containerSingleTime]: data.length === 1})} style={{ paddingBottom: AXIS_LABEL_PADDING }}>
            {data.map((item, index) => {
              const points = item?.[valueKey] as ResponsiveVisualizationItem[]
              return (
                <div className={styles.barContainer} style={{width: POINT_SIZE}}>
                  <ul key={index} className={styles.bar}>
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
