import { createSelector } from '@reduxjs/toolkit'
import { getAOIGeneratorsConfig } from 'features/areas-of-interest/areas-of-interest.slice'
import { selectGeneratorsConfig } from './map.slice'

export const getGeneratorsConfig = createSelector(
  [selectGeneratorsConfig, getAOIGeneratorsConfig],
  (generators, aoiGenerators) => {
    if (!aoiGenerators) return generators
    return [...generators, ...aoiGenerators]
  }
)
