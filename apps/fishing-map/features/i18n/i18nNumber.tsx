import { Fragment } from 'react'

import { useI18nNumber } from './i18nNumber.utils'

type I18Number = string | number

const I18nNumber = ({ number }: { number: I18Number }) => {
  const numberFormatted = useI18nNumber(number)
  return <Fragment>{numberFormatted}</Fragment>
}

export default I18nNumber
