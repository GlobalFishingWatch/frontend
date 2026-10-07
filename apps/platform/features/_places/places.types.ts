import type { BasemapType } from '@globalfishingwatch/deck-layers'
import type { OceanAreaBBox, OceanAreaType } from '@globalfishingwatch/ocean-areas'

export type PlacesSort = 'name' | 'area' | 'activity'

export type PlacesSearchState = {
  placesSort?: PlacesSort
  placeType?: OceanAreaType
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
