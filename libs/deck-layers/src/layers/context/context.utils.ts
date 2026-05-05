import type { PickingInfo } from '@deck.gl/core'
import type { Feature, MultiPolygon, Polygon } from 'geojson'
import polygonClipping from 'polygon-clipping'

import { DEFAULT_ID_PROPERTY } from '../../utils'
import type { FilterExtensionProps } from '../user/user.types'
import { getFilterExtensionSize } from '../user/user.utils'

import type {
  ContextFeature,
  ContextLayerConfigFilter,
  ContextPickingObject,
  ContextSubLayerConfig,
} from './context.types'
import { ContextLayerId } from './context.types'

const { union } = polygonClipping

export const getContextId = (feature: ContextFeature, idProperty = DEFAULT_ID_PROPERTY): string => {
  if (!feature) return ''
  return feature.properties?.[idProperty] || feature.properties?.gfw_id || feature.properties.id
}

export const getContextFiltersHash = (filters: ContextSubLayerConfig['filters']) => {
  return Object.values(filters || {})
    .flatMap((value) => value || [])
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
  if (getValidSublayerFilters(sublayer).length + timeFilterSize > 4) {
    console.warn(
      'Filters for more than 4 categories are not supported by deck.gl, using CPU based filter as fallback'
    )
    return false
  }
  return true
}

export const getContextValue = (
  feature: ContextFeature,
  valueProperties = [] as string[]
): string => {
  if (!valueProperties || !valueProperties.length) {
    return feature.properties.value
  }
  return valueProperties.length === 1
    ? feature.properties?.[valueProperties[0]]
    : valueProperties
        .flatMap((prop) =>
          feature.properties?.[prop] ? `${prop}: ${feature.properties?.[prop]}` : []
        )
        .join('<br/>')
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
        (g) => (g.geometry as Polygon | MultiPolygon).coordinates as polygonClipping.Geom
      )
      merged.push({
        ...first,
        geometry: {
          type: 'MultiPolygon',
          coordinates: union(geoms[0], ...geoms.slice(1)),
        } as MultiPolygon,
      })
    } else {
      merged.push(first)
    }
  }
  return merged
}
