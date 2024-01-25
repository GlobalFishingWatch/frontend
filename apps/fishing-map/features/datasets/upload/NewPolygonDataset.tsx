import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { FeatureCollection, Polygon } from 'geojson'
import {
  Button,
  Collapsable,
  InputText,
  MultiSelect,
  MultiSelectOption,
  Spinner,
  SwitchRow,
} from '@globalfishingwatch/ui-components'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import UserGuideLink from 'features/help/UserGuideLink'
import { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import { FileType, getFileFromGeojson, getFileName, getFileType } from 'utils/files'
import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import {
  getMetadataFromDataset,
  getPolygonsDatasetMetadata,
} from 'features/datasets/upload/datasets-upload.utils'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import { TimeFieldsGroup } from 'features/datasets/upload/TimeFieldsGroup'
import styles from './NewDataset.module.css'
import { getDatasetParsed } from './datasets-parse.utils'
import FileDropzone from './FileDropzone'

function NewPolygonDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
  onDatasetParseError,
}: NewDatasetProps): React.ReactElement {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [dataParseError, setDataParseError] = useState<string>('')
  const [processingData, setProcessingData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [geojson, setGeojson] = useState<FeatureCollection<Polygon> | undefined>()
  const { datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig } = useDatasetMetadata()
  const { getSelectedOption, filtersFieldsOptions } = useDatasetMetadataOptions(datasetMetadata)
  const isEditing = dataset?.id !== undefined
  const isPublic = !!datasetMetadata?.public
  const datasetFieldsAllowed = datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []
  const fileType = getFileType(file)

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
        setGeojson(data as FeatureCollection<Polygon>)
        setProcessingData(false)
      } catch (e: any) {
        setProcessingData(false)
        onDatasetParseError(e, fileType, setDataParseError)
      }
    },
    [setDatasetMetadata, onDatasetParseError, fileType]
  )

  useEffect(() => {
    if (file && !loading) {
      handleRawData(file)
    } else if (dataset) {
      setDatasetMetadata(getMetadataFromDataset(dataset))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, file])

  const onConfirmClick = useCallback(async () => {
    if (datasetMetadata && onConfirm) {
      setLoading(true)
      const file = geojson ? getFileFromGeojson(geojson) : undefined
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
          property="propertyToInclude"
          label={t('datasetUpload.polygons.name', 'Polygon name')}
          onSelect={(selected) => {
            setDatasetMetadataConfig({ propertyToInclude: selected.id })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ propertyToInclude: undefined })
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
          onSelect={(selected) => {
            const config = getDatasetConfiguration(dataset)
            const valueProperties = config.valueProperties || []
            setDatasetMetadataConfig({ polygonColor: selected.id })
            setDatasetMetadataConfig({ valueProperties: [...valueProperties, selected.id] })
          }}
          onCleanClick={() => {
            const config = getDatasetConfiguration(dataset)
            const valueProperties = config.valueProperties
            setDatasetMetadataConfig({ polygonColor: undefined })
            setDatasetMetadataConfig({ valueProperties })
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
        <MultiSelect
          className={styles.input}
          label={t('datasetUpload.polygons.filters', 'Polygon filters')}
          placeholder={
            datasetFieldsAllowed.length > 0
              ? datasetFieldsAllowed.join(', ')
              : t('datasetUpload.fieldMultiplePlaceholder', 'Select fields from your dataset')
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
          {/* // TODO update sections by categories */}
          <UserGuideLink section="uploadReference" />
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
