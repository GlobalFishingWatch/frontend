import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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

import { YEAR_REGEX } from 'features/reports/tabs/environment/migramar/reportEnvironmentMigramar.hooks'
import type { MigramarRow, MigramarRowYear } from 'routes/api/migramar/$areaId'

import styles from '../ReportEnvironment.module.css'

const CATEGORIES: Record<number, string> = {
  1: '#c82c2c',
  2: '#ffa333',
  3: '#eac806',
  4: '#73fb73',
  5: '#077f07',
}

function getCategory(value: number, { P20, P40, P60, P80 }: MigramarRow): number | null {
  const p20 = parseFloat(P20)
  const p40 = parseFloat(P40)
  const p60 = parseFloat(P60)
  const p80 = parseFloat(P80)
  if (isNaN(p20) || isNaN(p40) || isNaN(p60) || isNaN(p80)) return null
  if (value < p20) return 1
  if (value < p40) return 2
  if (value < p60) return 3
  if (value < p80) return 4
  return 5
}

function parseBaselineYears(raw: string): number[] | null {
  const years = raw
    .trim()
    .split('-')
    .map((y) => parseInt(y.trim()))
  if (years.length !== 2) return null
  return years
}

function getYearsFromRow(row: MigramarRow): number[] {
  return Object.keys(row)
    .filter((key) => YEAR_REGEX.test(key))
    .map(Number)
    .sort((a, b) => a - b)
}

type ChartPoint = {
  year: number
  status: number | null
  category: number | null
  trend: number | null
  gamm: number | null
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props
  if (payload.value === null) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={payload.category ? CATEGORIES[payload.category] : 'var(--color-primary-blue)'}
      stroke="var(--color-secondary-blue)"
    />
  )
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  const { t } = useTranslation()
  if (!active || !payload?.length) return null
  const { year, status, category, gamm } = payload[0].payload as ChartPoint
  if (status === null) return null
  return (
    <div className={styles.migramarTooltip}>
      <label>{year}</label>
      <div className={styles.migramarTooltipRow}>
        <span>
          <label>{t((t) => t.analysis.migramar.avp)}</label>
          {category !== null && (
            <div className={styles.migramarDot} style={{ background: CATEGORIES[category] }} />
          )}{' '}
          {status.toFixed(2)}
        </span>
      </div>
      {gamm !== null && (
        <Fragment>
          <label>{t((t) => t.analysis.migramar.gamm)}</label>
          {gamm.toFixed(2)}
        </Fragment>
      )}
    </div>
  )
}

function ReportEnvironmentMigramarGraph({ row }: { row: MigramarRow }) {
  const { t } = useTranslation()

  const baselineYears = row.baseline_years ? parseBaselineYears(row.baseline_years) : null

  const data = useMemo<ChartPoint[]>(() => {
    const initialVal = parseFloat(row.Estimated_initial_value) || null
    const finalVal = parseFloat(row.Estimated_final_value) || null
    const years = getYearsFromRow(row)
    const yearsWithData = years.filter((y) => {
      const raw = row[String(y) as MigramarRowYear]
      return raw !== undefined && raw.trim() !== ''
    })
    const firstYear = yearsWithData[0]
    const lastYear = yearsWithData[yearsWithData.length - 1]

    return years
      .map((year) => {
        const raw = row[String(year) as MigramarRowYear].trim()
        const parts = raw !== undefined && raw !== '' ? raw.split(';') : []
        // parts[0] is the status (AVP), parts[1] is the GAMM
        const status = parts[0] ? parseFloat(parts[0]) : null
        const gamm = parts[1] ? parseFloat(parts[1]) : null
        const trend = year === firstYear ? initialVal : year === lastYear ? finalVal : null
        return {
          year,
          status,
          gamm,
          category: status !== null ? getCategory(status, row) : null,
          trend,
        }
      })
      .filter((point) => point.status !== null)
  }, [row])

  return (
    <>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 12, right: 16, left: -32, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--color-terthiary-blue)"
            strokeOpacity={0.3}
          />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={60}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="linear"
            dataKey="status"
            stroke="var(--color-secondary-blue)"
            strokeWidth={1.5}
            dot={<CustomDot />}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={true}
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
          <Line
            type="monotone"
            dataKey="gamm"
            stroke="rgba(var(--primary-blue-rgb), 0.3)"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="gamm"
            stroke="var(--color-terthiary-blue)"
            strokeWidth={8}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="trend"
            stroke="rgba(var(--primary-blue-rgb), 0.3)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
      {data.some((p) => p.category !== null) && (
        <div className={styles.migramarLegend}>
          {Object.entries(CATEGORIES).map(([cat, color]) => (
            <div key={cat} className={styles.migramarLegendItem}>
              <span className={styles.migramarDot} style={{ background: color }} />
              {t((t) => (t.analysis.migramar as any)[`category_${cat}`])}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default ReportEnvironmentMigramarGraph
