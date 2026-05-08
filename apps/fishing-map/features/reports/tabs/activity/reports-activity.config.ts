import type { TFunction } from 'i18next'

import type { AnyReportSubCategory } from 'features/reports/reports.types'

export const MAX_DAYS_TO_COMPARE = 100
export const MAX_MONTHS_TO_COMPARE = 12

export function getReportSubCategoryLabel(
  id: AnyReportSubCategory,
  t: TFunction
): string {
  switch (id) {
    case 'fishing':
      return t((t) => t.common.apparentFishing)
    case 'presence':
      return t((t) => t.common.vesselPresence)
    case 'viirs':
      return t((t) => t.common.viirs)
    case 'sar':
      return t((t) => t.common.sar)
    case 'sentinel-2':
      return t((t) => t.common.sentinel2)
    default:
      return id
  }
}
