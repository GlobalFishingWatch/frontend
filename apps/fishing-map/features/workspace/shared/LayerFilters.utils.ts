import { debounce } from 'es-toolkit'

import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { MultiSelectOption } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getCommonFiltersInDataview } from 'features/dataviews/dataviews.filters'

export type OnSelectFilterArgs = {
  filterKey: string | SupportedDatasetFilter
  selection: number | MultiSelectOption | MultiSelectOption[]
  singleValue?: boolean
}

export const trackEventCb = debounce((filterKey: string, label: string) => {
  trackEvent({
    category: TrackCategory.ActivityData,
    action: `Click on ${filterKey} filter`,
    label: label,
  })
}, 200)

export const cleanDataviewFiltersNotAllowed = (
  dataview: UrlDataviewInstance,
  vesselGroups: MultiSelectOption[],
  isGuestUser?: boolean
) => {
  const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
  Object.keys(filters).forEach((k) => {
    const key = k as SupportedDatasetFilter
    if (filters[key]) {
      const newFilterOptions = getCommonFiltersInDataview(dataview, key, {
        vesselGroups,
        isGuestUser,
      })
      const newFilterSelection = newFilterOptions?.filter((option) =>
        dataview.config?.filters?.[key]?.includes(option.id)
      )

      // We have to remove the key if it is not supported by the datasets selecion
      if (newFilterOptions.length === 0) {
        delete filters[key]
        // or keep only the options that every dataset have in common
      } else if (!newFilterSelection?.length !== dataview.config?.filters?.[key]?.length) {
        filters[key] = newFilterSelection.map(({ id }) => id)
      }
    }
  })

  return filters
}
