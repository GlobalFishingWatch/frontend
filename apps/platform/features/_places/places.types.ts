import type { BasemapType } from '@globalfishingwatch/deck-layers'
import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'

export type PlaceCategory = 'ports' | 'areas'

/** The first type of each category is the one its page loads by default. */
export const PLACE_TYPES: Record<PlaceCategory, readonly [OceanAreaType, ...OceanAreaType[]]> = {
  ports: ['port'],
  areas: ['eez', 'fao', 'mpa', 'rfmo'],
}

export const PLACES_PAGE_SIZE = 100

export const PLACE_SORTS = ['activity', 'area', 'name'] as const
export type PlacesSort = (typeof PLACE_SORTS)[number]

/** List order when the URL has no `placesSort` */
export const DEFAULT_PLACES_SORT: Record<PlaceCategory, PlacesSort> = {
  areas: 'area',
  ports: 'activity',
}

export type PlacesSearchState = {
  placesSort?: PlacesSort
  placesLimit?: number
  basemap?: BasemapType
  filterByMap?: boolean
  /**  Map view as `west,south,east,north` */
  bounds?: string
}
