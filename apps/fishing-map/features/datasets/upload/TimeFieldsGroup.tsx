import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'
import { t } from 'i18next'
import { Choice, Select, SelectOption } from '@globalfishingwatch/ui-components'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import {
  DatasetConfiguration,
  DatasetConfigurationUI,
  TimeFilterType,
} from '@globalfishingwatch/api-types'
import { useDatasetMetadataOptions } from './datasets-upload.hooks'
import { DatasetMetadata } from './NewDataset'
import styles from './NewDataset.module.css'

type TimeFilterTypeOption = TimeFilterType | 'none'
const TIME_FILTER_OPTIONS: TimeFilterTypeOption[] = ['none', 'date', 'dateRange']

export const getTimeFilterOptions = (): SelectOption<TimeFilterTypeOption>[] => {
  return TIME_FILTER_OPTIONS.map((id) => ({ id, label: t(`datasetUpload.${id}`, id as string) }))
}

type TimeFieldsGroupProps = {
  datasetMetadata: DatasetMetadata
  setDatasetMetadataConfig: (config: Partial<DatasetConfiguration | DatasetConfigurationUI>) => void
  disabled?: boolean
}

export const TimeFieldsGroup = ({
  datasetMetadata,
  setDatasetMetadataConfig,
  disabled = false,
}: TimeFieldsGroupProps) => {
  const { t } = useTranslation()
  const { fieldsOptions, getSelectedOption } = useDatasetMetadataOptions(datasetMetadata)
  const timeFilterOptions = getTimeFilterOptions()
  const geometryType = datasetMetadata?.configuration?.configurationUI?.geometryType
  const timeFilterType = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'timeFilterType',
  }) as TimeFilterType
  const activeOption = (
    getSelectedOption(
      getDatasetConfigurationProperty({
        dataset: datasetMetadata,
        property: 'timeFilterType',
      }),
      timeFilterOptions
    ) as SelectOption
  )?.id
  const isDateFilter = timeFilterType === 'date'

  const onTimeFilterTypeSelect = useCallback(
    (selected: SelectOption) => {
      setDatasetMetadataConfig({ timeFilterType: selected.id === 'none' ? undefined : selected.id })
    },
    [setDatasetMetadataConfig]
  )

  const onStartSelect = useCallback(
    (selected: SelectOption) => {
      isDateFilter
        ? setDatasetMetadataConfig({ startTime: selected.id, endTime: selected.id })
        : setDatasetMetadataConfig({ startTime: selected.id })
    },
    [setDatasetMetadataConfig, isDateFilter]
  )

  const onStartClean = useCallback(() => {
    isDateFilter
      ? setDatasetMetadataConfig({ startTime: undefined, endTime: undefined })
      : setDatasetMetadataConfig({ startTime: undefined })
  }, [setDatasetMetadataConfig, isDateFilter])

  const onEndSelect = useCallback(
    (selected: SelectOption) => {
      setDatasetMetadataConfig({ endTime: selected.id })
    },
    [setDatasetMetadataConfig]
  )

  const onEndClean = useCallback(() => {
    setDatasetMetadataConfig({ endTime: undefined })
  }, [setDatasetMetadataConfig])

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
      {timeFilterType && (
        <Select
          placeholder={t('datasetUploadUI.fieldPlaceholder', 'Select a field from your dataset')}
          options={fieldsOptions}
          label={
            timeFilterType === 'date'
              ? t('datasetUpload.time', {
                  geometryType: capitalize(geometryType),
                  defaultValue: `${geometryType} time`,
                })
              : t('datasetUpload.timeStart', {
                  geometryType: capitalize(geometryType),
                  defaultValue: `${geometryType} start`,
                })
          }
          infoTooltip={
            timeFilterType === 'date'
              ? t('datasetUpload.timestampHelp', {
                  geometryType,
                  defaultValue: `Select the property that defines the date of each
                   ${geometryType} to filter them with the time bar`,
                })
              : t('datasetUpload.timerangeStartHelp', {
                  geometryType,
                  defaultValue: `Select the property that defines the start of the date range of
                   each ${geometryType} to filter them with the time bar`,
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
      {timeFilterType === 'dateRange' && (
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
            geometryType: capitalize(geometryType),
            defaultValue: `${geometryType} end`,
          })}
          infoTooltip={t('datasetUpload.timerangeEndHelp', {
            geometryType,
            defaultValue: `Select the property that defines the start of the date range of each ${geometryType} to filter them with the time bar`,
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
