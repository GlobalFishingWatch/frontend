import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import type { FileRejection } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import Points from 'assets/icons/dataset-type-points.svg'
import Polygons from 'assets/icons/dataset-type-polygons-lines.svg'
import Tracks from 'assets/icons/dataset-type-tracks.svg'
import { useDatasetModalConfigConnect } from 'features/datasets/datasets.hook'
import type { DatasetUploadStyle } from 'features/modals/modals.slice'
import type { DatasetGeometryTypesSupported } from 'utils/files'
import { getFilesAcceptedByMime,getFileTypes } from 'utils/files'

import styles from './DatasetTypeSelect.module.css'

const DatasetType = ({
  type,
  title,
  description,
  style = 'default',
  icon,
  onFileLoaded,
}: {
  type: DatasetGeometryTypesSupported
  title: string
  description: string
  style?: DatasetUploadStyle
  icon: ReactElement<any, any>
  onFileLoaded: (file: File) => void
}) => {
  const { t } = useTranslation()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()
  // Needed because browsers don't recognise all MIME types
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  const [fileTypeEmpty, setFileTypeEmpty] = useState(false)

  const onDropAccepted = useCallback(
    (files: File[]) => {
      onFileLoaded(files[0])
      dispatchDatasetModalConfig({ type })
    },
    [dispatchDatasetModalConfig, type, onFileLoaded]
  )
  const onDropRejected = useCallback(
    (files: FileRejection[]) => {
      dispatchDatasetModalConfig({ fileRejected: true })
    },
    [dispatchDatasetModalConfig]
  )

  const fileTypes = getFileTypes(type)
  const fileAcceptedByMime = getFilesAcceptedByMime(fileTypes)

  const isFileTypeEmpty = (file: File) => {
    if (file.type === '') {
      setFileTypeEmpty(true)
    }
    return null
  }

  const { getRootProps, getInputProps, isDragActive, isDragAccept, fileRejections } = useDropzone({
    accept: fileAcceptedByMime,
    validator: isFileTypeEmpty,
    onDropAccepted,
    onDropRejected,
  })

  const dragError = isDragActive && !isDragAccept && !fileTypeEmpty

  return (
    <div
      className={cx(styles.geometryTypeContainer, styles[style], {
        [styles.current]: isDragActive && !dragError,
        [styles.error]: dragError,
      })}
      {...(getRootProps() as any)}
    >
      {icon}
      <input {...getInputProps()} />
      {isDragActive ? (
        dragError ? (
          <div className={styles.textContainer}>
            <p>
              {t(
                'dataset.dragNotAccepted',
                'This file is not compatible with this type of dataset.'
              )}
            </p>
          </div>
        ) : (
          <div className={styles.textContainer}>
            <p>{t('dataset.dragActive', 'Drop the file here ...')}</p>
          </div>
        )
      ) : (
        <div className={styles.textContainer}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>

          <div className={styles.textContainer}>
            {fileRejections.length > 0 ? (
              <p className={cx(styles.description, styles.errorMessage)}>
                {t(
                  'dataset.dragNotAccepted',
                  'This file is not compatible with this type of dataset.'
                )}
              </p>
            ) : (
              <p className={styles.fileTypes}>{fileTypes.join(', ')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const DatasetTypeSelect = ({
  style,
  onFileLoaded,
}: {
  style?: DatasetUploadStyle
  onFileLoaded: (file: File) => void
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.wrapper}>
      <DatasetType
        type="polygons"
        title={t('dataset.typePolygons', 'Polygons')}
        style={style}
        description={t(
          'dataset.typePolygonsDescription',
          'Display one or multiple areas coloured by any quantitative value in your dataset.'
        )}
        onFileLoaded={onFileLoaded}
        icon={<Polygons />}
      />
      <DatasetType
        type="tracks"
        title={t('dataset.typeTracks', 'Tracks')}
        style={style}
        description={t(
          'dataset.typeTracksDescription',
          'Display the movement of one or multiple animals or vessels.'
        )}
        icon={<Tracks />}
        onFileLoaded={onFileLoaded}
      />
      <DatasetType
        type="points"
        title={t('dataset.typePoints', 'Points')}
        style={style}
        description={t(
          'dataset.typePointsDescription',
          'Display one or multiple positions sized by any quantitative value in your dataset.'
        )}
        icon={<Points />}
        onFileLoaded={onFileLoaded}
      />
    </div>
  )
}

export default DatasetTypeSelect
