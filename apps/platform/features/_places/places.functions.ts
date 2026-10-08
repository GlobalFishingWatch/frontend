import { createServerFn } from '@tanstack/react-start'

import type { OceanAreaBBox, OceanAreaLocale, OceanAreaType } from '@globalfishingwatch/ocean-areas'

import type { Place, PlaceCategory, PlacesResult, PlacesSort } from 'features/_places/places.types'
import { DEFAULT_PLACES_SORT, PLACE_TYPES, PLACES_PAGE_SIZE } from 'features/_places/places.types'

export const searchPlaces = createServerFn({ method: 'GET' })
  .validator(
    (params: {
      category: PlaceCategory
      /** Narrows to one of the category's types; defaults to all of them. */
      type?: OceanAreaType
      query?: string
      locale?: OceanAreaLocale
      /** `[west, south, east, north]` of the map view; only places inside it. */
      bounds?: OceanAreaBBox
      sortBy?: PlacesSort
      /** How many matches to return; defaults to `PLACES_PAGE_SIZE` */
      limit?: number
    }) => {
      if (!Object.hasOwn(PLACE_TYPES, params.category)) {
        throw new Error(`Unknown place category: ${params.category}`)
      }
      if (params.type && !PLACE_TYPES[params.category].includes(params.type)) {
        throw new Error(`Type ${params.type} is not in category ${params.category}`)
      }
      if (
        params.bounds &&
        !(
          Array.isArray(params.bounds) &&
          params.bounds.length === 4 &&
          params.bounds.every((value) => Number.isFinite(value))
        )
      ) {
        throw new Error('bounds must be [west, south, east, north] numbers')
      }
      if (params.limit !== undefined && !(Number.isInteger(params.limit) && params.limit > 0)) {
        throw new Error('limit must be a positive integer')
      }
      return params
    }
  )
  .handler(
    async ({
      data: { category, type, query = '', locale, bounds, sortBy, limit = PLACES_PAGE_SIZE },
    }): Promise<PlacesResult> => {
      const { matchOceanAreas, countOceanAreas } = await import('@globalfishingwatch/ocean-areas')
      const { FLAG_LABELS } = await import('features/_places/flags.server')
      // English always matches, plus the user's language
      const flagLabelSets = [FLAG_LABELS.en, (locale && FLAG_LABELS[locale]) || {}]
      const types = type ? [type] : PLACE_TYPES[category]
      const areas = await matchOceanAreas(query, {
        types,
        locale,
        bounds,
        sortBy: sortBy ?? DEFAULT_PLACES_SORT[category],
        // Also the "Name (Country)" label the list shows (getPlaceLabel), so pasting it back matches
        getExtraSearchValues: ({ properties: { name, flag } }) => {
          if (!flag) return []
          const labels = [...new Set(flagLabelSets.map((set) => set[flag]).filter(Boolean))]
          return [flag, ...labels, ...labels.map((label) => `${name} (${label})`)]
        },
      })
      const isFiltered = Boolean(query || bounds)
      return {
        count: areas.length,
        total: isFiltered ? await countOceanAreas(types) : areas.length,
        // Geometries stay on the server — MPAs alone are ~4MB
        places: areas
          .slice(0, limit)
          .map(({ properties: { area, name, type, flag, areaSize }, geometry }) => ({
            id: area ?? name,
            name,
            type,
            flag,
            areaSize,
            ...(geometry.type === 'Point' && {
              coordinates: geometry.coordinates as [number, number],
            }),
          })),
      }
    }
  )

export const getPort = createServerFn({ method: 'GET' })
  .validator((params: { id: string; locale?: OceanAreaLocale }) => ({
    id: String(params.id),
    locale: params.locale,
  }))
  .handler(async ({ data: { id, locale } }): Promise<Place | null> => {
    const { getOceanAreaById } = await import('@globalfishingwatch/ocean-areas')
    const port = await getOceanAreaById('port', id, { locale })
    return port ? { id: port.area ?? id, name: port.name, type: 'port', flag: port.flag } : null
  })
