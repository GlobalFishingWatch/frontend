import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiSelect, MultiSelectOption } from '@globalfishingwatch/ui-components'
import { SchemaFilter } from 'features/datasets/datasets.utils'
import styles from './ActivityFilters.module.css'

type ActivityVesselGroupFilterProps = {
  schemaFilter: SchemaFilter
  onSelect: (filterKey: string, selection: MultiSelectOption | MultiSelectOption[]) => void
  onRemove: (filterKey: string, selection: MultiSelectOption[]) => void
  onClean: (filterKey: string) => void
}
export const showSchemaFilter = (schemaFilter: SchemaFilter) => {
  return !schemaFilter.disabled && schemaFilter.options.length > 1
}

const OPEN_MODAL_ID = 'openModal'

function ActivityVesselGroupFilter({
  schemaFilter,
  onSelect,
  onRemove,
  onClean,
}: ActivityVesselGroupFilterProps): React.ReactElement {
  const { id, disabled, options, optionsSelected } = schemaFilter
  const { t } = useTranslation()

  const optionsWithModal: MultiSelectOption[] = useMemo(
    () =>
      [
        {
          id: OPEN_MODAL_ID,
          label: t('vesselGroup.createNewGroup', 'Create new group'),
          disableSelection: true,
          className: styles.openModalLink,
        } as MultiSelectOption,
      ].concat(options),
    [options, t]
  )

  const onSelectCallback = useCallback(
    (selection: MultiSelectOption) => {
      if (selection.id === OPEN_MODAL_ID) {
        console.log('open modal')
        return
      }
      if (onSelect) onSelect(id, selection)
    },
    [id, onSelect]
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
