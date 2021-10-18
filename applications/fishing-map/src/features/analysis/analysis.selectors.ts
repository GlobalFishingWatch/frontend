import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import {
  selectAnalysisQuery,
  selectAnalysisTimeComparison,
  selectAnalysisTypeQuery,
} from 'features/app/app.selectors'

export const selectIsAnalyzing = createSelector([selectAnalysisQuery], (analysisQuery) => {
  return analysisQuery !== undefined
})

export const selectShowTimeComparison = createSelector(
  [selectAnalysisTypeQuery],
  (analysisType) => {
    return analysisType === 'beforeAfter' || analysisType === 'periodComparison'
  }
)

export const selectTimeComparisonValues = createSelector(
  [selectAnalysisTimeComparison],
  (timeComparison) => {
    if (!timeComparison) return null

    const end = DateTime.fromISO(timeComparison.start)
      .toUTC()
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO()
    const compareEnd = DateTime.fromISO(timeComparison.compareStart)
      .toUTC()
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO()

    return {
      start: timeComparison.start,
      end,
      compareStart: timeComparison.compareStart,
      compareEnd,
    }
  }
)
