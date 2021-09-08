import { memoize } from 'lodash'
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { MarineRegionType, RegionId, regionsEntityAdapter } from './regions.slice'

const { selectById } = regionsEntityAdapter.getSelectors<RootState>((state) => state.regions)

const selectRegionsById = memoize((id: RegionId) =>
  createSelector([(state: RootState) => state], (state) => {
    const regionList = selectById(state, id)
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
