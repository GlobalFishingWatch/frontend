import { Fragment } from 'react'
import type { DateTimeFormatOptions, Zone } from 'luxon'
import { DateTime } from 'luxon'

import { useI18nDate } from './i18nDate.utils'

type Dates = {
  date: string | number
  format?: DateTimeFormatOptions
  showUTCLabel?: boolean
  timeZone?: string | Zone
}

const I18nDate = ({ date, format = DateTime.DATE_MED, showUTCLabel, timeZone }: Dates) => {
  const dateFormatted = useI18nDate(date, format, showUTCLabel, timeZone)
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
