import { lazy, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

import type { OceanAreaBBox, OceanAreaLocale, OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components/choice'
import { InputText } from '@globalfishingwatch/ui-components/input-text'

import { PATH_BASENAME } from 'data/map/config'
import type { Place, PlaceCategory } from 'features/_places/places.loaders'
import { PLACE_TYPES, searchPlaces } from 'features/_places/places.loaders'
import type { PlacesMapDataviews } from 'features/_places/places-map.config'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
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
  /** Server-loaded list for an empty query and the first type option. */
  initialPlaces: Place[]
  /** Used when there is no type selector. */
  placeholder?: string
  /** Renders a type selector. The first option must be the type `initialPlaces` was loaded with. */
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
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query.trim(), 300)
  const [type, setType] = useState(typeOptions?.[0]?.id)
  const [results, setResults] = useState<Place[]>([])
  const [filterByMap, setFilterByMap] = useState(false)
  const [mapBounds, setMapBounds] = useState<OceanAreaBBox>()
  const [debouncedMapBounds] = useDebounce(mapBounds, 300)
  const bounds = filterByMap ? debouncedMapBounds : undefined
  const showInitialPlaces = !debouncedQuery && !bounds && type === typeOptions?.[0]?.id

  useEffect(() => {
    if (showInitialPlaces) return
    let cancelled = false
    searchPlaces({
      data: {
        category,
        type,
        query: debouncedQuery,
        locale: i18n.language as OceanAreaLocale,
        bounds,
      },
    }).then((places) => {
      if (!cancelled) setResults(places)
    })
    return () => {
      cancelled = true
    }
  }, [category, type, debouncedQuery, i18n.language, showInitialPlaces, bounds])

  const places = showInitialPlaces ? initialPlaces : results
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
              onSelect={(option: ChoiceOption<OceanAreaType>) => setType(option.id)}
            />
          )}
        </div>
        <ul className={styles.list}>
          {places.map((place) => (
            <li key={`${place.type}-${place.id}`} className={styles.item}>
              <img className={styles.thumbnail} src={THUMBNAIL_URL} alt="" loading="lazy" />
              <span className={styles.name}>
                {getHighlightedText(
                  place.type === 'port'
                    ? (formatInfoField(place.name, 'port') as string)
                    : place.name,
                  debouncedQuery,
                  styles
                )}
                {place.flag && (
                  <>
                    {' ('}
                    {getHighlightedText(
                      formatInfoField(place.flag, 'flag') as string,
                      debouncedQuery,
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
                <PlacesMap
                  dataviewsByType={mapDataviews}
                  type={type ?? PLACE_TYPES[category][0]}
                  filterByMap={filterByMap}
                  onFilterByMapChange={setFilterByMap}
                  onBoundsChange={setMapBounds}
                />
              </Suspense>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlacesSearch
