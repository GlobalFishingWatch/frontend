import type { TFunction } from 'i18next'

import { t } from 'features/i18n/i18n'
import type { AnyReportSubCategory } from 'features/reports/reports.types'

export function getReportSubCategoryLabel(
  id: AnyReportSubCategory,
  tFunc = t as TFunction
): string {
  switch (id) {
    case 'fishing':
      return tFunc((t) => t.common.apparentFishing)
    case 'presence':
      return tFunc((t) => t.common.vesselPresence)
    case 'viirs':
      return tFunc((t) => t.common.viirs)
    case 'sar':
      return tFunc((t) => t.common.sar)
    case 'sentinel-2':
      return tFunc((t) => t.common.sentinel2)
    default:
      return id
  }
}
