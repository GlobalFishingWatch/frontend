import { useTranslation } from 'react-i18next'
import { getRouteApi } from '@tanstack/react-router'

import { PORTS_MAP_DATAVIEWS } from 'features/_places/places-map.config'
import PlacesPage from 'features/_places/PlacesPage'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'

const route = getRouteApi('/_platform/_content/ports')

function Ports() {
  const { t } = useTranslation()
  const result = route.useLoaderData()
  return (
    <PlacesPage
      category="ports"
      title={t((t) => t.nav.ports)}
      result={result}
      mapDataviews={PORTS_MAP_DATAVIEWS}
      placeholder={t((t) => t.places.searchPorts, { total: formatI18nNumber(result.total) })}
    />
  )
}

export default Ports
