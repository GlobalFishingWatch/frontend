import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import max from 'lodash/max'
import min from 'lodash/min'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'
import { CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getContrastSafeColor } from '@globalfishingwatch/responsive-visualizations'

import { formatDate, tickFormatter } from 'features/reports/report-area/area-reports.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import {
  formatDateTicks,
  formatEvolutionData,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { getUTCDateTime } from 'utils/dates'

import styles from '../activity/ReportActivityEvolution.module.css'

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

function PolygonsEvolutionTooltip({
  active,
  payload,
  label,
  timeChunkInterval,
}: {
  active?: boolean
  payload?: any[]
  label?: string
  timeChunkInterval: FourwingsInterval
}) {
  const { t } = useTranslation()

  if (!active || !payload?.length) return null

  const date = getUTCDateTime(label as string).setLocale('en')
  const formattedLabel = formatDate(date, timeChunkInterval)
  const contained = payload.filter(({ name }: any) => name === 'contained')
  const overlapping = payload.filter(({ name }: any) => name === 'overlapping')

  return (
    <div className={styles.tooltipContainer}>
      <p className={styles.tooltipLabel}>{formattedLabel}</p>
      <ul>
        {contained.map(({ value, color }: any, i: number) => (
          <li key={`c-${i}`} className={styles.tooltipRow}>
            <span className={styles.tooltipValueDot} style={{ color }} />
            {t((t) => t.analysis.polygonsContained)}: <strong>{value}</strong>
          </li>
        ))}
        {overlapping.map(({ value, color }: any, i: number) => (
          <li key={`o-${i}`} className={styles.tooltipRow}>
            <span className={styles.tooltipValueDot} style={{ color }} />
            {t((t) => t.analysis.polygonsOverlapping, { count: value as number } as any)}:{' '}
            <strong>{value}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ReportPolygonsEvolution({
  data,
  start,
  end,
}: {
  data?: ReportGraphProps
  start: string
  end: string
}) {
  const fourwingsInterval = getFourwingsInterval(start, end)
  let interval: FourwingsInterval = data?.interval || 'DAY'

  if (interval === 'MONTH' && (fourwingsInterval === 'DAY' || fourwingsInterval === 'HOUR')) {
    interval = 'DAY'
  }
  const domain = useMemo(() => {
    if (start && end && interval) {
      const intervalTimeUnit = interval.toLowerCase() as DateTimeUnit
      const intervalStartDateTime = DateTime.fromISO(start, { zone: 'utc' }).startOf(
        intervalTimeUnit
      )
      let intervalEndDateTime = DateTime.fromISO(end, { zone: 'utc' }).startOf(intervalTimeUnit)
      if (intervalStartDateTime.toMillis() === intervalEndDateTime.toMillis()) {
        intervalEndDateTime = intervalEndDateTime.plus({ [intervalTimeUnit]: 1 })
      }
      return [intervalStartDateTime.toMillis(), intervalEndDateTime.toMillis()]
    }
  }, [start, end, interval])

  const dataFormatted = useMemo(
    () => {
      if (!data) {
        return null
      }
      return formatEvolutionData(data, {
        start: domain ? new Date(domain[0]).toISOString() : start,
        end: domain ? new Date(domain[1]).toISOString() : end,
        timeseriesInterval: interval,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, start, end]
  )

  if (!dataFormatted || !domain) return null

  // Flatten all range values across all sublayers to get accurate y-axis domain
  const allValues = dataFormatted.flatMap(({ range }) =>
    (range as [number, number][]).flat().filter((n) => !isNaN(n))
  )
  const dataMin: number = (min(allValues) as number) ?? 0
  const dataMax: number = (max(allValues) as number) ?? 0
  const basePadding = (dataMax - dataMin) / 10
  const safePadding = basePadding === 0 ? Math.max(1, Math.abs(dataMax) * 0.1) : basePadding
  const paddedDomain: [number, number] = [Math.max(0, dataMin - safePadding), dataMax + safePadding]

  return (
    <div className={styles.graph}>
      <ComposedChart
        responsive
        width="100%"
        height="100%"
        data={dataFormatted}
        margin={graphMargin}
      >
        <CartesianGrid vertical={false} syncWithTicks />
        <XAxis
          domain={domain}
          dataKey="date"
          minTickGap={10}
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => formatDateTicks(tick, interval)}
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
        {dataFormatted?.length && (
          <Tooltip
            content={(props: any) => (
              <PolygonsEvolutionTooltip {...props} timeChunkInterval={interval} />
            )}
          />
        )}
        {data.sublayers.map(({ id, legend }, i) => {
          const color = getContrastSafeColor(legend?.color as string)
          return [
            <Line
              key={`${id}-${i}-contained`}
              name="contained"
              type="monotone"
              dataKey={(d) => d.range?.[i]?.[0]}
              dot={false}
              isAnimationActive={false}
              stroke={color}
              strokeWidth={2}
            />,
            <Line
              key={`${id}-${i}-overlapping`}
              name="overlapping"
              type="monotone"
              dataKey={(d) => d.range?.[i]?.[1]}
              dot={false}
              isAnimationActive={false}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="5 5"
            />,
          ]
        })}
      </ComposedChart>
    </div>
  )
}
