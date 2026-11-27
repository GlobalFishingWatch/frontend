/** Summaries of a time series for the context tools: the report activity graph and the timebar */

export const roundValue = (n: number) => Number(n.toPrecision(4))

/** Past this many points the series goes by month, to keep the output small */
export const MAX_SERIES_POINTS = 62

/** `min` / `max`: the bounds of the bucket when the graph draws a band, else `value` */
export type SeriesPoint = { date: string; value: number; min?: number; max?: number }

export function summarizeSeries(points: SeriesPoint[]) {
  const valid = points.filter((point) => Number.isFinite(point.value))
  const total = valid.reduce((acc, point) => acc + point.value, 0)
  const top = (point: SeriesPoint) => point.max ?? point.value
  const bottom = (point: SeriesPoint) => point.min ?? point.value
  const byMax = valid.toSorted((a, b) => top(b) - top(a))
  const byMin = valid.toSorted((a, b) => bottom(a) - bottom(b))
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
    max: byMax[0] && { date: byMax[0].date, value: roundValue(top(byMax[0])) },
    min: byMin[0] && { date: byMin[0].date, value: roundValue(bottom(byMin[0])) },
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
