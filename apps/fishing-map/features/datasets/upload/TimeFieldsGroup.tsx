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
      ? t('dataset.typeTracks')
      : geometryType === 'polygons'
        ? t('dataset.typePolygons')
        : t('dataset.typePoints')

  return (
    <div className={styles.row}>
      <Choice
        label={t('datasetUpload.timePeriodType')}
        infoTooltip={t('datasetUpload.timePeriodTypePlaceholder')}
        activeOption={activeOption}
        options={timeFilterOptions}
        onSelect={onTimeFilterTypeSelect}
        size="medium"
        className={styles.input}
      />
      {datasetTimeFilterConfiguration && (
        <Select
          placeholder={t('datasetUpload.fieldPlaceholder')}
          options={fieldsOptions}
          label={
            datasetTimeFilterConfiguration === 'date'
              ? t('datasetUpload.time', {
                  geometryType: translatedGeometryType,
                })
              : t('datasetUpload.timeStart', {
                  geometryType: translatedGeometryType,
                })
          }
          infoTooltip={
            datasetTimeFilterConfiguration === 'date'
              ? t('datasetUpload.timestampHelp', {
                  geometryType: translatedGeometryType,
                })
              : t('datasetUpload.timerangeStartHelp', {
                  geometryType: translatedGeometryType,
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
          placeholder={t('datasetUpload.fieldPlaceholder')}
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
          })}
          infoTooltip={t('datasetUpload.timerangeEndHelp', {
            geometryType: translatedGeometryType,
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
