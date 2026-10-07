import { lazy, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouterState } from '@tanstack/react-router'
import cx from 'classnames'
import { useSetAtom } from 'jotai'
import { useDebounce } from 'use-debounce'

import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Choice } from '@globalfishingwatch/ui-components/choice'
import { Icon } from '@globalfishingwatch/ui-components/icon'
import { InputText } from '@globalfishingwatch/ui-components/input-text'
import { AREA_REPORT_LAYERS } from '@platform/config/map/dataviews'
import { getPlaceThumbnailPath, PLACE_THUMBNAILS_BASE_URL } from '@platform/config/map/thumbnails'

import PlaceLink from 'features/_places/PlaceLink'
import { hoveredPlaceAtom } from 'features/_places/places.atoms'
import type { Place, PlacesResult } from 'features/_places/places.loaders'
import type { PlaceCategory } from 'features/_places/places.types'
import { PLACE_TYPES, PLACES_PAGE_SIZE } from 'features/_places/places.types'
import { getPlaceLabel } from 'features/_places/places.utils'
import type { PlacesMapDataviews } from 'features/_places/places-map.config'
import PlacesSortButton from 'features/_places/PlacesSortButton'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import { useAppSearch, useReplaceQueryParams } from 'router/routes.hook'
import { getHighlightedText } from 'utils/text'

import styles from './PlacesSearch.module.css'

const PlacesMap = lazy(() => import('features/_places/PlacesMap'))

const PLACES_MAP_BREAKPOINT = 1200
const PLACE_LABEL_TITLE_MIN_LENGTH = 50

const getThumbnailUrl = ({ type, id }: Place) =>
  `${PLACE_THUMBNAILS_BASE_URL}/${getPlaceThumbnailPath(
    type === 'port' ? 'ports' : AREA_REPORT_LAYERS[type].datasetId,
    id
  )}`

function PlaceThumbnail({ place, alt }: { place: Place; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className={cx(styles.thumbnail, styles.thumbnailFallback)}>
        <Icon icon={place.type === 'port' ? 'ports' : 'areas'} />
      </span>
    )
  }
  return (
    <img
      ref={(img) => {
        if (img?.complete && !img.naturalWidth) setFailed(true)
      }}
      className={styles.thumbnail}
      src={getThumbnailUrl(place)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

type PlacesSearchProps = {
  category: PlaceCategory
  title: string
  /** Server-loaded list and counts for the URL's query, type and — while filtering — bounds (`loadPlaces`). */
  result: PlacesResult
  /** Used when there is no type selector. */
  placeholder?: string
  /** Active type; defaults to the category's first one. */
  type?: OceanAreaType
  /** Renders a type selector, switched through `onTypeSelect`. */
  typeOptions?: ChoiceOption<OceanAreaType>[]
  onTypeSelect?: (type: OceanAreaType) => void
  /** Static dataviews from the route; shows a map next to the list on wide screens. */
  mapDataviews?: PlacesMapDataviews
}

function PlacesSearch({
  category,
  title,
  result: { places, count, total },
  placeholder,
  type = PLACE_TYPES[category][0],
  typeOptions,
  onTypeSelect,
  mapDataviews,
}: PlacesSearchProps) {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const search = useAppSearch()
  const setHoveredPlace = useSetAtom(hoveredPlaceAtom)
  const urlQuery = search.query ?? ''
  const [query, setQuery] = useState(urlQuery)
  const [debouncedQuery] = useDebounce(query.trim(), 300)
  useEffect(() => {
    if (debouncedQuery !== urlQuery)
      replaceQueryParams({ query: debouncedQuery || undefined, placesLimit: undefined })
  }, [debouncedQuery, urlQuery, replaceQueryParams])

  const typeLabel = typeOptions?.find((option) => option.id === type)?.label
  const isLoadingMore = useRouterState({ select: (state) => state.status === 'pending' })
  const isClientHydrated = useIsClientHydrated()
  const isSmallScreen = useSmallScreen(PLACES_MAP_BREAKPOINT)
  const showDeck = isClientHydrated && !isSmallScreen

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.count}>
            {count < total
              ? `${formatI18nNumber(count)} / ${formatI18nNumber(total)}`
              : formatI18nNumber(total)}
          </span>
          <InputText
            type="search"
            value={query}
            placeholder={
              typeof typeLabel === 'string'
                ? t((t) => t.places.searchType, { type: typeLabel })
                : placeholder
            }
            onChange={(e) => setQuery(e.target.value)}
            onCleanButtonClick={() => setQuery('')}
            className={styles.search}
          />
          {typeOptions && (
            <Choice
              containerClassName={styles.typeChoice}
              options={typeOptions}
              activeOption={type}
              onSelect={(option: ChoiceOption<OceanAreaType>) => onTypeSelect?.(option.id)}
            />
          )}
          <PlacesSortButton category={category} />
        </div>
        {places.length === 0 && (
          <div className={styles.empty}>
            <p>
              {urlQuery
                ? t((t) => t.places.noResultsQuery, { query: urlQuery })
                : t((t) => t.places.noResultsInView)}
            </p>
            {urlQuery && (
              <Button type="secondary" onClick={() => setQuery('')}>
                {t((t) => t.places.clearSearch)}
              </Button>
            )}
          </div>
        )}
        <ul className={styles.list}>
          {places.map((place) => {
            const label = getPlaceLabel(place)
            return (
              <li
                key={`${place.type}-${place.id}`}
                onMouseEnter={() => setHoveredPlace(place)}
                onMouseLeave={() => setHoveredPlace(undefined)}
              >
                <PlaceLink place={place} className={styles.item}>
                  <PlaceThumbnail place={place} alt={label} />
                  <span
                    className={styles.name}
                    title={label.length > PLACE_LABEL_TITLE_MIN_LENGTH ? label : undefined}
                  >
                    {getHighlightedText(label, urlQuery, styles)}
                  </span>
                </PlaceLink>
              </li>
            )
          })}
        </ul>
        {places.length < count && (
          <Button
            type="secondary"
            className={styles.loadMore}
            loading={isLoadingMore}
            onClick={() => replaceQueryParams({ placesLimit: places.length + PLACES_PAGE_SIZE })}
          >
            {t((t) => t.places.loadMore)}
          </Button>
        )}
      </div>
      {mapDataviews && (
        <div className={styles.mapColumn}>
          <div className={styles.map}>
            {showDeck && (
              <Suspense fallback={null}>
                <PlacesMap dataviewsByType={mapDataviews} type={type} />
              </Suspense>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlacesSearch
