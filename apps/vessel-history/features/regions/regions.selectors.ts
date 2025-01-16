import { createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import type { RootState } from 'store'

import type { RegionId, RegionsState } from './regions.slice';
import { MarineRegionType, regionsEntityAdapter } from './regions.slice'

const { selectById } = regionsEntityAdapter.getSelectors<RegionsState>((regions) => regions)

export const selectRegions = (state: RootState) => {
  return state.regions
}

const selectRegionsById = memoize((id: MarineRegionType) =>
  createSelector([selectRegions], (regions) => {
    const regionList = selectById(regions, id)
    return regionList?.data
  })
)

export const selectEEZs = selectRegionsById(MarineRegionType.eez)
export const selectMPAs = selectRegionsById(MarineRegionType.mpa)
export const selectRFMOs = selectRegionsById(MarineRegionType.rfmo)

export const selectRegionsStatus = (state: RootState) => state.regions.status

export const selectEezById = memoize((id: RegionId) =>
  createSelector([selectEEZs], (eezs) => {
    if (!id || !eezs) {
      return null
    }
    return eezs.find((eez) => eez.id.toString() === id.toString())
  })
)

export const selectRfmoById = memoize((id: RegionId) =>
  createSelector([selectRFMOs], (rfmos) => {
    if (!id || !rfmos) {
      return null
    }
    return rfmos.find((rfmo) => rfmo.id.toString() === id.toString())
  })
)
