import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import {
  Choice,
  ChoiceOption,
  MultiSelect,
  MultiSelectOption,
  Select,
  Slider,
} from '@globalfishingwatch/ui-components'
import { EXCLUDE_FILTER_ID, FilterOperator, INCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { SchemaFilter } from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'
import styles from './ActivityFilters.module.css'

type ActivitySchemaFilterProps = {
  schemaFilter: SchemaFilter
  onSelect: (filterKey: string, selection: MultiSelectOption | MultiSelectOption[]) => void
  onSelectOperation: (filterKey: string, filterOperator: FilterOperator) => void
  onIsOpenChange?: (open: boolean) => void
  onRemove: (filterKey: string, selection: MultiSelectOption[]) => void
  onClean: (filterKey: string) => void
}
export const showSchemaFilter = (schemaFilter: SchemaFilter) => {
  return !schemaFilter.disabled && schemaFilter.options && schemaFilter.options.length > 0
}

export const getFilterOperatorOptions = () => {
  return [
    {
      id: INCLUDE_FILTER_ID,
      title: t('common.include', 'Include'),
    },
    {
      id: EXCLUDE_FILTER_ID,
      title: t('common.exclude', 'Exclude'),
    },
  ] as ChoiceOption[]
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
  onIsOpenChange,
  onSelectOperation,
}: ActivitySchemaFilterProps): React.ReactElement {
  const { id, type, disabled, options, optionsSelected, filterOperator } = schemaFilter
  const { t } = useTranslation()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSliderChange = useCallback(
    (rangeSelected) => {
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
    },
    [id, onClean, onSelect, schemaFilter]
  )

  if (!showSchemaFilter(schemaFilter)) {
    return null
  }

  if (type === 'number') {
    return (
      <Slider
        className={styles.multiSelect}
        initialRange={getRangeBySchema(schemaFilter)}
        label={t(`vessel.${id}` as any, id)}
        config={{
          steps: [0, 1, 10, 100, 1000, 10000],
          min: 0,
          max: 10000,
        }}
        onChange={onSliderChange}
        histogram
      ></Slider>
    )
  }

  if (type === 'boolean') {
    return (
      <Select
        key={id}
        disabled={disabled}
        label={t(`vessel.${id}` as any, id)}
        placeholder={getPlaceholderBySelections(optionsSelected)}
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
          onOptionClick={(option) => onSelectOperation(id, option.id as FilterOperator)}
        />
      )}
      <MultiSelect
        key={id}
        disabled={disabled}
        label={
          id === 'vessel-groups'
            ? t('vesselGroup.vesselGroups', 'Vessel Groups')
            : t(`vessel.${id}` as any, id)
        }
        placeholder={getPlaceholderBySelections(optionsSelected, filterOperator)}
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
