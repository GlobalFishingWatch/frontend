import { useTranslation } from 'react-i18next'
import { getRouteApi } from '@tanstack/react-router'

import PlacesSearch from 'features/_places/PlacesSearch'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'

const route = getRouteApi('/_platform/_content/ports')

function Ports() {
  const { t } = useTranslation()
  const result = route.useLoaderData()
  return (
    <PlacesSearch
      category="ports"
      title={t((t) => t.nav.ports)}
      result={result}
      mapDataviews={route.useMatch({ select: (match) => match.staticData.placesMapDataviews })}
      placeholder={t((t) => t.places.searchPorts, { total: formatI18nNumber(result.total) })}
    />
  )
}

export default Ports
