import { useTranslation } from 'react-i18next'
import { getRouteApi, Link } from '@tanstack/react-router'

import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { ROUTE_PATHS } from '@platform/config/routes'

import { PLACE_TYPES } from 'features/_places/places.types'
import { getAreaTypeTexts } from 'features/_places/places.utils'
import { AREAS_MAP_DATAVIEWS } from 'features/_places/places-map.config'
import PlacesSearch from 'features/_places/PlacesSearch'

const route = getRouteApi('/_platform/_content/areas/$placeType')

function Areas() {
  const { t } = useTranslation()
  const navigate = route.useNavigate()
  const type = route.useParams({ select: (params) => params.placeType as OceanAreaType })
  const texts = getAreaTypeTexts(t)
  return (
    <PlacesSearch
      category="areas"
      title={t((t) => t.nav.areas)}
      result={route.useLoaderData()}
      mapDataviews={AREAS_MAP_DATAVIEWS}
      type={type}
      typeOptions={PLACE_TYPES.areas.map((id) => ({
        id,
        label: texts[id]?.label ?? id,
        link: (
          <Link
            to={ROUTE_PATHS.AREAS_TYPE}
            params={{ placeType: id }}
            search={(prev) => ({ ...prev, placesLimit: undefined })}
          />
        ),
      }))}
      onTypeSelect={(placeType) =>
        navigate({
          to: ROUTE_PATHS.AREAS_TYPE,
          params: { placeType },
          search: (prev) => ({ ...prev, placesLimit: undefined }),
        })
      }
    />
  )
}

export default Areas
