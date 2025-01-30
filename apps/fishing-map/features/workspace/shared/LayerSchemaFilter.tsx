import { useCallback, useMemo } from 'react'
import cx from 'classnames'

import type { FilterOperator } from '@globalfishingwatch/api-types'
import { EXCLUDE_FILTER_ID, INCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type {
  ChoiceOption,
  MultiSelectOption,
  SliderRangeValues,
} from '@globalfishingwatch/ui-components'
import { Choice, MultiSelect, Select, Slider, SliderRange } from '@globalfishingwatch/ui-components'

import type { SchemaFilter, SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import type { OnSelectFilterArgs } from 'features/workspace/shared/LayerFilters'

import styles from './LayerFilters.module.css'

type LayerSchemaFilterProps = {
  schemaFilter: SchemaFilter
  onSelect: (args: OnSelectFilterArgs) => void
  onSelectOperation: (filterKey: string, filterOperator: FilterOperator) => void
  onIsOpenChange?: (open: boolean) => void
  onRemove: (filterKey: string, selection: MultiSelectOption[]) => void
  onClean: (filterKey: string) => void
}
export const showSchemaFilter = (schemaFilter: SchemaFilter) => {
  return !schemaFilter.disabled && schemaFilter.options && schemaFilter.options.length > 0
}

type TransformationUnit = 'minutes'

const EXPERIMENTAL_FILTERS: SchemaFilter['id'][] = ['matched', 'neural_vessel_type']

type Transformation = {
  in: (v: any) => number
  out: (v: any) => number
  label: string
}

const VALUE_TRANSFORMATIONS_BY_UNIT: Record<TransformationUnit, Transformation> = {
  minutes: {
    in: (v) => v / 60,
    out: (v) => v * 60,
    label: t('common.hour_other', 'Hours'),
  },
}

const getValueByUnit = (
  value: string | number,
  { unit, transformDirection = 'in' } = {} as { unit?: string; transformDirection?: 'in' | 'out' }
): number => {
  const transformConfig = VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit]
  if (transformConfig) {
    return VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit][transformDirection](value)
  }
  if (typeof value === 'number') return value
  return parseFloat(value)
}

export const getValueLabelByUnit = (
  value: string | number,
  { unit, unitLabel = true } = {} as { unit?: string; unitLabel?: boolean }
): string => {
  const transformConfig = VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit]
  if (transformConfig && unitLabel) {
    return `${formatI18nNumber(getValueByUnit(value, { unit }))} ${transformConfig.label}`
  }
  return formatI18nNumber(getValueByUnit(value, { unit })) as string
}

export const getLabelWithUnit = (label: string, unit?: string): string => {
  const translatedLabel = t(`layer.${label}`, label)
  if (unit) {
    return `${translatedLabel} (${
      VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit]?.label
    })`
  }
  return translatedLabel
}

