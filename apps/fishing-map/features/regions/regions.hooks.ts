import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { Regions } from '@globalfishingwatch/api-types'

import { selectRegionsDatasets } from 'features/regions/regions.selectors'
import { selectEEZs, selectFAOs, selectMPAs, selectRFMOs } from 'features/regions/regions.slice'

export function useRegionTranslationsById() {
  const { t } = useTranslation()
  const regionsDatasets = useSelector(selectRegionsDatasets)

  const getRegionTranslationsById = useCallback(
    (id: Regions) => {
      if (!id) return ''
      let translation = ''
      for (const key of Object.values(regionsDatasets)) {
        const schemaTranslation: string = t(`datasets:${key}.schema.ID.enum.${id}` as any, '')
        if (schemaTranslation) {
          translation = schemaTranslation
          break
        }
      }
      return translation
    },
    [regionsDatasets, t]
  )

  return useMemo(() => ({ getRegionTranslationsById }), [getRegionTranslationsById])
}

const EMPTY_ARRAY: [] = []

export function useRegionNamesByType() {
  const { t } = useTranslation()
  const eezs = useSelector(selectEEZs)
  const rfmos = useSelector(selectRFMOs)
  const mpas = useSelector(selectMPAs)
  const faos = useSelector(selectFAOs)

  const getRegionNamesByType = useCallback(
    (regionType: keyof Regions, values: string[]) => {
      if (!values?.length) return EMPTY_ARRAY
      const regions =
        { eez: eezs, rfmo: rfmos, mpa: mpas, fao: faos, majorFao: [], highSeas: [] }[regionType] ||
        []
      let labels = values
      if (regions?.length) {
        labels = values.flatMap(
          (id) =>
            regions
              .find((region) => region.id?.toString() === id)
              ?.label?.replace('Exclusive Economic Zone', t('layer.areas.eez', 'EEZ')) || []
        )
      }
      return labels
    },
    [eezs, faos, mpas, rfmos, t]
  )

  return useMemo(() => ({ getRegionNamesByType }), [getRegionNamesByType])
}
