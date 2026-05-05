import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { MigramarRow } from 'routes/api/migramar/$areaId'

import styles from '../ReportEnvironment.module.css'

const YEAR_REGEX = /^\d{4}$/

function getYearsFromRow(row: MigramarRow): number[] {
  return Object.keys(row)
    .filter((key) => YEAR_REGEX.test(key))
    .map(Number)
    .sort((a, b) => a - b)
}

const CATEGORY_COLORS: Record<number, string> = {
  1: '#c82c2c',
  2: '#ffa333',
  3: '#eac806',
  4: '#73fb73',
  5: '#077f07',
}

function getCategory(value: number, { P20, P40, P60, P80 }: MigramarRow): number {
  const p20 = parseFloat(P20)
  const p40 = parseFloat(P40)
  const p60 = parseFloat(P60)
  const p80 = parseFloat(P80)
  if (value < p20) return 1
  if (value < p40) return 2
  if (value < p60) return 3
  if (value < p80) return 4
  return 5
}

type ChartPoint = {
  year: number
  value: number | null
  category: number | null
  trend: number | null
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props
  if (payload.value === null || payload.category === null) return null
  return <circle cx={cx} cy={cy} r={5} fill={CATEGORY_COLORS[payload.category]} stroke="none" />
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { year, value, category } = payload[0].payload as ChartPoint
  if (value === null) return null
  return (
    <div className={styles.migramarTooltip}>
      <label>{year}</label>
      {category !== null && (
        <div
          className={styles.migramarDot}
          style={{
            background: CATEGORY_COLORS[category],
          }}
        />
      )}
      {value.toFixed(3)}
    </div>
  )
}

function parseBaselineYears(raw: string): number[] | null {
  const years = raw
    .trim()
    .split('-')
    .map((y) => parseInt(y.trim()))
  if (years.length !== 2) return null
  return years
}

function ReportEnvironmentMigramarGraph({ row }: { row: MigramarRow }) {
  const slope = row.slope !== undefined && row.slope !== '' ? parseFloat(row.slope) : null
  const intercept =
    row.intercept !== undefined && row.intercept !== '' ? parseFloat(row.intercept) : null
  const hasTrend = slope !== null && !isNaN(slope) && intercept !== null && !isNaN(intercept)
  const baselineYears = row.baseline_years ? parseBaselineYears(row.baseline_years) : null

  const data = useMemo<ChartPoint[]>(
    () =>
      getYearsFromRow(row).map((year) => {
        const raw = row[String(year)]
        const value = raw !== undefined && raw !== '' ? parseFloat(raw) : null
        return {
          year,
          value,
          category: value !== null ? getCategory(value, row) : null,
          trend: hasTrend ? slope! * year + intercept! : null,
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row]
  )

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 12, right: 16, left: -32, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-terthiary-blue)" strokeOpacity={0.3} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={60} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-terthiary-blue)"
          strokeWidth={1.5}
          dot={<CustomDot />}
          activeDot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
        {baselineYears && (
          <ReferenceArea
            x1={baselineYears[0]}
            x2={baselineYears[1]}
            fill="#888888"
            fillOpacity={0.1}
            stroke="none"
          />
        )}
        {hasTrend && (
          <Line
            type="monotone"
            dataKey="trend"
            stroke="var(--color-secondary-blue)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ReportEnvironmentMigramarGraph
