import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

const useI18nFlag = (iso: string) => {
  const { t } = useTranslation('flags')
  return t(iso as any) as string
}

const I18nFlag = ({ iso }: { iso: string }) => {
  const flagTranslated = useI18nFlag(iso) || ''
  return <Fragment>{flagTranslated}</Fragment>
}

export default I18nFlag
