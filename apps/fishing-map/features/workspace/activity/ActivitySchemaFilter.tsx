import React, { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
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

const getRangeLimitsBySchema = (schemaFilter: SchemaFilter): [number, number] => {
  const { options } = schemaFilter
  const optionValues = options.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
  return [optionValues[0], optionValues[optionValues.length - 1]]
}

const getRangeBySchema = (schemaFilter: SchemaFilter): [number, number] => {
  const { options, optionsSelected } = schemaFilter

  const optionValues = options.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
  const rangeValues =
    optionsSelected?.length > 0
      ? optionsSelected.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
      : optionValues

  return [rangeValues[0], rangeValues[rangeValues.length - 1]]
}

function ActivitySchemaFilter({
  schemaFilter,
  onSelect,
  onRemove,
  onClean,
}: ActivitySchemaFilterProps): React.ReactElement {
  const { id, tooltip, disabled, options, optionsSelected, type } = schemaFilter
  const [range, setRange] = useState<number[] | null>(
    type === 'number' ? getRangeBySchema(schemaFilter) : null
  )
  const { t } = useTranslation()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSliderCb = useCallback(
    debounce((rangeSelected) => {
      const filterRange = getRangeLimitsBySchema(schemaFilter)
      if (rangeSelected[0] === filterRange[0] && rangeSelected[1] === filterRange[1]) {
        onClean(id)
      } else {
        const selection = rangeSelected.map((id) => ({
          id: id.toString(),
          label: id.toString(),
        }))
        onSelect(id, selection)
      }
    }, 300),
    []
  )

  useEffect(() => {
    if (type === 'number') {
      debouncedSliderCb(range)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range])

  if (!showSchemaFilter(schemaFilter)) {
    return null
  }

  if (type === 'number') {
    const optionValues = options.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
    return (
      <Slider
        className={styles.multiSelect}
        range={range}
        label={t(`vessel.${id}` as any, id)}
        config={{
          step: 1,
          min: optionValues?.[0],
          max: optionValues?.[optionValues.length - 1],
        }}
        onChange={setRange}
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
