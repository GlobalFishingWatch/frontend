import { createSelector } from '@reduxjs/toolkit'
import { selectDataviews } from 'routes/routes.selectors'
import { selectGeneratorsConfig } from './map.slice'

export const getGeneratorsConfig = createSelector(
  [selectGeneratorsConfig, selectDataviews],
  (generatorsConfig, urlDataviews) => {
    if (!urlDataviews) return generatorsConfig

    return generatorsConfig.map((generator) => {
      const urlDataview = urlDataviews.find(
        (urlDataview) => urlDataview.id?.toString() === generator.id
      )
      const visible =
        urlDataview?.config?.visible !== undefined ? urlDataview?.config?.visible : true

      return {
        ...generator,
        visible,
      }
    })
  }
)
