import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { AggregationFunction } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Choice,
  InputText,
  Select,
  Spinner,
  SwitchRow,
} from '@globalfishingwatch/ui-components'

import { getDatasetParsed } from 'features/_map/datasets/upload/datasets-parse.utils'
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
  const [bandsCount, setBandsCount] = useState(0)
  const { datasetMetadata, setDatasetMetadata } = useDatasetMetadata()
  const isEditing = dataset?.id !== undefined
  const isPublic = !!datasetMetadata?.public
  const { isValid, errors } = getDatasetMetadataValidations(datasetMetadata)

  const handleRawData = useCallback(
    async (file: File) => {
      setProcessingData(true)
      try {
        setBandsCount(await getDatasetParsed(file, 'gridded'))
        setDatasetMetadata(getGriddedDatasetMetadata({ name: getFileName(file) }))
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
  const band = fourwingsConfig.band ?? 1
  const bandOptions: SelectOption<number>[] = Array.from({ length: bandsCount }, (_, index) => ({
    id: index + 1,
    label: `${index + 1}`,
  }))

  const setFourwingsConfig = useCallback(
    (patch: { agregationMode?: AggregationFunction; band?: number }) => {
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
    // the raw GeoTIFF is what the API imports — it derives the bbox, stats, cells and resolution
    await onConfirm(datasetMetadata, { file, isEditing })
    setLoading(false)
  }, [datasetMetadata, file, isEditing, onConfirm])

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
        value={datasetMetadata?.name ?? ''}
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
        <InputText
          value={datasetMetadata?.unit ?? ''}
          label={t((t) => t.datasetUpload.gridded.unit)}
          placeholder={t((t) => t.datasetUpload.gridded.unitPlaceholder)}
          className={styles.input}
          onChange={(e) => setDatasetMetadata({ unit: e.target.value })}
          disabled={loading}
        />
      </div>
      {bandOptions.length > 1 && (
        <Select
          label={t((t) => t.datasetUpload.gridded.band)}
          options={bandOptions}
          selectedOption={bandOptions.find((option) => option.id === band)}
          onSelect={(option) => setFourwingsConfig({ band: option.id })}
          className={styles.input}
          disabled={loading || isEditing}
        />
      )}
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
          disabled={!datasetMetadata || !isValid || (!isEditing && !file)}
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
