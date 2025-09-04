import { DEFAULT_ID_PROPERTY } from '../../utils'

import type {
  ContextFeature,
  ContextLayerConfigFilter,
  ContextPickingObject,
  ContextSubLayerConfig,
} from './context.types'
import { ContextLayerId } from './context.types'

export const getContextId = (feature: ContextFeature, idProperty = DEFAULT_ID_PROPERTY): string => {
  if (!feature) return ''
  return feature.properties?.[idProperty] || feature.properties?.gfw_id || feature.properties.id
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
export function supportDataFilterExtension(sublayer: ContextSubLayerConfig) {
  if (getValidSublayerFilters(sublayer).length > 4) {
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
      const id = feature.properties?.WDPA_PID || feature.id
      return `https://www.protectedplanet.net/${id}`
    }
    case ContextLayerId.MPAtlas: {
      const id = feature.properties.id
      return id ? `https://mpatlas.org/zones/${id}` : ''
    }
    case ContextLayerId.TunaRfmo: {
      return RFMO_LINKS[feature.id]
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
      return `https://www.fao.org/fishery/en/area/${id}/en`
    }
    default:
      return undefined
  }
}
