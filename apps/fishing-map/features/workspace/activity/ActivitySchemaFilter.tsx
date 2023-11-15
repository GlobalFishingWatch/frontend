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
  formatSliderNumber,
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
    selection: number | MultiSelectOption | MultiSelectOption[],
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

export type TransformationUnit = 'minutes'

type Transformation = {
  in: (v: any) => number
  out: (v: any) => number
  label: string
}

export const VALUE_TRANSFORMATIONS_BY_UNIT: Record<TransformationUnit, Transformation> = {
  minutes: {
    in: (v) => v / 60,
    out: (v) => v * 60,
    label: t('common.hour_other', 'Hours'),
  },
}

export const getValueByUnit = (
  value: string | number,
  { unit, transformDirection = 'in' } = {} as { unit?: string; transformDirection?: 'in' | 'out' }
): number => {
  const transformConfig = VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit]
  if (transformConfig) {
    return Math.round(
      VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit][transformDirection](value)
    )
  }
  if (typeof value === 'number') return value
  return parseInt(value as string)
}

export const getValueLabelByUnit = (
  value: string | number,
  { unit, unitLabel = true } = {} as { unit?: string; unitLabel?: boolean }
): string => {
  const transformConfig = VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit]
  if (transformConfig && unitLabel) {
    return `${formatSliderNumber(getValueByUnit(value, { unit }))} ${transformConfig.label}`
  }
  return formatSliderNumber(getValueByUnit(value, { unit }))
}

export const getLabelWithUnit = (label: string, unit?: string): string => {
  if (unit) {
    return `${label} (${VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit]?.label})`
  }
  return label
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

const getSliderConfigBySchema = (schemaFilter: SchemaFilter) => {
  if (schemaFilter?.id === 'radiance') {
    return {
      steps: [0, 1, 10, 100, 1000, 10000],
      min: 0,
      max: 10000,
    }
  }
  const min = getValueByUnit(schemaFilter.options?.[0]?.id, { unit: schemaFilter.unit }) || 0
  const max = getValueByUnit(schemaFilter.options?.[1]?.id, { unit: schemaFilter.unit }) || 1
  return {
    steps: [min, max],
    min,
    max,
  }
}

const getRangeLimitsBySchema = (schemaFilter: SchemaFilter): number[] => {
  const { options } = schemaFilter
  const optionValues = options.map(({ id }) => parseInt(id)).sort((a, b) => a - b)
  return optionValues.length === 1
    ? optionValues
    : [optionValues[0], optionValues[optionValues.length - 1]]
}

const getRangeBySchema = (schemaFilter: SchemaFilter): number[] => {
  const { options, optionsSelected, unit } = schemaFilter
  const optionValues = options.map(({ id }) => getValueByUnit(id, { unit })).sort((a, b) => a - b)

  const rangeValues =
    optionsSelected?.length > 0
      ? optionsSelected
          .map((option) => {
            const value = Array.isArray(option) ? parseInt(option[0].id) : parseInt(option.id)
            return getValueByUnit(value, { unit })
          })
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
  const {
    id,
    label,
    type,
    disabled,
    options,
    optionsSelected,
    filterOperator,
    unit,
    singleSelection,
  } = schemaFilter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSliderChange = useCallback(
    (rangeSelected: any) => {
      const filterRange = getRangeLimitsBySchema(schemaFilter)
      if (rangeSelected[0] === filterRange[0] && rangeSelected[1] === filterRange[1]) {
        onClean(id)
      } else if (!Array.isArray(rangeSelected) && !Number.isNaN(rangeSelected)) {
        const value = getValueByUnit(rangeSelected, { unit, transformDirection: 'out' })
        onSelect(id, value, true)
      } else {
        const selection = rangeSelected.map((range: number) => ({
          id: getValueByUnit(range, { unit, transformDirection: 'out' }).toString(),
          label: getValueByUnit(range, { unit, transformDirection: 'out' }).toString(),
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
        histogram={id === 'radiance'}
        label={getLabelWithUnit(label, unit)}
        config={getSliderConfigBySchema(schemaFilter)}
        onChange={onSliderChange}
      />
    )
  }

  if (type === 'number') {
    const initialValue = getValueByUnit(getRangeBySchema(schemaFilter)[0], { unit })
    const minValue = getValueByUnit(getRangeLimitsBySchema(schemaFilter)[0], { unit })
    const maxValue = getValueByUnit(getRangeLimitsBySchema(schemaFilter)[1], { unit })
    return (
      <Slider
        className={styles.multiSelect}
        initialValue={initialValue}
        label={getLabelWithUnit(label, unit)}
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
        label={getLabelWithUnit(label, unit)}
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
    <div className={cx(styles.relative, styles.multiSelect)}>
      {filterOperator && (
        <Choice
          size="tiny"
          className={styles.filterOperator}
          options={getFilterOperatorOptions()}
          activeOption={filterOperator}
          onSelect={(option) => onSelectOperation(id, option.id as FilterOperator)}
        />
      )}
      {singleSelection ? (
        <Select
          key={id}
          disabled={disabled}
          label={getLabelWithUnit(label, unit)}
          placeholder={getPlaceholderBySelections({
            selection: optionsSelected.map(({ id }) => id),
            options,
            filterOperator,
          })}
          options={options}
          selectedOption={optionsSelected[0]}
          labelContainerClassName={styles.labelContainer}
          onSelect={(selection) => onSelect(id, selection, true)}
          onCleanClick={() => onClean(id)}
        />
      ) : (
        <MultiSelect
          key={id}
          disabled={disabled}
          label={getLabelWithUnit(label, unit)}
          placeholder={getPlaceholderBySelections({
            selection: optionsSelected.map(({ id }) => id),
            options,
            filterOperator,
          })}
          options={options}
          selectedOptions={optionsSelected}
          onSelect={(selection) => onSelect(id, selection)}
          labelContainerClassName={styles.labelContainer}
          onRemove={(selection, rest) => onRemove(id, rest)}
          onIsOpenChange={onIsOpenChange}
          onCleanClick={() => onClean(id)}
        />
      )}
    </div>
  )
}

export default ActivitySchemaFilter
