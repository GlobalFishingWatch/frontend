/** Summaries of a time series for the context tools: the report activity graph and the timebar */

/**
 * Two decimals, like the graph tooltips (`formatI18nNumber`), so the agent quotes the numbers the
 * user sees. Values under 1 keep 4 significant digits: environment layers can be that small.
 */
export const roundValue = (n: number) =>
  Math.abs(n) >= 1 ? Math.round(n * 100) / 100 : Number(n.toPrecision(4))

/** Past this many points the series goes by month, to keep the output small */
export const MAX_SERIES_POINTS = 62

export type SeriesPoint = { date: string; value: number }

export function summarizeSeries(points: SeriesPoint[]) {
  const valid = points.filter((point) => Number.isFinite(point.value))
  const total = valid.reduce((acc, point) => acc + point.value, 0)
  const byValue = valid.toSorted((a, b) => b.value - a.value)
  const max = byValue[0]
  const min = byValue.at(-1)
  const months = Object.entries(
    valid.reduce<Record<string, number[]>>((acc, { date, value }) => {
      ;(acc[date.slice(0, 7)] ??= []).push(value)
      return acc
    }, {})
  )
  return {
    points: valid.length,
    total: roundValue(total),
    mean: valid.length ? roundValue(total / valid.length) : undefined,
    max: max && { date: max.date, value: roundValue(max.value) },
    min: min && { date: min.date, value: roundValue(min.value) },
    ...(valid.length <= MAX_SERIES_POINTS
      ? {
          series: valid.map(
            ({ date, value }) => [date.slice(0, 10), roundValue(value)] as [string, number]
          ),
        }
      : {
          monthly: months.map(([month, values]) => {
            const sum = values.reduce((acc, v) => acc + v, 0)
            return { month, total: roundValue(sum), mean: roundValue(sum / values.length) }
          }),
        }),
  }
}
