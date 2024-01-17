import { useState, useCallback, Fragment, SetStateAction, Dispatch } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button, Modal } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetGeometryType } from '@globalfishingwatch/api-types'
import { ROOT_DOM_ELEMENT, SUPPORT_EMAIL } from 'data/config'
import { selectLocationType } from 'routes/routes.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import NewPolygonDataset from 'features/datasets/upload/NewPolygonDataset'
import NewPointsDataset from 'features/datasets/upload/NewPointsDataset'
import NewTrackDataset from 'features/datasets/upload/NewTrackDataset'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { DatasetUploadStyle } from 'features/modals/modals.slice'
import { RegisterOrLoginToUpload } from 'features/workspace/user/UserSection'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { FileType } from 'utils/files'
import {
  useDatasetsAPI,
  useDatasetModalOpenConnect,
  useAddDataviewFromDatasetToWorkspace,
  useDatasetModalConfigConnect,
} from '../datasets.hook'
// import DatasetConfig, { extractPropertiesFromGeojson } from '../DatasetConfig'
import DatasetTypeSelect from './DatasetTypeSelect'
import styles from './NewDataset.module.css'

type OnConfirmParams = { isEditing: boolean; file?: File }
export type NewDatasetProps = {
  file?: File
  dataset?: Dataset
  style?: DatasetUploadStyle
  onFileUpdate: (file: File) => void
  onConfirm: (datasetMetadata: DatasetMetadata, { isEditing, file }: OnConfirmParams) => void
  onDatasetParseError: (
    error: any,
    fileType: FileType | undefined,
    errorHandleCallback: Dispatch<SetStateAction<string>>
  ) => void
}

export type DatasetMetadata = Partial<
  Pick<
    Dataset,
    | 'id'
    | 'name'
    | 'description'
    | 'type'
    | 'schema'
    | 'category'
    | 'configuration'
    | 'fieldsAllowed'
  >
> & { public: boolean }

