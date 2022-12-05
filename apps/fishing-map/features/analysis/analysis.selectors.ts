import { createSelector } from '@reduxjs/toolkit'
import {
  selectAnalysisQuery,
  selectAnalysisTimeComparison,
  selectAnalysisTypeQuery,
} from 'features/app/app.selectors'
import { DatasetAreaDetail, selectAreas } from 'features/areas/areas.slice'
import { getUTCDateTime } from 'utils/dates'

export const selectIsAnalyzing = createSelector([selectAnalysisQuery], (analysisQuery) => {
  return analysisQuery !== undefined
})

export const selectAnalysisArea = createSelector(
  [selectAnalysisQuery, selectAreas],
  (analysisQuery, areas): DatasetAreaDetail => {
    if (!analysisQuery) return
    const { areaId, datasetId } = analysisQuery
    return areas[datasetId]?.detail?.[areaId]
  }
)

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

    const end = getUTCDateTime(timeComparison.start)
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO()
    const compareEnd = getUTCDateTime(timeComparison.compareStart)
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
