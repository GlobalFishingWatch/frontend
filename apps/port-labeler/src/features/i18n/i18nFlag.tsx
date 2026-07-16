import { Fragment } from 'react'

import { useI18nFlag } from './i18nFlag.utils'

const I18nFlag = ({ iso }: { iso: string }) => {
  const flagTranslated = useI18nFlag(iso)
  return <Fragment>{flagTranslated}</Fragment>
}

export default I18nFlag
