import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Select, SelectOnChange, SelectOption } from '@globalfishingwatch/ui-components'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { TimeFilterType } from '@globalfishingwatch/api-types'
import { useDatasetMetadataOptions } from './datasets-upload.hooks'
import { DatasetMetadata } from './NewDataset'

const TIME_FILTER_OPTIONS: SelectOption[] = [
  { id: 'timerange', label: 'time range' },
  { id: 'timestamp', label: 'timestamp' },
]

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
  return (
    <Fragment>
      <Select
        placeholder={t(
          'datasetUploadUI.timePeriodTypePlaceholder',
          'Select a time period filter type'
        )}
        options={TIME_FILTER_OPTIONS}
        direction="top"
        label={t('datasetUpload.points.time', 'Point time')}
        // className={styles.input}
        selectedOption={
          getSelectedOption(
            getDatasetConfigurationProperty({
              dataset: datasetMetadata,
              property: 'pointTimeFilterType',
            }),
            TIME_FILTER_OPTIONS
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
            property: 'pointTimeFilterType',
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
        property: 'pointTimeFilterType',
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
