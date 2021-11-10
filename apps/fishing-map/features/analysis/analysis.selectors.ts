import { createSelector } from '@reduxjs/toolkit'
import { selectAnalysisQuery } from 'features/app/app.selectors'

export const selectIsAnalyzing = createSelector([selectAnalysisQuery], (analysisQuery) => {
  return analysisQuery !== undefined
})
