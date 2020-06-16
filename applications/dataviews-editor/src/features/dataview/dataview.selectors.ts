import { createSelector } from '@reduxjs/toolkit'
import { EditorDataview, selectDataviews } from '../dataviews/dataviews.slice'

export const selectCurrentDataview = createSelector([selectDataviews], (dataviews) => {
  const currentDataview = dataviews.find((dataview: EditorDataview) => dataview.editing)
  return currentDataview as EditorDataview
})
