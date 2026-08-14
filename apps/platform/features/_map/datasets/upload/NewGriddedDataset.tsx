import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import papaparse from 'papaparse'

import type { AggregationFunction } from '@globalfishingwatch/api-types'
import type { GeotiffRow } from '@globalfishingwatch/data-transforms'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import { Button, Choice, InputText, Spinner, SwitchRow } from '@globalfishingwatch/ui-components'

import { getDatasetParsed } from 'features/_map/datasets/upload/datasets-parse.utils'
import { useDatasetMetadata } from 'features/_map/datasets/upload/datasets-upload.hooks'
import {
  getDatasetMetadataValidations,
  getGriddedBandFilters,
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
  const [rows, setRows] = useState<GeotiffRow[] | undefined>()
  const [bands, setBands] = useState<string[]>([])
  const { datasetMetadata, setDatasetMetadata } = useDatasetMetadata()
  const isEditing = dataset?.id !== undefined
  const isPublic = !!datasetMetadata?.public
  const { isValid, errors } = getDatasetMetadataValidations(datasetMetadata)

  const handleRawData = useCallback(
    async (file: File) => {
      setProcessingData(true)
      try {
        const { rows, bands, resolution, stats } = await getDatasetParsed(file, 'gridded')
        setRows(rows)
        setBands(bands)
        setDatasetMetadata(
          getGriddedDatasetMetadata({ name: getFileName(file), bands, resolution, stats })
        )
        setProcessingData(false)
      } catch (e: any) {
        setProcessingData(false)
        onDatasetParseError(e, setDataParseError)
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
  const agregationMode = fourwingsConfig.agregationMode ?? 'AVG'
  const bandNames = (datasetMetadata?.filters?.fourwings?.[0]?.enum as string[]) ?? bands

  const setBandName = useCallback(
    (index: number, name: string) => {
      setDatasetMetadata({
        filters: getGriddedBandFilters(bandNames.map((band, i) => (i === index ? name : band))),
      })
    },
    [bandNames, setDatasetMetadata]
  )

  const setFourwingsConfig = useCallback(
    (patch: { agregationMode?: AggregationFunction }) => {
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
      const namesById = Object.fromEntries(bands.map((band, index) => [band, bandNames[index]]))
      const csv = papaparse.unparse(rows.map((row) => ({ ...row, band: namesById[row.band] })))
      csvFile = new File([csv], 'file.csv', { type: 'text/csv' })
    }
    await onConfirm(datasetMetadata, { file: csvFile, isEditing })
    setLoading(false)
  }, [bandNames, bands, datasetMetadata, isEditing, onConfirm, rows])

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
        <Choice
          size="medium"
          label={t((t) => t.datasetUpload.gridded.aggregation)}
          options={AGGREGATION_OPTIONS}
          activeOption={AGGREGATION_OPTIONS.find((option) => option.id === agregationMode)?.id}
          onSelect={(option) =>
            setFourwingsConfig({ agregationMode: option.id as AggregationFunction })
          }
          className={styles.input}
          disabled={loading}
        />
      </div>
      {bands.length > 1 &&
        bands.map((band, index) => (
          <InputText
            key={band}
            value={bandNames[index] ?? band}
            label={t((t) => t.datasetUpload.gridded.bandName, { band: index + 1 })}
            className={styles.input}
            onChange={(e) => setBandName(index, e.target.value)}
            disabled={loading}
          />
        ))}
      {errors.bands && <p className={cx(styles.errorMsg, styles.errorMargin)}>{errors.bands}</p>}

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
