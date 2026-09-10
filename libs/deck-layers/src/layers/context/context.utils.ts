import type { PickingInfo, Viewport } from '@deck.gl/core'
import type { _Tile2DHeader as Tile2DHeader, GeoBoundingBox } from '@deck.gl/geo-layers'
import type { Feature, MultiPolygon, Polygon } from 'geojson'

import type { PolygonGeomCoords } from '@globalfishingwatch/data-transforms'
import { getPolygonsUnion, unwrapFeatureLongitudes } from '@globalfishingwatch/data-transforms'

import { DEFAULT_ID_PROPERTY } from '#config/layers.config'
import { transformTileCoordsToWGS84 } from '#layers/_shared/tiles.utils'
import type { FilterExtensionProps } from '#layers/user/user.types'
import { getFilterExtensionSize } from '#layers/user/user.utils'

import type {
  ContextFeature,
  ContextLayerConfigFilter,
  ContextPickingObject,
  ContextSubLayerConfig,
} from './context.types'
import { ContextLayerId } from './context.types'

export const getContextId = (feature: ContextFeature, idProperty = DEFAULT_ID_PROPERTY): string => {
  if (!feature) return ''
  return (
    feature.properties?.[idProperty] ||
    feature.properties?.gfw_id ||
    feature.properties.id ||
    // Precomputed tilesets aggregate the polygons too small to survive simplification into one
    // feature, which by construction has no source id. Without this they all share a falsy key
    // and mergePickedFeatures collapses every one of them into a single feature.
    feature.properties.featureId
  )
}

export const getContextFiltersHash = (filters: ContextSubLayerConfig['filters']) => {
  return Object.values(filters || {})
    .flatMap((value) => value || [])
    .join('-')
}

export const getContextFilterOperatorsHash = (
  filterOperators: ContextSubLayerConfig['filterOperators']
) => {
  return Object.entries(filterOperators || {})
    .map(([key, operator]) => `${key}:${operator}`)
    .join('-')
}

export function getValidSublayerFilters(sublayer: ContextSubLayerConfig) {
  const filters: ContextLayerConfigFilter = {}
  Object.entries(sublayer.filters || {}).forEach(([key, value]) => {
    if (key !== undefined && key !== '' && value !== undefined) {
      filters[key] = value
    }
  })
  return filters
}

export function hasSublayerFilters(sublayer: ContextSubLayerConfig) {
  return sublayer?.filters ? Object.keys(getValidSublayerFilters(sublayer)).length > 0 : false
}

// https://deck.gl/docs/api-reference/extensions/data-filter-extension#filtercategories
// The maximum number of supported is determined by the categorySize:
// If categorySize is 1: 128 categories
// If categorySize is 2: 64 categories per dimension
// If categorySize is 3 or 4: 32 categories per dimension
export function supportDataFilterExtension(
  sublayer: ContextSubLayerConfig,
  timeFilterExtensionProps?: FilterExtensionProps
) {
  const timeFilterSize = timeFilterExtensionProps
    ? getFilterExtensionSize(timeFilterExtensionProps)
    : 0
  const sublayerFilterSize = hasSublayerFilters(sublayer) ? 1 : 0
  return sublayerFilterSize + timeFilterSize <= 4
}

const RFMO_LINKS: Record<string, string> = {
  'CCSBT Primary Area': 'https://www.ccsbt.org/',
  AIDCP: 'https://www.iattc.org/en-US/AIDCP/About-AIDCP',
  CCAMLR: 'https://www.ccamlr.org/',
  CCBSP: 'https://www.fao.org/fishery/en/organization/rfb/ccbsp',
  CCSBT: 'https://www.ccsbt.org/',
  CPPS: 'http://www.cpps-int.org/',
  FFA: 'https://www.ffa.int/',
  GFCM: 'https://www.fao.org/gfcm/en/',
  IATTC: 'https://www.iattc.org/',
  ICCAT: 'https://www.iccat.int/en/',
  ICES: 'https://www.ices.dk/',
  IOTC: 'https://www.iotc.org/',
  NAFO: 'https://www.nafo.int/',
  NAMMCO: 'https://nammco.no/',
  NASCO: 'https://www.nasco.int/',
  NEAFC: 'https://www.neafc.org/',
  NPAFC: 'https://npafc.org/',
  NPFC: 'https://www.npfc.int/',
  PICES: 'https://meetings.pices.int/',
  SEAFDEC: 'https://www.seafdec.org/',
  SEAFO: 'https://www.seafo.org/',
  SIOFA: 'https://www.apsoi.org/',
  SPC: 'https://www.spc.int/',
  SPRFMO: 'https://www.sprfmo.int/',
  WCPFC: 'https://www.wcpfc.int/',
}

