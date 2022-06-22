import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { MultiSelect, MultiSelectOption, Select, Slider } from '@globalfishingwatch/ui-components'
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
  return !schemaFilter.disabled && schemaFilter.options && schemaFilter.options.length > 1
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
  const { id, disabled, options, optionsSelected, type } = schemaFilter
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
    <MultiSelect
      key={id}
      disabled={disabled}
      label={
        id === 'vesselGroups'
          ? t('vesselGroup.vesselGroups', 'Vessel Groups')
          : t(`vessel.${id}` as any, id)
      }
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
