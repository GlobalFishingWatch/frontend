import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

const useI18nFlag = (iso: string) => {
  const { t } = useTranslation('flags')
  return t(iso as any)
}

const I18nFlag = ({ iso }: { iso: string }) => {
  const flagTranslated = useI18nFlag(iso) || EMPTY_FIELD_PLACEHOLDER
  return <Fragment>{flagTranslated}</Fragment>
}

export default I18nFlag
