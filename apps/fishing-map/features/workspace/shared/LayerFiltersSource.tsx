import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { MultiSelectOnChange, MultiSelectOption } from '@globalfishingwatch/ui-components'
import { MultiSelect } from '@globalfishingwatch/ui-components'

import { getCommonFiltersInDataview } from 'features/dataviews/dataviews.filters'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'

import {
  areAllSourcesSelectedInDataview,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from '../activity/activity.utils'

import styles from './LayerFilters.module.css'

const cleanDataviewFiltersNotAllowed = (
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

type LayerFiltersSourceProps = {
  dataview: UrlDataviewInstance
  onSourceChange: (dataviewInstance: UrlDataviewInstance) => void
  onIsOpenChange?: (open: boolean) => void
}

function LayerFiltersSource({
  dataview,
  onSourceChange,
  onIsOpenChange,
}: LayerFiltersSourceProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const isGuestUser = useSelector(selectIsGuestUser)
  const vesselGroupsOptions = useVesselGroupsOptions()

  const sourceOptions = getSourcesOptionsInDataview(dataview, [DatasetTypes.Fourwings])
  // insert the "All" option only when more than one option available
  const allOption = { id: 'all', label: t((t) => t.selects.allSelected) }
  const allSourceOptions = sourceOptions.length > 1 ? [allOption, ...sourceOptions] : sourceOptions
  const allSelected = areAllSourcesSelectedInDataview(dataview)
  const sourcesSelected = allSelected ? [allOption] : getSourcesSelectedInDataview(dataview)

  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    const datasets =
      source.id === allOption.id
        ? sourceOptions.map((s) => s.id)
        : allSelected
          ? [source.id]
          : [...(dataview.config?.datasets || []), source.id]

    const newDataview = { ...dataview, config: { ...dataview.config, datasets } }
    const filters = cleanDataviewFiltersNotAllowed(newDataview, vesselGroupsOptions, isGuestUser)
    onSourceChange({
      id: dataview.id,
      config: { datasets, filters },
    })
  }

  const onRemoveSourceClick: MultiSelectOnChange = (source) => {
    const datasets =
      dataview.config?.datasets?.filter((datasetId: string) => datasetId !== source.id) || undefined
    onSourceChange({
      id: dataview.id,
      config: { datasets },
    })
  }

  return (
    <MultiSelect
      testId="activity-filters"
      label={t((t) => t.layer.sources) as string}
      placeholder={getPlaceholderBySelections({
        selection: sourcesSelected.map(({ id }) => id),
        options: allSourceOptions,
      })}
      options={allSourceOptions}
      labelContainerClassName={styles.labelContainer}
      selectedOptions={sourcesSelected}
      onSelect={onSelectSourceClick}
      onIsOpenChange={onIsOpenChange}
      onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
    />
  )
}

export default LayerFiltersSource
