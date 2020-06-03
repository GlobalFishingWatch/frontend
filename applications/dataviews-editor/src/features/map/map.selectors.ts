import { createSelector } from '@reduxjs/toolkit'
import { selectAddedDataviews } from 'features/dataviews/dataviews.selectors'
import { Generators } from '@globalfishingwatch/layer-composer'

export const selectGeneratorConfigWithData = createSelector(
  [selectAddedDataviews],
  (addedDataviews) => {
    return addedDataviews.map((dataview) => {
      return dataview.resolvedViewParams as Generators.GeneratorConfig
    })
  }
)
