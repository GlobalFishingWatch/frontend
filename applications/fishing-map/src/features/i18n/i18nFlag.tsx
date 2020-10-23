import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

export const useI18nFlag = (iso: string) => {
  const { t } = useTranslation()
  return t(`flags:${iso}`)
}

const I18nFlag = ({ iso }: { iso: string }) => {
  const flagTranslated = useI18nFlag(iso)
  return <Fragment>{flagTranslated}</Fragment>
}

export default I18nFlag