export const getContextLink = (feature: ContextPickingObject) => {
  if (!feature?.layerId) {
    return ''
  }
  switch (feature.layerId) {
    case ContextLayerId.MPA:
    case ContextLayerId.MPANoTake:
    case ContextLayerId.MPARestricted: {
      const id = feature.properties?.SITE_PID || feature.properties?.WDPA_PID || feature.id
      return `https://www.protectedplanet.net/${id}`
    }
    case ContextLayerId.MPAtlas: {
      const id = feature.properties.id
      return id ? `https://mpatlas.org/zones/${id}` : ''
    }
    case ContextLayerId.TunaRfmo: {
      const id = feature.properties.ID || feature.id
      return RFMO_LINKS[id]
    }
    case ContextLayerId.EEZ: {
      const id = feature.properties?.MRGID_EEZ || feature.id
      return `https://www.marineregions.org/eezdetails.php?mrgid=${id}`
    }
    case ContextLayerId.ProtectedSeas: {
      const id = feature.properties?.id || feature.id
      return `https://map.navigatormap.org/site-detail?site_id=${id}`
    }
    case ContextLayerId.FAO: {
      const id = feature.properties?.F_CODE || feature.id
      return `https://www.fao.org/fishery/en/area/${id}`
    }
    default:
      return undefined
  }
}

/**
 * Reads the features of every tile the TileLayer selected for the current viewport, in WGS84.
 *
 * Deliberately not `deck.pickObjects`: GPU picking only sees a feature that rasterizes over a
 * pixel center, so any polygon smaller than a screen pixel is invisible to it. At zoom 4 a pixel
 * is ~10km, which silently dropped 6 of 11 features of a small-polygons dataset.
 */
export function getSelectedTilesFeatures<T extends Feature>(
  tileLayer: unknown,
  viewport: Viewport,
  { wgs84 = false } = {} as { wgs84?: boolean }
): T[] {
  const tiles = (tileLayer as { state?: { tileset?: { selectedTiles?: Tile2DHeader[] } } })?.state
    ?.tileset?.selectedTiles
  if (!tiles?.length) return []
  return tiles.flatMap((tile) => {
    // GFWMVTLoader emits a feature array in local tile coords, PMTilesSource a
    // geojson-table (`{features}`) already in wgs84
    const content = tile.content as T[] | { features?: T[] } | undefined
    const features = Array.isArray(content) ? content : (content?.features ?? [])
    if (!features.length) {
      return []
    }
    if (wgs84) {
      return features.filter(Boolean).map(unwrapFeatureLongitudes)
    }
    return features.flatMap((feature) =>
      feature
        ? unwrapFeatureLongitudes(
            transformTileCoordsToWGS84(feature, tile.bbox as GeoBoundingBox, viewport)
          )
        : []
    )
  })
}

export function mergePickedFeatures<T extends Feature>(
  { pickedFeatures, idProperty = DEFAULT_ID_PROPERTY, layers } = {} as {
    pickedFeatures: PickingInfo[]
    idProperty: string
    layers: { id: string }[]
  }
): T[] {
  const featureGroups = new Map<string, T[]>()

  for (const f of pickedFeatures) {
    if (!f.object) continue
    const layerId = layers.find((l) => f.layer?.id.startsWith(l.id))?.id
    const obj = layerId
      ? {
          ...(f.object as T),
          properties: { ...((f.object as T).properties || {}), layerId },
        }
      : (f.object as T)
    const featureId = getContextId(f.object as ContextFeature, idProperty)
    // Include layerId in cache key so features from different layers aren't deduplicated against each other
    const cacheKey = layerId !== undefined ? `${layerId}:${featureId}` : featureId

    if (!featureGroups.has(cacheKey)) featureGroups.set(cacheKey, [])
    featureGroups.get(cacheKey)!.push(obj)
  }

  const merged: T[] = []
  for (const group of featureGroups.values()) {
    if (group.length === 1) {
      merged.push(group[0])
      continue
    }
    const first = group[0]
    const geometryType = first.geometry?.type
    if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
      const geoms = group.map(
        (g) => (g.geometry as Polygon | MultiPolygon).coordinates as PolygonGeomCoords
      )
      merged.push({
        ...first,
        geometry: {
          type: 'MultiPolygon',
          coordinates: getPolygonsUnion(geoms),
        } as MultiPolygon,
      })
    } else {
      merged.push(first)
    }
  }
  return merged
}
