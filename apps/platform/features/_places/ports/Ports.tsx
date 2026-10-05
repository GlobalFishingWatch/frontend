import { useTranslation } from 'react-i18next'
import { getRouteApi } from '@tanstack/react-router'

import PlacesSearch from 'features/_places/PlacesSearch'

const route = getRouteApi('/_platform/_places/ports')

function Ports() {
  const { t } = useTranslation()
  return (
    <PlacesSearch
      category="ports"
      initialPlaces={route.useLoaderData()}
      placeholder={t((t) => t.places.searchPorts)}
    />
  )
}

export default Ports
