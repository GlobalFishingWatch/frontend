import type { FeatureCollectionWithFilename } from 'shpjs'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment, useMemo } from 'react'
import { InputText, SwitchRow, Select } from '@globalfishingwatch/ui-components'
import {
  AnyDatasetConfiguration,
  DatasetCategory,
  DatasetGeometryType,
  EnviromentalDatasetConfiguration,
} from '@globalfishingwatch/api-types'
import { DatasetMetadata } from './NewDataset'
import styles from './NewDataset.module.css'

export const extractPropertiesFromGeojson = (geojson: GeoJSON.FeatureCollection) => {
  if (!geojson?.features) return []
  const uniqueProperties = Object.keys(
    geojson.features.reduce(function (acc, { properties }) {
      return { ...acc, ...properties }
    }, {})
  )
  return uniqueProperties
}

export const getPropertyFieldsOptions = (fields: string[]) => {
  if (!fields) return
  return fields.map((property) => ({
    id: property,
    label: property,
  }))
}

const getPropertyRangeValuesFromGeojson = (
  geojson: GeoJSON.FeatureCollection,
  property: string
) => {
  if (!geojson?.features) return
  const propertyRange = geojson.features.reduce(
    function (acc, { properties }) {
      const value = properties?.[property]
      if (!value) return acc
      return {
        min: value < acc.min ? value : acc.min,
        max: value > acc.max ? value : acc.max,
      }
    },
    { min: 0, max: 0 }
  )
  return propertyRange
}

interface DatasetConfigProps {
  className?: string
  datasetCategory: DatasetCategory
  datasetGeometryType: DatasetGeometryType
  onDatasetFieldChange: (field: DatasetMetadata | AnyDatasetConfiguration) => void
  fileData: FeatureCollectionWithFilename
  metadata: DatasetMetadata
}

