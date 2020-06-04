import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectAddedDataviews } from 'features/dataviews/dataviews.selectors'

export const selectGeneratorConfigWithData = createSelector(
  [selectAddedDataviews],
  (addedDataviews) => {
    return addedDataviews.map((dataview) => {
      return dataview.resolvedViewParams as Generators.GeneratorConfig
    })
  }
)
