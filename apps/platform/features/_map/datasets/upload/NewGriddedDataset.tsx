import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import papaparse from 'papaparse'

import type { AggregationFunction } from '@globalfishingwatch/api-types'
import type { GeotiffError } from '@globalfishingwatch/data-transforms'
import { GEOTIFF_ERRORS, geotiffToList } from '@globalfishingwatch/data-transforms'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import { Button, InputText, Select, Spinner, SwitchRow } from '@globalfishingwatch/ui-components'

import { useDatasetMetadata } from 'features/_map/datasets/upload/datasets-upload.hooks'
import {
  getDatasetMetadataValidations,
  getGriddedDatasetMetadata,
  getMetadataFromDataset,
} from 'features/_map/datasets/upload/datasets-upload.utils'
import type { NewDatasetProps } from 'features/_map/datasets/upload/NewDataset'
import UserGuideLink from 'features/help/UserGuideLink'
import { getFileName } from 'utils/files'

import FileDropzone from './FileDropzone'

import styles from './NewDataset.module.css'

const AGGREGATION_OPTIONS: { id: AggregationFunction; label: string }[] = [
  { id: 'AVG', label: 'AVG' },
  { id: 'SUM', label: 'SUM' },
]

// geotiffToList throws domain codes; the user-facing copy belongs here, not in the lib
const GEOTIFF_ERROR_KEYS: Record<GeotiffError, string> = {
  [GEOTIFF_ERRORS.UnsupportedProjection]: 'datasetUpload.errors.geotiff.unsupportedProjection',
  [GEOTIFF_ERRORS.TooLarge]: 'datasetUpload.errors.geotiff.tooLarge',
  [GEOTIFF_ERRORS.InvalidData]: 'datasetUpload.errors.geotiff.invalidData',
}

const getGeotiffErrorKey = (error: any) =>
  GEOTIFF_ERROR_KEYS[error?.message as GeotiffError] ?? 'datasetUpload.errors.default'

function NewGriddedDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
  onDatasetParseError,
}: NewDatasetProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const [dataParseError, setDataParseError] = useState('')
  const [processingData, setProcessingData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<Record<string, number>[] | undefined>()
  const [bands, setBands] = useState<string[]>([])
  const { datasetMetadata, setDatasetMetadata } = useDatasetMetadata()
  const isEditing = dataset?.id !== undefined
  const isPublic = !!datasetMetadata?.public
  const { isValid, errors } = getDatasetMetadataValidations(datasetMetadata)

  const handleRawData = useCallback(
    async (file: File) => {
      setProcessingData(true)
      try {
        const { rows, bands } = await geotiffToList(file)
        setRows(rows)
        setBands(bands)
        setDatasetMetadata(getGriddedDatasetMetadata({ name: getFileName(file), bands }))
        setProcessingData(false)
      } catch (e: any) {
        setProcessingData(false)
        onDatasetParseError(new Error(getGeotiffErrorKey(e)), setDataParseError)
      }
    },
    [onDatasetParseError, setDatasetMetadata]
  )

  useEffect(() => {
    if (file && !loading) {
      handleRawData(file)
    } else if (dataset) {
      setDatasetMetadata(getMetadataFromDataset(dataset))
    }
  }, [dataset, file])

  const fourwingsConfig = getDatasetConfiguration(datasetMetadata, 'userFourwingsV1')
  const valueBand = fourwingsConfig.agregationColumn
  const agregationMode = fourwingsConfig.agregationMode ?? 'AVG'
  const bandOptions = useMemo(() => bands.map((id) => ({ id, label: id })), [bands])

  const setFourwingsConfig = useCallback(
    (patch: { agregationMode?: AggregationFunction; agregationColumn?: string }) => {
      setDatasetMetadata({
        configuration: {
          ...datasetMetadata.configuration,
          frontend: datasetMetadata.configuration?.frontend ?? {
            sourceFormat: 'GeoTIFF',
            geometryType: 'gridded',
          },
          userFourwingsV1: {
            ...getDatasetConfiguration(datasetMetadata, 'userFourwingsV1'),
            ...patch,
          },
        },
      })
    },
    [datasetMetadata, setDatasetMetadata]
  )

  const onConfirmClick = useCallback(async () => {
    if (!datasetMetadata) {
      return
    }
    setLoading(true)
    let csvFile: File | undefined
    if (rows) {
      const csv = papaparse.unparse(rows)
      csvFile = new File([csv], 'file.csv', { type: 'text/csv' })
    }
    await onConfirm(datasetMetadata, { file: csvFile, isEditing })
    setLoading(false)
  }, [datasetMetadata, isEditing, onConfirm, rows])

  if (processingData) {
    return (
      <div className={styles.processingData}>
        <Spinner className={styles.processingDataSpinner} />
        <p>{t((t) => t.datasetUpload.processingData)}</p>
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
        <FileDropzone label={file?.name} fileTypes={['GeoTIFF']} onFileLoaded={onFileUpdate} />
      )}
      <InputText
        value={datasetMetadata?.name}
        label={t((t) => t.datasetUpload.datasetName)}
        className={styles.input}
        onChange={(e) => setDatasetMetadata({ name: e.target.value })}
        disabled={loading}
      />
      {errors.name && <p className={cx(styles.errorMsg, styles.errorMargin)}>{errors.name}</p>}
      <div className={styles.row}>
        <Select
          label={t((t) => t.datasetUpload.gridded.valueBand)}
          options={bandOptions}
          selectedOption={bandOptions.find((option) => option.id === valueBand)}
          onSelect={(option) => setFourwingsConfig({ agregationColumn: option.id })}
          className={styles.input}
          disabled={loading || !bandOptions.length}
        />
        <Select
          label={t((t) => t.datasetUpload.gridded.aggregation)}
          options={AGGREGATION_OPTIONS}
          selectedOption={AGGREGATION_OPTIONS.find((option) => option.id === agregationMode)}
          onSelect={(option) =>
            setFourwingsConfig({ agregationMode: option.id as AggregationFunction })
          }
          className={styles.input}
          disabled={loading}
        />
      </div>
      <SwitchRow
        className={styles.saveAsPublic}
        label={t((t) => t.dataset.uploadPublic)}
        disabled={isEditing || loading}
        active={isPublic}
        onClick={() => setDatasetMetadata({ public: !isPublic })}
      />
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          <UserGuideLink slug="uploading-data" />
        </div>
        <Button
          className={styles.saveBtn}
          onClick={onConfirmClick}
          disabled={!datasetMetadata || !isValid || (!isEditing && !rows)}
          loading={loading}
          testId="confirm-upload"
        >
          {t((t) => t.common.confirm) as string}
        </Button>
      </div>
    </div>
  )
}

export default NewGriddedDataset
