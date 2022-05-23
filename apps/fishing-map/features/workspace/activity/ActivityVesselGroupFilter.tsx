import React from 'react'
import { useTranslation } from 'react-i18next'
import { MultiSelect, MultiSelectOption } from '@globalfishingwatch/ui-components'
import { SchemaFilter } from 'features/datasets/datasets.utils'
import { useVesselGroupSelectWithModal } from 'features/vesselGroup/vessel-groups.hooks'
import styles from './ActivityFilters.module.css'

type ActivityVesselGroupFilterProps = {
  schemaFilter: SchemaFilter
  onSelect: (filterKey: string, selection: MultiSelectOption | MultiSelectOption[]) => void
  onRemove: (filterKey: string, selection: MultiSelectOption[]) => void
  onClean: (filterKey: string) => void
}

function ActivityVesselGroupFilter({
  schemaFilter,
  onSelect,
  onRemove,
  onClean,
}: ActivityVesselGroupFilterProps): React.ReactElement {
  const { id, disabled, options, optionsSelected } = schemaFilter
  const { t } = useTranslation()
  const { optionsWithModal, onSelectCallback } = useVesselGroupSelectWithModal(
    options,
    (selection) => {
      if (onSelect) onSelect(id, selection)
    },
    styles.openModalLink
  )

  return (
    <MultiSelect
      key={id}
      disabled={disabled}
      label={t('vesselGroup.vesselGroup', 'Vessel group')}
      //   placeholder={getPlaceholderBySelections(optionsSelected)}
      options={optionsWithModal}
      selectedOptions={optionsSelected}
      className={styles.multiSelect}
      onSelect={onSelectCallback}
      onRemove={(selection, rest) => onRemove(id, rest)}
      onCleanClick={() => onClean(id)}
    />
  )
}

export default ActivityVesselGroupFilter
