import { Fragment } from 'react'
import type { DateTimeFormatOptions } from 'luxon'
import { DateTime } from 'luxon'

import { useI18nDate } from './i18nDate.utils'

type Dates = {
  date: string
  format?: DateTimeFormatOptions
}

const I18nDate = ({ date, format = DateTime.DATE_MED }: Dates) => {
  const dateFormatted = useI18nDate(date, format)
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
