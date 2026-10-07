import type { BasemapType } from '@globalfishingwatch/deck-layers'
import type { OceanAreaBBox, OceanAreaType } from '@globalfishingwatch/ocean-areas'

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

export const parsePlacesBounds = (bounds?: string): OceanAreaBBox | undefined => {
  const values = bounds?.split(',').map(Number)
  return values?.length === 4 && values.every(Number.isFinite)
    ? (values as OceanAreaBBox)
    : undefined
}

export const formatPlacesBounds = (bounds: OceanAreaBBox) =>
  bounds.map((value) => Number(value.toFixed(4))).join(',')
