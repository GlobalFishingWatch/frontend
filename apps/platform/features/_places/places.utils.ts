import type { useTranslation } from 'react-i18next'

import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'

import type { Place } from 'features/_places/places.loaders'
import { formatInfoField } from 'utils/info'

/** "Name (Country)" as the list and the map tooltip show it; port names get port casing. */
export const getPlaceLabel = ({ name, flag, type }: Pick<Place, 'name' | 'flag' | 'type'>) => {
  const label = type === 'port' ? (formatInfoField(name, 'port') as string) : name
  return flag ? `${label} (${formatInfoField(flag, 'flag')})` : label
}

type TFunc = ReturnType<typeof useTranslation>['t']

/** Label and blurb per area type, for the type selector and each `/areas/$placeType` head. */
export const getAreaTypeTexts = (
  t: TFunc
): Partial<Record<OceanAreaType, { label: string; description: string }>> => ({
  eez: {
    label: t((t) => t.places.types.eez),
    description: t((t) => t.places.siteDescription.eez),
  },
  fao: {
    label: t((t) => t.places.types.fao),
    description: t((t) => t.places.siteDescription.fao),
  },
  mpa: {
    label: t((t) => t.places.types.mpa),
    description: t((t) => t.places.siteDescription.mpa),
  },
  rfmo: {
    label: t((t) => t.places.types.rfmo),
    description: t((t) => t.places.siteDescription.rfmo),
  },
})
