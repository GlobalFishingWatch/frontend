import { Fragment } from 'react'

import type { I18Number } from './i18nNumber.utils'
import { useI18nNumber } from './i18nNumber.utils'

const I18nNumber = ({ number }: { number: I18Number }) => {
  const numberFormatted = useI18nNumber(number)
  return <Fragment>{numberFormatted}</Fragment>
}

export default I18nNumber
