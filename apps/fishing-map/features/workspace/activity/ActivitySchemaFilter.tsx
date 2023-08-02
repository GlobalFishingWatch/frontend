import { useCallback } from 'react'
import cx from 'classnames'
import {
  Choice,
  ChoiceOption,
  MultiSelect,
  MultiSelectOption,
  Select,
  Slider,
  SliderRange,
} from '@globalfishingwatch/ui-components'
import { EXCLUDE_FILTER_ID, FilterOperator, INCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { SchemaFilter } from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'
import styles from './ActivityFilters.module.css'

type ActivitySchemaFilterProps = {
  schemaFilter: SchemaFilter
  onSelect: (
    filterKey: string,
    selection: MultiSelectOption | MultiSelectOption[],
    singleValue?: boolean
  ) => void
  onSelectOperation: (filterKey: string, filterOperator: FilterOperator) => void
  onIsOpenChange?: (open: boolean) => void
  onRemove: (filterKey: string, selection: MultiSelectOption[]) => void
  onClean: (filterKey: string) => void
}
export const showSchemaFilter = (schemaFilter: SchemaFilter) => {
  return !schemaFilter.disabled && schemaFilter.options && schemaFilter.options.length > 0
}

export const VALUE_TRANSFORMATIONS_BY_UNIT = {
  minutes: {
    in: (v) => v / 60,
    out: (v) => v * 60,
    label: t('common.hour_other', 'Hours'),
  },
}

export const getFilterOperatorOptions = () => {
  return [
    {
      id: INCLUDE_FILTER_ID,
      label: t('common.include', 'Include'),
    },
    {
      id: EXCLUDE_FILTER_ID,
      label: t('common.exclude', 'Exclude'),
    },
  ] as ChoiceOption[]
}

const getRangeLimitsBySchema = (schemaFilter: SchemaFilter): number[] => {
  const { options } = schemaFilter
  const optionValues = options.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
  return optionValues.length === 1
    ? optionValues
    : [optionValues[0], optionValues[optionValues.length - 1]]
}

const getRangeBySchema = (schemaFilter: SchemaFilter): number[] => {
  const { options, optionsSelected } = schemaFilter

  const optionValues = options.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
  const rangeValues =
    optionsSelected?.length > 0
      ? optionsSelected
          .map((option) => (Array.isArray(option) ? parseInt(option[0].id) : parseInt(option.id)))
          .sort((a, b) => a - b)
      : optionValues
  return optionValues.length === 1
    ? rangeValues
    : [rangeValues[0], rangeValues[rangeValues.length - 1]]
}

function ActivitySchemaFilter({
  schemaFilter,
  onSelect,
  onRemove,
  onClean,
  onIsOpenChange,
  onSelectOperation,
}: ActivitySchemaFilterProps) {
  const { id, label, type, disabled, options, optionsSelected, filterOperator, unit } = schemaFilter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSliderChange = useCallback(
    (rangeSelected) => {
      const filterRange = getRangeLimitsBySchema(schemaFilter)
      if (rangeSelected[0] === filterRange[0] && rangeSelected[1] === filterRange[1]) {
        onClean(id)
      } else if (!Array.isArray(rangeSelected) && !Number.isNaN(rangeSelected)) {
        const value = unit ? VALUE_TRANSFORMATIONS_BY_UNIT[unit].out(rangeSelected) : rangeSelected
        onSelect(id, value, true)
      } else {
        const selection = rangeSelected.map((id) => ({
          id: id.toString(),
          label: id.toString(),
        }))
        onSelect(id, selection)
      }
    },
    [id, onClean, onSelect, schemaFilter, unit]
  )

  if (!showSchemaFilter(schemaFilter)) {
    return null
  }

  if (type === 'range') {
    return (
      <SliderRange
        className={styles.multiSelect}
        initialRange={getRangeBySchema(schemaFilter)}
        label={label}
        config={{
          steps: [0, 1, 10, 100, 1000, 10000],
          min: 0,
          max: 10000,
        }}
        onChange={onSliderChange}
        histogram
      />
    )
  }

  if (type === 'number') {
    const initialValue = unit
      ? VALUE_TRANSFORMATIONS_BY_UNIT[unit].in(getRangeBySchema(schemaFilter)[0])
      : getRangeBySchema(schemaFilter)[0]
    const minValue = unit
      ? VALUE_TRANSFORMATIONS_BY_UNIT[unit].in(getRangeLimitsBySchema(schemaFilter)[0])
      : getRangeLimitsBySchema(schemaFilter)[0]
    const maxValue = unit
      ? VALUE_TRANSFORMATIONS_BY_UNIT[unit].in(getRangeLimitsBySchema(schemaFilter)[1])
      : getRangeLimitsBySchema(schemaFilter)[1]
    return (
      <Slider
        className={styles.multiSelect}
        initialValue={initialValue}
        label={label}
        config={{
          steps: [minValue, maxValue],
          min: minValue,
          max: maxValue,
        }}
        onChange={onSliderChange}
      />
    )
  }

  if (type === 'boolean') {
    return (
      <Select
        key={id}
        disabled={disabled}
        label={label}
        placeholder={getPlaceholderBySelections({
          selection: optionsSelected.map(({ id }) => id),
          options,
        })}
        options={options}
        selectedOption={optionsSelected?.[0]}
        containerClassName={cx(styles.multiSelect, { [styles.experimental]: id === 'matched' })}
        onSelect={(selection) => onSelect(id, [selection])}
        onRemove={() => onRemove(id, [])}
        onCleanClick={() => onClean(id)}
      />
    )
  }

  return (
    <div className={styles.relative}>
      {filterOperator && (
        <Choice
          size="tiny"
          className={styles.filterOperator}
          options={getFilterOperatorOptions()}
          activeOption={filterOperator}
          onSelect={(option) => onSelectOperation(id, option.id as FilterOperator)}
        />
      )}
      <MultiSelect
        key={id}
        disabled={disabled}
        label={label}
        placeholder={getPlaceholderBySelections({
          selection: optionsSelected.map(({ id }) => id),
          options,
          filterOperator,
        })}
        options={options}
        selectedOptions={optionsSelected}
        className={styles.multiSelect}
        onSelect={(selection) => onSelect(id, selection)}
        onRemove={(selection, rest) => onRemove(id, rest)}
        onIsOpenChange={onIsOpenChange}
        onCleanClick={() => onClean(id)}
      />
    </div>
  )
}

export default ActivitySchemaFilter
