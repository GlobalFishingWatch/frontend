import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import { Select, SelectOnChange, SelectOption } from '@globalfishingwatch/ui-components'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { TimeFilterType } from '@globalfishingwatch/api-types'
import { useDatasetMetadataOptions } from './datasets-upload.hooks'
import { DatasetMetadata } from './NewDataset'

const TIME_FILTER_OPTIONS: TimeFilterType[] = ['timerange', 'timestamp']

export const getTimeFilterOptions = (): SelectOption<TimeFilterType>[] => {
  return TIME_FILTER_OPTIONS.map((id) => ({ id, label: t(`common.${id}`, id as string) }))
}

type TimeFieldsGroupProps = {
  datasetMetadata: DatasetMetadata
  onFilterSelect: SelectOnChange
  onStartSelect: SelectOnChange
  onEndSelect: SelectOnChange
  onFilterClean?: (e: React.MouseEvent) => void
  onStartClean?: (e: React.MouseEvent) => void
  onEndClean?: (e: React.MouseEvent) => void
}

export const TimeFieldsGroup = ({
  datasetMetadata,
  onFilterSelect,
  onFilterClean,
  onStartSelect,
  onStartClean,
  onEndSelect,
  onEndClean,
}: TimeFieldsGroupProps) => {
  const { t } = useTranslation()
  const { fieldsOptions, getSelectedOption } = useDatasetMetadataOptions(datasetMetadata)
  const timeFilterOptions = getTimeFilterOptions()
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
        // className={styles.input}
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
      />
      <Select
        placeholder={t('datasetUploadUI.fieldPlaceholder', 'Select a field from your dataset')}
        options={fieldsOptions}
        // className={styles.input}
        disabled={
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
          // className={styles.input}
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
        />
      )}
    </Fragment>
  )
}
