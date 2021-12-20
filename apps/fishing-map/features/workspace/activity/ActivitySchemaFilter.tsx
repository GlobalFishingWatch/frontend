import React from 'react'
import { useTranslation } from 'react-i18next'
import { range as lodashRange } from 'lodash'
import { MultiSelect, MultiSelectOption, Slider } from '@globalfishingwatch/ui-components'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { SchemaFilter } from 'features/datasets/datasets.utils'
import styles from './ActivityFilters.module.css'

type ActivitySchemaFilterProps = {
  schemaFilter: SchemaFilter
  onSelect: (filterKey: string, selection: MultiSelectOption | MultiSelectOption[]) => void
  onRemove: (filterKey: string, selection: MultiSelectOption[]) => void
  onClean: (filterKey: string) => void
}
export const showSchemaFilter = (schemaFilter: SchemaFilter) => {
  return schemaFilter.active && schemaFilter.options.length > 1
}

function ActivitySchemaFilter({
  schemaFilter,
  onSelect,
  onRemove,
  onClean,
}: ActivitySchemaFilterProps): React.ReactElement {
  const { t } = useTranslation()
  if (!showSchemaFilter(schemaFilter)) {
    return null
  }
  const { id, tooltip, disabled, options, optionsSelected, type } = schemaFilter
  if (type === 'number') {
    const onSliderChange = (range) => {
      const selection = lodashRange(range[0], range[1] + 1).map((id) => ({
        id: id.toString(),
        label: id.toString(),
      }))
      onSelect(id, selection)
    }
    const optionValues = options.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
    const rangeValues =
      optionsSelected?.length > 0
        ? optionsSelected.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
        : optionValues

    const range = [rangeValues[0], rangeValues[rangeValues.length - 1]]
    return (
      <Slider
        range={range}
        label={t(`vessel.${id}` as any, id)}
        config={{
          step: 1,
          min: optionValues?.[0],
          max: optionValues?.[optionValues.length - 1],
        }}
        onChange={onSliderChange}
      ></Slider>
    )
  }

  return (
    <MultiSelect
      key={id}
      disabled={disabled}
      disabledMsg={tooltip}
      label={t(`vessel.${id}` as any, id)}
      placeholder={getPlaceholderBySelections(optionsSelected)}
      options={options}
      selectedOptions={optionsSelected}
      className={styles.multiSelect}
      onSelect={(selection) => onSelect(id, selection)}
      onRemove={(selection, rest) => onRemove(id, rest)}
      onCleanClick={() => onClean(id)}
    />
  )
}

export default ActivitySchemaFilter
