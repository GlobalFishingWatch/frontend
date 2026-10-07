import { useTranslation } from 'react-i18next'
import { getRouteApi } from '@tanstack/react-router'

import PlacesSearch from 'features/_places/PlacesSearch'

const route = getRouteApi('/_platform/_content/ports')

function Ports() {
  const { t } = useTranslation()
  return (
    <PlacesSearch
      category="ports"
      title={t((t) => t.nav.ports)}
      result={route.useLoaderData()}
      mapDataviews={route.useMatch({ select: (match) => match.staticData.placesMapDataviews })}
      placeholder={t((t) => t.places.searchPorts)}
    />
  )
}

export default Ports
