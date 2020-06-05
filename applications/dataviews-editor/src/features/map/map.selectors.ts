import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectAddedDataviews } from 'features/dataviews/dataviews.selectors'
import { EditorDataview } from 'features/dataviews/dataviews.slice'

export const selectGeneratorConfigWithData = createSelector(
  [selectAddedDataviews],
  (addedDataviews) => {
    return addedDataviews.map((dataview: EditorDataview) => {
      return dataview.viewParams as Generators.GeneratorConfig
    })
  }
)
