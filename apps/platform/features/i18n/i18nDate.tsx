import { Fragment } from 'react'
import type { DateTimeFormatOptions } from 'luxon'
import { DateTime } from 'luxon'

import { useI18nDate } from './i18nDate.utils'

type Dates = {
  date: string | number
  format?: DateTimeFormatOptions
  showUTCLabel?: boolean
}

const I18nDate = ({ date, format = DateTime.DATE_MED, showUTCLabel }: Dates) => {
  const dateFormatted = useI18nDate(date, format, showUTCLabel)
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
