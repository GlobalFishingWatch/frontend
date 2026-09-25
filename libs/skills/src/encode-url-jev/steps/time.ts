import type { Questions } from '@typesafe-ai/sdk'
import { choice } from '@typesafe-ai/sdk'

import type { Step } from './step'

// The time period. Jev reads dates as text and can't do date math (docs: model jaggedness,
// "date and time comparison"), so it only picks date parts from closed sets and code builds
// the range. `end` is exclusive: the day after the period.

const FIRST_YEAR = 2012
const NOT_STATED = 'not_stated'
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const RELATIVE_UNITS = ['day', 'week', 'month', 'year'] as const
type RelativeUnit = (typeof RELATIVE_UNITS)[number]

const options = (name: string, values: string[]) =>
  Object.fromEntries([
    [
      NOT_STATED,
      `No ${name} is written, e.g. "May 2025" writes no day, "last June" writes no year`,
    ],
    ...values.map((v) => [v, null]),
  ])
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => String(from + i))

export type TimeDecision = {
  /** ISO datetimes for `state.start` / `state.end` (end exclusive) */
  start: string
  end: string
  /** Inclusive calendar dates (YYYY-MM-DD), for vessel search transmission dates */
  firstDay: string
  lastDay: string
}

const utc = (year: number, month: number, day: number) => new Date(Date.UTC(year, month, day))
const toDay = (date: Date) => date.toISOString().slice(0, 10)
const toRange = (start: Date, end: Date): TimeDecision => ({
  start: start.toISOString(),
  end: end.toISOString(),
  firstDay: toDay(start),
  lastDay: toDay(utc(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() - 1)),
})

