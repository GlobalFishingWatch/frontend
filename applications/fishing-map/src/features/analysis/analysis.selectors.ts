import { createSelector } from '@reduxjs/toolkit'
import { selectAnalysisQuery, selectAnalysisTypeQuery } from 'features/app/app.selectors'

export const selectIsAnalyzing = createSelector([selectAnalysisQuery], (analysisQuery) => {
  return analysisQuery !== undefined
})

export const selectShowTimeComparison = createSelector(
  [selectAnalysisTypeQuery],
  (analysisType) => {
    return analysisType === 'beforeAfter' || analysisType === 'periodComparison'
  }
)
