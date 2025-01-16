import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeatureCollection, Polygon } from 'geojson'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import type { MultiSelectOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Collapsable,
  InputText,
  MultiSelect,
  Spinner,
  SwitchRow,
} from '@globalfishingwatch/ui-components'

import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import {
  getMetadataFromDataset,
  getPolygonsDatasetMetadata,
  parseGeoJsonProperties,
} from 'features/datasets/upload/datasets-upload.utils'
import type { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import { TimeFieldsGroup } from 'features/datasets/upload/TimeFieldsGroup'
import UserGuideLink from 'features/help/UserGuideLink'
import type { FileType } from 'utils/files'
import { getFileFromGeojson, getFileName, getFileType } from 'utils/files'

import { getDatasetParsed } from './datasets-parse.utils'
import FileDropzone from './FileDropzone'

import styles from './NewDataset.module.css'

type PolygonFeatureCollection = FeatureCollection<Polygon> & { metadata: Record<string, any> }

function NewPolygonDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
  onDatasetParseError,
}: NewDatasetProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [timeFilterError, setTimeFilterError] = useState<string>('')
  const [dataParseError, setDataParseError] = useState<string>('')
  const [processingData, setProcessingData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [geojson, setGeojson] = useState<PolygonFeatureCollection | undefined>()
  const { datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig } = useDatasetMetadata()
  const { getSelectedOption, filtersFieldsOptions } = useDatasetMetadataOptions(datasetMetadata)
  const isEditing = dataset?.id !== undefined
  const isPublic = !!datasetMetadata?.public
  const datasetFieldsAllowed = datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []
  const fileType = getFileType(file)

  const timeFilterType = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'timeFilterType',
  })

  const startTimeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'startTime',
  })

  const endTimeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'endTime',
  })

  const handleRawData = useCallback(
    async (file: File) => {
      setProcessingData(true)
      try {
        const data = await getDatasetParsed(file, 'polygons')
        const fileType = getFileType(file)
        const datasetMetadata = getPolygonsDatasetMetadata({
          data,
          name: getFileName(file),
          sourceFormat: fileType,
        })
        setDatasetMetadata(datasetMetadata)
        setGeojson(data as PolygonFeatureCollection)
        setProcessingData(false)
      } catch (e: any) {
        setProcessingData(false)
        onDatasetParseError(e, setDataParseError)
      }
    },
    [setDatasetMetadata, onDatasetParseError]
  )

  useEffect(() => {
    if (file && !loading) {
      handleRawData(file)
    } else if (dataset) {
      setDatasetMetadata(getMetadataFromDataset(dataset))
    }
  }, [dataset, file])

  useEffect(() => {
    if (timeFilterType && (startTimeProperty || endTimeProperty)) {
      const hasDateError = geojson?.features.some((feature) => {
        const isValidStartDate = startTimeProperty
          ? !isNaN(getUTCDate(feature.properties?.[startTimeProperty]).getTime())
          : true
        const isValidEndDate =
          timeFilterType === 'dateRange' && endTimeProperty
            ? !isNaN(getUTCDate(feature.properties?.[startTimeProperty]).getTime())
            : true
        return !isValidStartDate || !isValidEndDate
      })
      if (hasDateError) {
        setTimeFilterError(
          t('datasetUpload.errors.invalidDatesFeatures', {
            defaultValue:
              "Some of your {{featureType}} don't contain a valid date. They won't appear on the map regardless of time filter.",
            featureType: t('common.polygons', 'polygons'),
          })
        )
      }
    } else {
      setTimeFilterError('')
    }
  }, [timeFilterType, startTimeProperty, endTimeProperty])

  const onConfirmClick = useCallback(async () => {
    if (datasetMetadata && onConfirm) {
      setLoading(true)
      const file = geojson
        ? getFileFromGeojson(parseGeoJsonProperties<Polygon>(geojson, datasetMetadata))
        : undefined
      await onConfirm(datasetMetadata, { file, isEditing })
      setLoading(false)
    }
  }, [datasetMetadata, onConfirm, geojson, isEditing])

  if (processingData) {
    return (
      <div className={styles.processingData}>
        <Spinner className={styles.processingDataSpinner} />
        <p>{t('datasetUpload.processingData', 'Processing data...')}</p>
      </div>
    )
  }

  if (dataParseError) {
    return (
      <div className={styles.processingData}>
        <p className={styles.errorMsg}>{dataParseError}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {!dataset && (
        <FileDropzone
          label={file?.name}
          fileTypes={[fileType as FileType]}
          onFileLoaded={onFileUpdate}
        />
      )}
      <InputText
        value={datasetMetadata?.name}
        label={t('datasetUpload.datasetName', 'Dataset Name')}
        className={styles.input}
        onChange={(e) => setDatasetMetadata({ name: e.target.value })}
        disabled={loading}
      />
      <Collapsable
        className={styles.optional}
        label={t('datasetUpload.optionalFields', 'Optional fields')}
      >
        <InputText
          value={datasetMetadata?.description}
          label={t('datasetUpload.datasetDescription', 'Dataset description')}
          className={styles.input}
          onChange={(e) => setDatasetMetadata({ description: e.target.value })}
          disabled={loading}
        />
        <NewDatasetField
          datasetMetadata={datasetMetadata}
          property="valueProperties"
          label={t('datasetUpload.polygons.name', 'Polygon name')}
          onSelect={(selected) => {
            setDatasetMetadataConfig({ valueProperties: [selected.id] })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ valueProperties: [] })
          }}
          editable={!loading}
          infoTooltip={t(
            'datasetUpload.polygons.nameHelp',
            'Select a property of each polygon to make it appear as its label'
          )}
        />
        <NewDatasetField
          datasetMetadata={datasetMetadata}
          property="polygonColor"
          label={t('datasetUpload.polygons.color', 'polygon color')}
          placeholder={t(
            'datasetUpload.fieldNumericPlaceholder',
            'Select a numeric field from your dataset'
          )}
          onSelect={(selected) => {
            setDatasetMetadataConfig({ polygonColor: selected.id })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ polygonColor: '' })
          }}
          editable={!loading}
          infoTooltip={t(
            'datasetUpload.polygons.colorHelp',
            'Select a numeric property of each polygon to change its fill color'
          )}
        />
        <div className={styles.row}>
          <TimeFieldsGroup
            datasetMetadata={datasetMetadata}
            setDatasetMetadataConfig={setDatasetMetadataConfig}
            disabled={loading}
          />
        </div>
        <span className={styles.errorMsg}>{timeFilterError}</span>
        <MultiSelect
          className={styles.input}
          label={t('datasetUpload.polygons.filters', 'Polygon filters')}
          placeholder={
            datasetFieldsAllowed.length > 0
              ? datasetFieldsAllowed.join(', ')
              : t(
                  'datasetUpload.fieldMultiplePlaceholder',
                  'Select one or multiple fields from your dataset'
                )
          }
          direction="top"
          options={filtersFieldsOptions}
          selectedOptions={getSelectedOption(datasetFieldsAllowed) as MultiSelectOption[]}
          onSelect={(newFilter: MultiSelectOption) => {
            setDatasetMetadata({ fieldsAllowed: [...datasetFieldsAllowed, newFilter.id] })
          }}
          onRemove={(_: MultiSelectOption, rest: MultiSelectOption[]) => {
            setDatasetMetadata({ fieldsAllowed: rest.map((f: MultiSelectOption) => f.id) })
          }}
          onCleanClick={() => {
            setDatasetMetadata({ fieldsAllowed: [] })
          }}
          disabled={loading}
          infoTooltip={t(
            'datasetUpload.polygons.filtersHelp',
            'Select properties of the polygons to be able to dinamically filter them in the sidebar after'
          )}
        />
        <SwitchRow
          className={styles.saveAsPublic}
          label={t(
            'dataset.uploadPublic',
            'Allow other users to see this dataset when you share a workspace'
          )}
          disabled={isEditing || loading}
          active={isPublic}
          onClick={() => setDatasetMetadata({ public: !isPublic })}
        />
      </Collapsable>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          <UserGuideLink section="uploadPolygons" />
        </div>
        <Button
          className={styles.saveBtn}
          onClick={onConfirmClick}
          disabled={!datasetMetadata || error !== ''}
          loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewPolygonDataset
