import { memoize } from 'lodash'
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { RegionId, regionsEntityAdapter } from './regions.slice'

const { selectById } = regionsEntityAdapter.getSelectors<RootState>((state) => state.regions)

const selectRegionsById = memoize((id: RegionId) =>
  createSelector([(state: RootState) => state], (state) => {
    const regionList = selectById(state, id)
    const result = [...(regionList?.data ?? [])]
    result.sort((a, b) => (a.label < b.label ? -1 : 1))
    return result
  })
)

export const selectEEZs = selectRegionsById('eezs')
export const selectRFMOs = selectRegionsById('rfmos')
export const selectPorts = selectRegionsById('ports')

export const selectRegionsStatus = (state: RootState) => state.regions.status
