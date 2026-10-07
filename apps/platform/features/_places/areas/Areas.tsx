import { useTranslation } from 'react-i18next'
import { getRouteApi } from '@tanstack/react-router'

import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'

import { PLACE_TYPES } from 'features/_places/places.loaders'
import PlacesSearch from 'features/_places/PlacesSearch'

const route = getRouteApi('/_platform/_places/areas')

function Areas() {
  const { t } = useTranslation()
  const typeLabels: Partial<Record<OceanAreaType, string>> = {
    eez: t((t) => t.places.types.eez),
    fao: t((t) => t.places.types.fao),
    mpa: t((t) => t.places.types.mpa),
    rfmo: t((t) => t.places.types.rfmo),
  }
  return (
    <PlacesSearch
      category="areas"
      title={t((t) => t.nav.areas)}
      result={route.useLoaderData()}
      mapDataviews={route.useMatch({ select: (match) => match.staticData.placesMapDataviews })}
      typeOptions={PLACE_TYPES.areas.map((id) => ({ id, label: typeLabels[id] ?? id }))}
    />
  )
}

export default Areas
