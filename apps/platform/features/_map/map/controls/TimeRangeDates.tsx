import { Fragment } from 'react'
import type { DateTimeFormatOptions } from 'luxon'

import I18nDate from 'features/i18n/i18nDate'
import { pickDateFormatByRange } from 'utils/dates'

export default function TimeRangeDates({
  start,
  end,
  format = pickDateFormatByRange(start, end),
  showUTCLabel,
}: {
  start: string
  end: string
  format?: DateTimeFormatOptions
  showUTCLabel?: boolean
}) {
  return (
    <Fragment>
      <I18nDate date={start} format={format} showUTCLabel={showUTCLabel} /> -{' '}
      <I18nDate date={end} format={format} showUTCLabel={showUTCLabel} />
    </Fragment>
  )
}