/** "last 7 days" → [today - 7 days, today), both at midnight UTC */
export const getRelativeRange = (now: Date, unit: RelativeUnit, count: number): TimeDecision => {
  const end = utc(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const start = new Date(end)
  if (unit === 'day') start.setUTCDate(start.getUTCDate() - count)
  if (unit === 'week') start.setUTCDate(start.getUTCDate() - 7 * count)
  if (unit === 'month') start.setUTCMonth(start.getUTCMonth() - count)
  if (unit === 'year') start.setUTCFullYear(start.getUTCFullYear() - count)
  return toRange(start, end)
}

type PeriodParts = Partial<
  Record<'startYear' | 'startMonth' | 'startDay' | 'endYear' | 'endMonth' | 'endDay', string>
>

/**
 * Calendar period → [start, day after the last day). The granularity of each bound is the
 * finest part stated: "2025" is a year, "May 2025" a month, "July 5th" a day. An unstated
 * year means the most recent one that is not in the future ("last June").
 */
export const getPeriodRange = (now: Date, parts: PeriodParts): TimeDecision | undefined => {
  const month = (name?: string) => (name ? MONTHS.indexOf(name) : undefined)
  const startMonth = month(parts.startMonth)
  const startDay = parts.startDay ? Number(parts.startDay) : undefined
  if (!parts.startYear && startMonth === undefined && startDay === undefined) return undefined

  let startYear = Number(parts.startYear)
  if (!parts.startYear) {
    startYear = now.getUTCFullYear()
    if (utc(startYear, startMonth ?? 0, startDay ?? 1) > now) startYear--
  }
  const start = utc(startYear, startMonth ?? 0, startDay ?? 1)

  const endMonth = month(parts.endMonth)
  const endDay = parts.endDay ? Number(parts.endDay) : undefined
  if (parts.endYear || endMonth !== undefined || endDay !== undefined) {
    let endYear = parts.endYear ? Number(parts.endYear) : startYear
    const lastMonth = endMonth ?? (endDay !== undefined ? (startMonth ?? 0) : 11)
    // "November to February" crosses into the next year
    if (!parts.endYear && utc(endYear, lastMonth, endDay ?? 1) < start) endYear++
    const end =
      endDay !== undefined
        ? utc(endYear, lastMonth, endDay + 1)
        : endMonth !== undefined
          ? utc(endYear, endMonth + 1, 1)
          : utc(endYear + 1, 0, 1)
    return toRange(start, end)
  }

  const end =
    startDay !== undefined
      ? utc(startYear, startMonth ?? 0, startDay + 1)
      : startMonth !== undefined
        ? utc(startYear, startMonth + 1, 1)
        : utc(startYear + 1, 0, 1)
  return toRange(start, end)
}

export type PeriodKind = 'none' | 'period' | 'range' | 'relative'
export type PeriodDecision = { kind: PeriodKind }

export const periodStep: Step<PeriodDecision> = {
  needs: [],
  questions() {
    return {
      'period.kind': choice('Does `message` give a time period?', {
        none: 'No time period is mentioned. How long events last ("more than 12 hours") is not a period',
        period:
          'One calendar year, month or day, e.g. "2025", "May 2025", "last June", "on July 5th"',
        range: 'From one date to another, e.g. "January to March", "between 2016 and 2018"',
        relative:
          'A span counted back from today, e.g. "last 7 days", "last week", "past 3 months", "last year"',
      }),
    }
  },
  resolve(read) {
    return {
      kind: read.choice<PeriodKind>('period.kind', 'whether a time period is given', 'none'),
    }
  },
}

// Only the parts the period kind needs: a range has an end, a relative span has unit + count
export const timeStep: Step<TimeDecision | undefined, 'period'> = {
  needs: ['period'],
  questions(ctx, { period }): Questions {
    if (period.kind === 'relative') {
      return {
        'time.relative_unit': choice(
          'Which unit is the span counted back from today measured in?',
          Object.fromEntries(RELATIVE_UNITS.map((unit) => [unit, null]))
        ),
        'time.relative_count': choice(
          'How many of those units does the span cover? ("last week" is 1)',
          Object.fromEntries(range(1, 31).map((n) => [n, null]))
        ),
      }
    }
    if (period.kind === 'none') return {}
    const years = range(FIRST_YEAR, ctx.now.getUTCFullYear())
    // "written in" rather than "does it start in": Jev otherwise fills in a day 1 for "May 2025"
    const part = (bound: 'start' | 'end', name: string, values: string[]) =>
      choice(
        `Which ${name} is written in \`message\` for the ${bound} of the period?`,
        options(name, values)
      )
    return {
      'time.start_year': part('start', 'year', years),
      'time.start_month': part('start', 'month', MONTHS),
      'time.start_day': part('start', 'day of the month', range(1, 31)),
      ...(period.kind === 'range' && {
        'time.end_year': part('end', 'year', years),
        'time.end_month': part('end', 'month', MONTHS),
        'time.end_day': part('end', 'day of the month', range(1, 31)),
      }),
    }
  },
  resolve(read, ctx, { period }) {
    if (period.kind === 'relative') {
      const unit = read.choice<RelativeUnit | 'none'>(
        'time.relative_unit',
        'the relative unit',
        'none'
      )
      const count = Number(read.choice('time.relative_count', 'the relative count', '1'))
      return unit === 'none' ? undefined : getRelativeRange(ctx.now, unit, count)
    }
    if (period.kind === 'none') return undefined
    const part = (key: string, label: string) => {
      const value = read.choice(`time.${key}`, label, NOT_STATED)
      return value === NOT_STATED ? undefined : value
    }
    const dates = getPeriodRange(ctx.now, {
      startYear: part('start_year', 'the start year'),
      startMonth: part('start_month', 'the start month'),
      startDay: part('start_day', 'the start day'),
      endYear: part('end_year', 'the end year'),
      endMonth: part('end_month', 'the end month'),
      endDay: part('end_day', 'the end day'),
    })
    if (!dates) {
      ctx.todo.push(
        'The message gives a time period but no date part was read: set state.start and state.end (end exclusive).'
      )
    }
    return dates
  },
}
