import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'features/app/app.hooks'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { VesselAPISource } from 'types'

export const useVesselsConnect = () => {
  const { t } = useTranslation()
  const formatSource = useCallback(
    (source?: VesselAPISource) =>
      source
        ? source === VesselAPISource.GFW
          ? t('common.AIS', 'AIS')
          : t('common.other', 'Other')
        : DEFAULT_EMPTY_VALUE,
    [t]
  )
  return {
    formatSource,
  }
}
