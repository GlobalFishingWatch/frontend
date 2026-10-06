import { lazy, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components/choice'
import { InputText } from '@globalfishingwatch/ui-components/input-text'

import { PATH_BASENAME } from 'data/map/config'
import type { Place, PlaceCategory } from 'features/_places/places.loaders'
import { PLACE_TYPES } from 'features/_places/places.loaders'
import type { PlacesMapDataviews } from 'features/_places/places-map.config'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import { useAppSearch, useReplaceQueryParams } from 'router/routes.hook'
import { formatInfoField } from 'utils/info'
import { getHighlightedText } from 'utils/text'

import styles from './places.module.css'

const PlacesMap = lazy(() => import('features/_places/PlacesMap'))

const PLACES_MAP_BREAKPOINT = 1280

// PLATFORM TODO: per-place thumbnails
const THUMBNAIL_URL = `${PATH_BASENAME}/images/thumbnail-test@2x.webp`

type PlacesSearchProps = {
  category: PlaceCategory
  title: string
  /** Server-loaded list for the URL's query, type and — while filtering — bounds (`loadPlaces`). */
  initialPlaces: Place[]
  /** Used when there is no type selector. */
  placeholder?: string
  /** Renders a type selector; the first option is the default when the URL has no `placeType`. */
  typeOptions?: ChoiceOption<OceanAreaType>[]
  /** Static dataviews from the route; shows a map next to the list on wide screens. */
  mapDataviews?: PlacesMapDataviews
}

function PlacesSearch({
  category,
  title,
  initialPlaces,
  placeholder,
  typeOptions,
  mapDataviews,
}: PlacesSearchProps) {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const search = useAppSearch()
  const urlQuery = search.query ?? ''
  const type = search.placeType ?? typeOptions?.[0]?.id
  const [query, setQuery] = useState(urlQuery)
  const [debouncedQuery] = useDebounce(query.trim(), 300)
  useEffect(() => {
    if (debouncedQuery !== urlQuery) replaceQueryParams({ query: debouncedQuery || undefined })
  }, [debouncedQuery, urlQuery, replaceQueryParams])

  const typeLabel = typeOptions?.find((option) => option.id === type)?.label
  const isClientHydrated = useIsClientHydrated()
  const isSmallScreen = useSmallScreen(PLACES_MAP_BREAKPOINT)
  const showDeck = isClientHydrated && !isSmallScreen

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.header}>
          <InputText
            type="search"
            value={query}
            placeholder={
              typeof typeLabel === 'string'
                ? t((t) => t.places.searchType, { type: typeLabel })
                : placeholder
            }
            onChange={(e) => setQuery(e.target.value)}
            className={styles.search}
          />
          {typeOptions && (
            <Choice
              containerClassName={styles.typeChoice}
              options={typeOptions}
              activeOption={type}
              onSelect={(option: ChoiceOption<OceanAreaType>) =>
                replaceQueryParams({ placeType: option.id })
              }
            />
          )}
        </div>
        <ul className={styles.list}>
          {initialPlaces.map((place) => (
            <li key={`${place.type}-${place.id}`} className={styles.item}>
              <img
                className={styles.thumbnail}
                src={getThumbnailUrl(place)}
                alt=""
                loading="lazy"
              />
              <span className={styles.name}>
                {getHighlightedText(
                  place.type === 'port'
                    ? (formatInfoField(place.name, 'port') as string)
                    : place.name,
                  urlQuery,
                  styles
                )}
                {place.flag && (
                  <>
                    {' ('}
                    {getHighlightedText(
                      formatInfoField(place.flag, 'flag') as string,
                      urlQuery,
                      styles
                    )}
                    {')'}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {mapDataviews && (
        <div className={styles.mapColumn}>
          <div className={styles.mapSpacer} />
          <div className={styles.map}>
            {showDeck && (
              <Suspense fallback={null}>
                <PlacesMap dataviewsByType={mapDataviews} type={type ?? PLACE_TYPES[category][0]} />
              </Suspense>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlacesSearch
