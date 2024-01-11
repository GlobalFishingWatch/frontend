import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import { Select, SelectOption } from '@globalfishingwatch/ui-components'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import {
  DatasetConfiguration,
  DatasetConfigurationUI,
  TimeFilterType,
} from '@globalfishingwatch/api-types'
import { useDatasetMetadataOptions } from './datasets-upload.hooks'
import { DatasetMetadata } from './NewDataset'

const TIME_FILTER_OPTIONS: TimeFilterType[] = ['timerange', 'timestamp']

export const getTimeFilterOptions = (): SelectOption<TimeFilterType>[] => {
  return TIME_FILTER_OPTIONS.map((id) => ({ id, label: t(`common.${id}`, id as string) }))
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

  const isTimestampFilter =
    getDatasetConfigurationProperty({
      dataset: datasetMetadata,
      property: 'timeFilterType',
    }) === 'timestamp'

  const onFilterSelect = useCallback(
    (selected: SelectOption) => {
      setDatasetMetadataConfig({ timeFilterType: selected.id })
    },
    [setDatasetMetadataConfig]
  )

  const onFilterClean = useCallback(() => {
    setDatasetMetadataConfig({ timeFilterType: undefined })
  }, [setDatasetMetadataConfig])

  const onStartSelect = useCallback(
    (selected: SelectOption) => {
      isTimestampFilter
        ? setDatasetMetadataConfig({ startTime: selected.id, endTime: selected.id })
        : setDatasetMetadataConfig({ startTime: selected.id })
    },
    [setDatasetMetadataConfig, isTimestampFilter]
  )

  const onStartClean = useCallback(() => {
    isTimestampFilter
      ? setDatasetMetadataConfig({ startTime: undefined, endTime: undefined })
      : setDatasetMetadataConfig({ startTime: undefined })
  }, [setDatasetMetadataConfig, isTimestampFilter])

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
    <Fragment>
      <Select
        placeholder={t(
          'datasetUploadUI.timePeriodTypePlaceholder',
          'Select a time period filter type'
        )}
        options={timeFilterOptions}
        direction="top"
        label={t('datasetUpload.points.time', 'Point time')}
        selectedOption={
          getSelectedOption(
            getDatasetConfigurationProperty({
              dataset: datasetMetadata,
              property: 'timeFilterType',
            }),
            timeFilterOptions
          ) as SelectOption
        }
        onSelect={onFilterSelect}
        onCleanClick={onFilterClean}
        disabled={disabled}
      />
      <Select
        placeholder={t('datasetUploadUI.fieldPlaceholder', 'Select a field from your dataset')}
        options={fieldsOptions}
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
            })
          ) as SelectOption
        }
        onSelect={onStartSelect}
        onCleanClick={onStartClean}
      />
      {(getDatasetConfigurationProperty({
        dataset: datasetMetadata,
        property: 'timeFilterType',
      }) as TimeFilterType) === 'timerange' && (
        <Select
          placeholder={t('datasetUpload.fieldPlaceholder', 'Select a field from your dataset')}
          options={fieldsOptions}
          direction="top"
          selectedOption={
            getSelectedOption(
              getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'endTime',
              })
            ) as SelectOption
          }
          onSelect={onEndSelect}
          onCleanClick={onEndClean}
          disabled={disabled}
        />
      )}
    </Fragment>
  )
}
