import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectBasemapLabelsDataviewInstance } from 'features/map/dataviews/selectors/dataviews.selectors'
import { useDataviewInstancesConnect } from 'features/map/workspace/workspace.hook'
import { Locale } from 'types'

const DEFAULT_LABELS_LOCALE = Locale.en

function BasemapLabelsLocaleSync() {
  const { i18n } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const basemapDataviewInstance = useSelector(selectBasemapLabelsDataviewInstance)

  const id = basemapDataviewInstance?.id
  const instanceLocale = basemapDataviewInstance?.config?.locale ?? DEFAULT_LABELS_LOCALE
  const locale = i18n.language === 'source' ? Locale.en : (i18n.language as Locale)

  useEffect(() => {
    if (!id || instanceLocale === locale) {
      return
    }
    upsertDataviewInstance({ id: id as string, config: { locale } })
  }, [id, instanceLocale, locale, upsertDataviewInstance])

  return null
}

export default BasemapLabelsLocaleSync
