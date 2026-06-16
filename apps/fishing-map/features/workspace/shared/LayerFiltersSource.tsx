import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { MultiSelectOnChange } from '@globalfishingwatch/ui-components'
import { MultiSelect } from '@globalfishingwatch/ui-components'

import { getPlaceholderBySelections } from 'features/i18n/utils'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'

import {
  areAllSourcesSelectedInDataview,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from '../activity/activity.utils'

import { cleanDataviewFiltersNotAllowed } from './LayerFilters.utils'

import styles from './LayerFilters.module.css'

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
