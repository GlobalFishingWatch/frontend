import { t } from 'i18next'

import { EMPTY_FIELD_PLACEHOLDER, getVesselGearTypeLabel } from 'utils/info'
import { sortStrings } from 'utils/shared'

type CleanVesselOrGearTypeParams = { value: string; property: 'geartype' | 'vesselType' }
export function cleanVesselOrGearType({ value, property }: CleanVesselOrGearTypeParams) {
  const valuesClean = value ? value?.split(',').filter(Boolean) : [EMPTY_FIELD_PLACEHOLDER]
  const valuesCleanTranslated = valuesClean
    .map((value) => {
      if (property === 'geartype') {
        return getVesselGearTypeLabel({ geartypes: value })
      }
      return t(`vessel.vesselTypes.${value?.toLowerCase()}` as any, value)
    })
    .sort(sortStrings)
  return valuesCleanTranslated.length > 1
    ? valuesCleanTranslated.join('|')
    : valuesCleanTranslated[0]
}

export function cleanFlagState(flagState: string) {
  return flagState.replace(/,/g, '')
}
