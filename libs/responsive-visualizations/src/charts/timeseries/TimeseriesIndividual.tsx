import { XAxis, ResponsiveContainer, YAxis, CartesianGrid, ComposedChart, Line } from 'recharts'
import min from 'lodash/min'
import max from 'lodash/max'
import type { DurationUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'
import { useMemo } from 'react'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { TimeseriesByTypeProps } from '../types'
import type { ResponsiveVisualizationItem } from '../../types'
import { IndividualPoint } from '../points/IndividualPoint'
import styles from './TimeseriesIndividual.module.css'

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

type IndividualTimeseriesProps = TimeseriesByTypeProps<'individual'>
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

  const intervalDiff = Math.floor(
    Duration.fromMillis(endMillis - startMillis).as(interval.toLowerCase() as DurationUnit)
  )

  const dataMin: number = data.length
    ? (min(data.map((item) => item[valueKey].length)) as number)
    : 0
  const dataMax: number = data.length
    ? (max(data.map((item) => item[valueKey].length)) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 8
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  const domain = useMemo(() => {
    if (start && end && interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
  }, [start, end, interval])

  const fullTimeseries = useMemo(() => {
    if (!data || !domain) {
      return []
    }
    return Array(intervalDiff)
      .fill(0)
      .map((_, i) => i)
      .map((i) => {
        const d = DateTime.fromMillis(startMillis, { zone: 'UTC' })
          .plus({ [interval]: i })
          .toISO()
        return {
          [dateKey]: d,
          [valueKey]: data.find((item) => item[dateKey] === d)?.[valueKey] || 0,
        }
      })
  }, [data, domain, intervalDiff, startMillis, dateKey])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={graphMargin}>
        <CartesianGrid vertical={false} />
        <XAxis
          domain={domain}
          dataKey={dateKey}
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => tickLabelFormatter?.(tick, interval) || tick}
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
        {/* {fullTimeseries?.length && (
          <Tooltip content={<ReportGraphTooltip timeChunkInterval={interval} />} />
        )} */}
        <foreignObject width="100%" height="100%">
          <div className={styles.container}>
            {data.map((item, index) => {
              const points = item?.[valueKey] as ResponsiveVisualizationItem[]
              return (
                <div className={styles.barContainer}>
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