function NewDataset() {
  const { t } = useTranslation()
  const [isGuestUserDismissVisible, setIsGuestUserDismissVisible] = useState(false)
  const { datasetModalOpen, dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { type, style, id, fileRejected, dispatchDatasetModalConfig } =
    useDatasetModalConfigConnect()
  const dataset = useSelector(selectDatasetById(id as string))
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()
  const [rawFile, setRawFile] = useState<File | undefined>()
  const isGuestUser = useSelector(selectIsGuestUser)
  const [error, setError] = useState('')
  const locationType = useSelector(selectLocationType)
  const { dispatchUpsertDataset } = useDatasetsAPI()

  const isDatasetEdit = dataset !== undefined

  const onFileLoaded = useCallback(async (file: File) => {
    setRawFile(file)
  }, [])

  const onClose = useCallback(() => {
    setError('')
    dispatchDatasetModalOpen(false)
    dispatchDatasetModalConfig({
      id: undefined,
      type: undefined,
      style: 'default',
      fileRejected: false,
    })
  }, [dispatchDatasetModalConfig, dispatchDatasetModalOpen])

  const onConfirmClick: NewDatasetProps['onConfirm'] = useCallback(
    async (datasetMetadata, { file, isEditing } = {} as OnConfirmParams) => {
      if (datasetMetadata) {
        const { payload, error: createDatasetError } = await dispatchUpsertDataset({
          dataset: {
            ...datasetMetadata,
            unit: 'TBD',
            subcategory: 'info',
          },
          file,
          createAsPublic: datasetMetadata?.public ?? true,
        })

        if (createDatasetError) {
          setError(
            `${t('errors.generic', 'Something went wrong, try again or contact:')} ${SUPPORT_EMAIL}`
          )
        } else if (payload) {
          if (locationType === 'HOME' || locationType === 'WORKSPACE') {
            const dataset = { ...payload }
            if (!isEditing) {
              addDataviewFromDatasetToWorkspace(dataset)
            }
          }
          onClose()
        }
        trackEvent({
          category: TrackCategory.User,
          action: `Confirm ${datasetMetadata.configuration?.geometryType} upload`,
          label: datasetMetadata?.name,
        })
        return payload
      }
    },
    [addDataviewFromDatasetToWorkspace, dispatchUpsertDataset, locationType, onClose, t]
  )

  const onDatasetParseError: NewDatasetProps['onDatasetParseError'] = useCallback(
    (error, fileType, errorHandleCallback) => {
      if (fileType === 'Shapefile') {
        errorHandleCallback(
          t('error.uploadShapefile', {
            error: error?.message,
            defaultValue: `Error reading shapefile: ${error?.message}`,
          })
        )
      } else if (fileType === 'CSV') {
        errorHandleCallback(
          t('error.uploadCsv', {
            error: error?.message,
            defaultValue: `Error reading CSV file: ${error?.message}`,
          })
        )
      } else if (fileType === 'GeoJSON') {
        errorHandleCallback(
          t('error.uploadGeojson', {
            error: error?.message,
            defaultValue: `Error reading GeoJSON file: ${error?.message}`,
          })
        )
      } else if (fileType === 'KML') {
        errorHandleCallback(
          t('error.uploadKML', {
            error: error?.message,
            defaultValue: `Error reading KML file: ${error?.message}`,
          })
        )
      } else {
        errorHandleCallback(t('error.uploadKML', 'There was an error uploading your dataset'))
      }
    },
    [t]
  )

  const getDatasetComponentByType = useCallback(
    (type: DatasetGeometryType) => {
      const DatasetComponent = {
        polygons: NewPolygonDataset,
        points: NewPointsDataset,
        tracks: NewTrackDataset,
      }[type as Exclude<DatasetGeometryType, 'draw'>]
      return (
        <DatasetComponent
          file={rawFile}
          dataset={dataset}
          onConfirm={onConfirmClick}
          onFileUpdate={onFileLoaded}
          onDatasetParseError={onDatasetParseError}
        />
      )
    },
    [dataset, onConfirmClick, onDatasetParseError, onFileLoaded, rawFile]
  )

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={
        isDatasetEdit
          ? t('dataset.edit', 'Edit dataset')
          : t('dataset.uploadNew', 'Upload new dataset')
      }
      isOpen={datasetModalOpen}
      contentClassName={cx(styles.modalContainer, {
        [styles.fullheight]: isGuestUser,
      })}
      header={style !== 'transparent'}
      className={style === 'transparent' ? styles.transparentOverlay : undefined}
      fullScreen={style === 'transparent'}
      onClose={onClose}
    >
      {isGuestUser ? (
        <div
          className={styles.placeholder}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsGuestUserDismissVisible(true)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <p className={styles.instructions}>
            <RegisterOrLoginToUpload />
          </p>
          {isGuestUserDismissVisible && (
            <Button onClick={onClose} className={styles.dismiss}>
              {t('common.dismiss', 'Dismiss')}
            </Button>
          )}
        </div>
      ) : type && (rawFile || dataset) ? (
        <div className={styles.modalContent}>{getDatasetComponentByType(type)}</div>
      ) : (
        <Fragment>
          <p className={styles.instructions}>
            {style !== 'transparent'
              ? t(
                  'dataset.dragAndDropFileToCreateDataset',
                  'Drag and drop a file in one of the boxes or click on them to upload your dataset'
                )
              : t(
                  'dataset.dropFileToCreateDataset',
                  'Drop your file in one of the boxes to upload your dataset'
                )}
          </p>
          <div className={styles.modalContent}>
            <DatasetTypeSelect style={style} onFileLoaded={onFileLoaded} />
          </div>
          {style === 'transparent' && fileRejected && (
            <Button onClick={onClose} className={styles.dismiss}>
              {t('common.dismiss', 'Dismiss')}
            </Button>
          )}
        </Fragment>
      )}
    </Modal>
  )
}

export default NewDataset
