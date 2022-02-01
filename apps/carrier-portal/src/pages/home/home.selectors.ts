import { createSelector } from 'reselect'
import { getRfmos, getEezs } from 'redux-modules/router/route.selectors'
import { getRfmosConfig, getEezsConfig } from 'redux-modules/app/app.selectors'
import { MapModuleBounds } from 'types/app.types'
import { PortalConfigRfmos, PortalConfigEezs } from 'types/api/models'

function getFilterBounds(filter: string[], filterConfig: PortalConfigRfmos[] | PortalConfigEezs[]) {
  return filter.reduce<MapModuleBounds | null>((acc, filter) => {
    const filterData = (filterConfig as any).find((f: any) => f.id === filter)
    if (filterData && filterData.bounds) {
      const [minLng, minLat, maxLng, maxLat] = filterData.bounds
      if (!acc) {
        return { minLng, minLat, maxLng, maxLat }
      }

      if (minLng < acc.minLng) acc.minLng = minLng
      if (minLat < acc.minLat) acc.minLat = minLat
      if (maxLng > acc.maxLng) acc.maxLng = maxLng
      if (maxLat > acc.maxLat) acc.maxLat = maxLat
    }
    return acc
  }, null)
}

export const getRfmoBounds = createSelector(
  [getRfmos, getRfmosConfig],
  (rfmos: string[], rfmosConfig) => {
    if (!rfmos || !rfmosConfig) return null
    return getFilterBounds(rfmos, rfmosConfig)
  }
)

export const getEezBounds = createSelector(
  [getEezs, getEezsConfig],
  (eezs: string[], eezsConfig) => {
    if (!eezs || !eezsConfig) return null
    return getFilterBounds(eezs, eezsConfig)
  }
)

export const getFiltersBounds = createSelector(
  [getRfmoBounds, getEezBounds],
  (rfmoBounds, eezBounds) => {
    if (!rfmoBounds) {
      return eezBounds
    }
    if (!eezBounds) {
      return rfmoBounds
    }
    return {
      minLng: Math.min(rfmoBounds?.minLng, eezBounds?.minLng),
      minLat: Math.min(rfmoBounds?.minLat, eezBounds?.minLat),
      maxLng: Math.max(rfmoBounds?.maxLng, eezBounds?.maxLng),
      maxLat: Math.max(rfmoBounds?.maxLat, eezBounds?.maxLat),
    }
  }
)
