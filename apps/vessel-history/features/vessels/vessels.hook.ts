import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { VesselAPISource } from 'types'
import { VesselFieldLabel } from 'types/vessel'

export const useVesselsConnect = (field?: VesselFieldLabel) => {
  const { t } = useTranslation()
  /*if (field === 'name') {
    console.log(field && [VesselFieldLabel.geartype, VesselFieldLabel.type].includes(field))
  }*/
  const gfwSourceLabel =
    field && [VesselFieldLabel.geartype, VesselFieldLabel.type].includes(field)
      ? t('common.GFW', 'GFW')
      : t('common.AIS', 'AIS')
  const formatSource = useCallback(
    (source?: VesselAPISource) => {
      if (field === 'name') {
        console.log(source)
        console.log(field && [VesselFieldLabel.geartype, VesselFieldLabel.type].includes(field))
      }
      return (source
        ? source === VesselAPISource.GFW
          ? gfwSourceLabel
          : t('common.other', 'Other')
        : DEFAULT_EMPTY_VALUE)
    },
    [gfwSourceLabel, t]
  )
  return {
    formatSource,
  }
}
