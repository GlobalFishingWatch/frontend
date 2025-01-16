import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'

import type {
  DatasetConfiguration,
  DatasetConfigurationUI,
  TimeFilterType,
} from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Choice, Select } from '@globalfishingwatch/ui-components'

import { useDatasetMetadataOptions } from './datasets-upload.hooks'
import type { DatasetMetadata } from './NewDataset'

import styles from './NewDataset.module.css'

type TimeFilterTypeOption = TimeFilterType | 'none'
const TIME_FILTER_OPTIONS: TimeFilterTypeOption[] = ['none', 'date', 'dateRange']

const getTimeFilterOptions = (
  filterOptions = TIME_FILTER_OPTIONS
): SelectOption<TimeFilterTypeOption>[] => {
  return filterOptions.map((id) => ({ id, label: t(`datasetUpload.${id}`, id as string) }))
}

type TimeFieldsGroupProps = {
  filterOptions?: TimeFilterTypeOption[]
  datasetMetadata: DatasetMetadata
  setDatasetMetadataConfig: (config: Partial<DatasetConfiguration | DatasetConfigurationUI>) => void
  disabled?: boolean
}

export const TimeFieldsGroup = ({
  filterOptions = TIME_FILTER_OPTIONS,
  datasetMetadata,
  setDatasetMetadataConfig,
  disabled = false,
}: TimeFieldsGroupProps) => {
  const { t } = useTranslation()
  const { fieldsOptions, getSelectedOption } = useDatasetMetadataOptions(datasetMetadata)
  const timeFilterOptions = getTimeFilterOptions(filterOptions)
  const datasetTimeFilterConfiguration = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'timeFilterType',
  })
  const geometryType = datasetMetadata?.configuration?.configurationUI?.geometryType
  const activeOption = datasetTimeFilterConfiguration
    ? (getSelectedOption(datasetTimeFilterConfiguration, timeFilterOptions) as SelectOption)?.id
    : timeFilterOptions[0]?.id
  const isDateFilter = datasetTimeFilterConfiguration === 'date'

  const onTimeFilterTypeSelect = useCallback(
    (selected: SelectOption) => {
      setDatasetMetadataConfig({ timeFilterType: selected.id === 'none' ? undefined : selected.id })
    },
    [setDatasetMetadataConfig]
  )

  const onStartSelect = useCallback(
    (selected: SelectOption) => {
      if (isDateFilter) {
        setDatasetMetadataConfig({
          startTime: selected.id,
          endTime: selected.id,
          timestamp: selected.id,
        })
      } else {
        setDatasetMetadataConfig({ startTime: selected.id })
      }
    },
    [setDatasetMetadataConfig, isDateFilter]
  )

  const onStartClean = useCallback(() => {
    if (isDateFilter) {
      setDatasetMetadataConfig({ startTime: '', endTime: '' })
    } else {
      setDatasetMetadataConfig({ startTime: '' })
    }
  }, [setDatasetMetadataConfig, isDateFilter])

  const onEndSelect = useCallback(
    (selected: SelectOption) => {
      setDatasetMetadataConfig({ endTime: selected.id })
    },
    [setDatasetMetadataConfig]
  )

  const onEndClean = useCallback(() => {
    setDatasetMetadataConfig({ endTime: '' })
  }, [setDatasetMetadataConfig])

  const translatedGeometryType =
    geometryType === 'tracks'
      ? t('dataset.typeTracks', 'Tracks')
      : geometryType === 'polygons'
      ? t('dataset.typePolygons', 'Polygons')
      : t('dataset.typePoints', 'Points')

  return (
    <div className={styles.row}>
      <Choice
        label={t('datasetUpload.timePeriodType', 'Time filter')}
        infoTooltip={t(
          'datasetUpload.timePeriodTypePlaceholder',
          'Choose whether to filter your dataset by dates or time ranges'
        )}
        activeOption={activeOption}
        options={timeFilterOptions}
        onSelect={onTimeFilterTypeSelect}
        size="medium"
        className={styles.input}
      />
      {datasetTimeFilterConfiguration && (
        <Select
          placeholder={t('datasetUpload.fieldPlaceholder', 'Select a field from your dataset')}
          options={fieldsOptions}
          label={
            datasetTimeFilterConfiguration === 'date'
              ? t('datasetUpload.time', {
                  geometryType: translatedGeometryType,
                  defaultValue: `${translatedGeometryType} time`,
                })
              : t('datasetUpload.timeStart', {
                  geometryType: translatedGeometryType,
                  defaultValue: `${translatedGeometryType} start`,
                })
          }
          infoTooltip={
            datasetTimeFilterConfiguration === 'date'
              ? t('datasetUpload.timestampHelp', {
                  geometryType: translatedGeometryType,
                  defaultValue: `Select the property that defines the date of each
                   ${translatedGeometryType} to filter them with the time bar`,
                })
              : t('datasetUpload.timerangeStartHelp', {
                  geometryType: translatedGeometryType,
                  defaultValue: `Select the property that defines the start of the date range of
                   each ${translatedGeometryType} to filter them with the time bar`,
                })
          }
          disabled={
            disabled ||
            !getDatasetConfigurationProperty({
              dataset: datasetMetadata,
              property: 'timeFilterType',
            })
          }
          selectedOption={
            getSelectedOption(
              getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'startTime',
              })?.toString()
            ) as SelectOption
          }
          onSelect={onStartSelect}
          onCleanClick={onStartClean}
          className={styles.input}
        />
      )}
      {datasetTimeFilterConfiguration === 'dateRange' && (
        <Select
          placeholder={t('datasetUpload.fieldPlaceholder', 'Select a field from your dataset')}
          options={fieldsOptions}
          direction="top"
          selectedOption={
            getSelectedOption(
              getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'endTime',
              })?.toString()
            ) as SelectOption
          }
          label={t('datasetUpload.timeEnd', {
            geometryType: translatedGeometryType,
            defaultValue: `${translatedGeometryType} end`,
          })}
          infoTooltip={t('datasetUpload.timerangeEndHelp', {
            geometryType: translatedGeometryType,
            defaultValue: `Select the property that defines the start of the date range of each ${translatedGeometryType} to filter them with the time bar`,
          })}
          onSelect={onEndSelect}
          onCleanClick={onEndClean}
          disabled={disabled}
          className={styles.input}
        />
      )}
    </div>
  )
}