const DatasetConfig: React.FC<DatasetConfigProps> = (props) => {
  const {
    metadata,
    fileData,
    className = '',
    datasetCategory,
    datasetGeometryType,
    onDatasetFieldChange,
  } = props
  const { t } = useTranslation()
  const fields = useMemo(
    () => (metadata.fields as string[]) || extractPropertiesFromGeojson(fileData),
    [fileData, metadata.fields]
  )
  const fieldsOptions = useMemo(() => getPropertyFieldsOptions(fields), [fields])

  const { min, max } =
    (metadata.configuration as EnviromentalDatasetConfiguration)?.propertyToIncludeRange || {}
  return (
    <div className={cx(styles.datasetConfig, className)}>
      <InputText
        inputSize="small"
        value={metadata.name}
        label={t('common.name', 'Name')}
        className={styles.input}
        onChange={(e) => onDatasetFieldChange({ name: e.target.value })}
      />
      <InputText
        inputSize="small"
        label={t('common.description', 'Description')}
        className={styles.input}
        onChange={(e) => onDatasetFieldChange({ description: e.target.value })}
      />
      {datasetCategory === DatasetCategory.Context && (
        <Select
          label={
            datasetGeometryType === 'points'
              ? t('dataset.pointsNameField', 'Field to name each point')
              : t('dataset.featuresNameField', 'Field to name each area')
          }
          placeholder={t('selects.placeholder', 'Select an option')}
          options={fieldsOptions}
          className={styles.input}
          selectedOption={fieldsOptions.find(
            ({ id }) => id === metadata.configuration?.propertyToInclude
          )}
          onSelect={(selected) => {
            onDatasetFieldChange({ propertyToInclude: selected.id })
          }}
          onRemove={() => {
            onDatasetFieldChange({ propertyToInclude: undefined })
          }}
        />
      )}
      {datasetCategory === DatasetCategory.Environment && datasetGeometryType === 'polygons' && (
        <div className={cx(styles.row, styles.input)}>
          <label className={styles.selectLabel}>
            {t('dataset.colorByValue', 'Color features by value')}
          </label>
          <Select
            className={styles.selectShort}
            placeholder={t('selects.placeholder', 'Select an option')}
            containerClassName={styles.selectContainer}
            options={fieldsOptions}
            selectedOption={fieldsOptions.find(
              ({ id }) => id === metadata.configuration?.propertyToInclude
            )}
            onSelect={(selected) => {
              // TODO: pre-populate min and max values depending on selection
              onDatasetFieldChange({ propertyToInclude: selected.id })
              const propertyRange = getPropertyRangeValuesFromGeojson(fileData, selected.id)
              if (propertyRange) {
                onDatasetFieldChange({
                  propertyToIncludeRange: {
                    min: propertyRange.min,
                    max: propertyRange.max,
                  },
                })
              }
            }}
            onRemove={() => {
              onDatasetFieldChange({ propertyToInclude: undefined })
            }}
          />
          <InputText
            inputSize="small"
            type="number"
            step="0.1"
            value={min}
            placeholder={t('common.min', 'Min')}
            className={cx(styles.shortInput, styles.noLabelInput)}
            onChange={(e) =>
              onDatasetFieldChange({
                propertyToIncludeRange: {
                  min: e.target.value && parseFloat(e.target.value),
                  max:
                    (metadata.configuration as EnviromentalDatasetConfiguration)
                      ?.propertyToIncludeRange?.max || parseFloat(e.target.value),
                },
              })
            }
          />
          <InputText
            inputSize="small"
            type="number"
            step="0.1"
            placeholder={t('common.max', 'Max')}
            value={max}
            className={cx(styles.shortInput, styles.noLabelInput)}
            onChange={(e) =>
              onDatasetFieldChange({
                propertyToIncludeRange: {
                  min: min || 0,
                  max: e.target.value && parseFloat(e.target.value),
                },
              })
            }
          />
        </div>
      )}
      {datasetCategory === DatasetCategory.Environment && datasetGeometryType === 'tracks' && (
        <Fragment>
          <div className={cx(styles.multipleSelectContainer, styles.input)}>
            <Select
              label={t('dataset.latitudeNameField', 'Latitude field')}
              placeholder={t('selects.placeholder', 'Select an option')}
              options={fieldsOptions}
              selectedOption={fieldsOptions.find(
                ({ id }) => id === metadata.configuration?.latitude
              )}
              onSelect={(selected) => {
                onDatasetFieldChange({ latitude: selected.id })
              }}
              onRemove={() => {
                onDatasetFieldChange({ latitude: undefined })
              }}
            />
            <Select
              label={t('dataset.longitudeNameField', 'Longitude field')}
              placeholder={t('selects.placeholder', 'Select an option')}
              options={fieldsOptions}
              selectedOption={fieldsOptions.find(
                ({ id }) => id === metadata.configuration?.longitude
              )}
              onSelect={(selected) => {
                onDatasetFieldChange({ longitude: selected.id })
              }}
              onRemove={() => {
                onDatasetFieldChange({ longitude: undefined })
              }}
            />
          </div>
          <Select
            label={t('dataset.timeNameField', 'Time field')}
            placeholder={t('selects.placeholder', 'Select an option')}
            className={styles.input}
            options={fieldsOptions}
            selectedOption={fieldsOptions.find(
              ({ id }) => id === metadata.configuration?.timestamp
            )}
            onSelect={(selected) => {
              onDatasetFieldChange({ timestamp: selected.id })
            }}
            onRemove={() => {
              onDatasetFieldChange({ timestamp: undefined })
            }}
          />
          <div className={styles.input}>
            <Select
              label={`${t('dataset.individualIdField', 'Individual ID field')} (${t(
                'common.optional',
                'Optional'
              )})`}
              placeholder={t('selects.placeholder', 'Select an option')}
              options={fieldsOptions.filter(
                (option) =>
                  option.id !== metadata.configuration?.longitude &&
                  option.id !== metadata.configuration?.latitude &&
                  option.id !== metadata.configuration?.timestamp
              )}
              selectedOption={fieldsOptions.find(({ id }) => id === metadata.configuration?.id)}
              onSelect={(selected) => {
                onDatasetFieldChange({ id: selected.id })
              }}
              onRemove={() => {
                onDatasetFieldChange({ id: undefined })
              }}
            />
          </div>
        </Fragment>
      )}
      <div className={styles.input}>
        <SwitchRow
          label={t(
            'dataset.uploadPublic' as any,
            'Allow other users to see this dataset when you share a workspace'
          )}
          active={metadata.public === true}
          onClick={() => onDatasetFieldChange({ public: !metadata.public })}
        />
      </div>
    </div>
  )
}
export default DatasetConfig