const getFilterOperatorOptions = () => {
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

export const getSchemaValueRounded = (value: number, decimals = 2): number => {
  return parseFloat(value.toFixed(decimals))
}

const getSliderConfigBySchema = (schemaFilter: SchemaFilter) => {
  if (schemaFilter?.id === 'radiance') {
    return {
      steps: [0, 1, 10, 100, 1000, 10000],
      min: 0,
      max: 10000,
    }
  }
  const schemaMin = getValueByUnit(schemaFilter.options?.[0]?.id, { unit: schemaFilter.unit }) ?? 0
  const schemaMax = getValueByUnit(schemaFilter.options?.[1]?.id, { unit: schemaFilter.unit }) ?? 1
  const supportsRounding = Math.abs(schemaMax - schemaMin) > 1
  const min = supportsRounding ? getSchemaValueRounded(schemaMin) : schemaMin
  const max = supportsRounding ? getSchemaValueRounded(schemaMax) : schemaMax
  if (min > max) {
    return {
      steps: [max, min],
      min: max,
      max: min,
    }
  }
  return {
    steps: [min, max],
    min,
    max,
  }
}

const getRangeLimitsBySchema = (schemaFilter: SchemaFilter): number[] => {
  const { options } = schemaFilter
  const optionValues = options.map(({ id }) => parseFloat(id)).sort((a, b) => a - b)

  if (optionValues.length === 1) {
    return optionValues
  }

  const min = optionValues[0]
  const max = optionValues[optionValues.length - 1]
  const supportsRounding = Math.abs(max - min) > 1

  return [
    supportsRounding ? getSchemaValueRounded(min) : min,
    supportsRounding ? getSchemaValueRounded(max) : max,
  ]
}

const getRangeBySchema = (schemaFilter: SchemaFilter): number[] => {
  const { options, optionsSelected, unit } = schemaFilter
  const optionValues = options.map(({ id }) => getValueByUnit(id, { unit })).sort((a, b) => a - b)
  const { min, max } = getSliderConfigBySchema(schemaFilter)
  const rangeValues =
    optionsSelected?.length > 0
      ? optionsSelected
          .map((option) => {
            const value = Array.isArray(option) ? parseFloat(option[0].id) : parseFloat(option.id)
            return getValueByUnit(value, { unit })
          })
          .sort((a, b) => a - b)
      : optionValues

  if (optionValues.length === 1) {
    return rangeValues
  }
  const minValue = rangeValues[0] < min ? min : rangeValues[0]
  const maxValue =
    rangeValues[rangeValues.length - 1] > max ? max : rangeValues[rangeValues.length - 1]
  const supportsRounding = Math.abs(maxValue - minValue) > 1
  const values = [
    supportsRounding ? getSchemaValueRounded(minValue) : minValue,
    supportsRounding ? getSchemaValueRounded(maxValue) : maxValue,
  ]

  if (values[0] > values[1]) {
    return [values[1], values[0]]
  }

  return values
}

const UNSORTED_FILTERS: SupportedDatasetSchema[] = ['speed', 'elevation', 'vessel-groups']

function LayerSchemaFilter({
  schemaFilter,
  onSelect,
  onRemove,
  onClean,
  onIsOpenChange,
  onSelectOperation,
}: LayerSchemaFilterProps) {
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
  const sortedOptions = useMemo(() => {
    if (UNSORTED_FILTERS.includes(id) || type === 'range') return options
    return options.sort((a, b) => a.label.localeCompare(b.label))
  }, [id, options, type])

  const onSliderChange = useCallback(
    (rangeSelected: SliderRangeValues | number) => {
      if (Array.isArray(rangeSelected)) {
        const filterRange = getRangeLimitsBySchema(schemaFilter)
        if (rangeSelected[0] === filterRange[0] && rangeSelected[1] === filterRange[1]) {
          onClean(id)
        } else if (!Array.isArray(rangeSelected) && !Number.isNaN(rangeSelected)) {
          const selection = getValueByUnit(rangeSelected, { unit, transformDirection: 'out' })
          onSelect({ filterKey: id, selection, singleValue: true })
        } else {
          const selection = rangeSelected.map((range: number) => ({
            // This id ideally would be a number but as the url parser always consider number as arrays
            // TODO: find a way to identify when a filter is a range so we can parse properly
            id: getValueByUnit(range, { unit, transformDirection: 'out' }).toString(),
            label: getValueByUnit(range, { unit, transformDirection: 'out' }).toString(),
          }))
          onSelect({ filterKey: id, selection })
        }
      } else {
        onSelect({ filterKey: id, selection: rangeSelected })
      }
    },
    [id, onClean, onSelect, schemaFilter, unit]
  )

  if (!showSchemaFilter(schemaFilter)) {
    return null
  }

  if (type === 'range') {
    const values = getRangeBySchema(schemaFilter)
    return (
      <div className={styles.rangeContainer}>
        <SliderRange
          thumbsSize="mini"
          range={values}
          className={cx(styles.multiSelect, styles.range)}
          initialRange={values}
          histogram={id === 'radiance'}
          onCleanClick={() => onClean(id)}
          label={getLabelWithUnit(label, unit)}
          config={getSliderConfigBySchema(schemaFilter)}
          onChange={onSliderChange}
          showInputs
        />
      </div>
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
        options={sortedOptions}
        selectedOption={optionsSelected?.[0]}
        containerClassName={cx(styles.multiSelect, {
          experimentalLabel: EXPERIMENTAL_FILTERS.includes(id),
        })}
        onSelect={(selection) => onSelect({ filterKey: id, selection: [selection] })}
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
          options={sortedOptions}
          selectedOption={optionsSelected[0]}
          className={cx({
            experimentalLabel: EXPERIMENTAL_FILTERS.includes(id),
          })}
          labelContainerClassName={styles.labelContainer}
          onSelect={(selection) => onSelect({ filterKey: id, selection, singleValue: true })}
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
          className={cx({
            experimentalLabel: EXPERIMENTAL_FILTERS.includes(id),
          })}
          options={options}
          selectedOptions={optionsSelected}
          onSelect={(selection) => onSelect({ filterKey: id, selection })}
          labelContainerClassName={styles.labelContainer}
          onRemove={(selection, rest) => onRemove(id, rest)}
          onIsOpenChange={onIsOpenChange}
          onCleanClick={() => onClean(id)}
        />
      )}
    </div>
  )
}

export default LayerSchemaFilter
