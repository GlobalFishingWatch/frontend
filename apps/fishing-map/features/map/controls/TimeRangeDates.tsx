import { Fragment } from 'react'
import type { DateTimeFormatOptions } from 'luxon'
import { DateTime } from 'luxon'

import I18nDate from 'features/i18n/i18nDate'

export const pickDateFormatByRange = (start: string, end: string): DateTimeFormatOptions => {
  const A_DAY = 1000 * 60 * 60 * 24
  const timeΔ = start && end ? new Date(end).getTime() - new Date(start).getTime() : 0
  return timeΔ <= A_DAY ? DateTime.DATETIME_MED : DateTime.DATE_MED
}

export default function TimeRangeDates({
  start,
  end,
  format = pickDateFormatByRange(start, end),
}: {
  start: string
  end: string
  format?: DateTimeFormatOptions
}) {
  return (
    <Fragment>
      <I18nDate date={start} format={format} /> - <I18nDate date={end} format={format} />
    </Fragment>
  )
}
