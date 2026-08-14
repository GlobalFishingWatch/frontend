import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import Points from 'assets/icons/dataset-type-points.svg?react'
import Gridded from 'assets/icons/dataset-type-polygons.svg?react'
import Polygons from 'assets/icons/dataset-type-polygons-lines.svg?react'
import Tracks from 'assets/icons/dataset-type-tracks.svg?react'
import { useDatasetModalConfigConnect } from 'features/_map/datasets/datasets.hook'
import type { DatasetUploadStyle } from 'features/modals/modals.slice'
import type { DatasetGeometryTypesSupported } from 'utils/files'
import { getFilesAcceptedByMime, getFileTypes } from 'utils/files'

import styles from './DatasetTypeSelect.module.css'

const DatasetType = ({
  type,
  title,
  description,
  style = 'default',
  icon,
  onFileLoaded,
  testId,
}: {
  type: DatasetGeometryTypesSupported
  title: string
  description: string
  style?: DatasetUploadStyle
  icon: ReactElement<any, any>
  onFileLoaded: (file: File) => void
  testId?: string
}) => {
  const { t } = useTranslation()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()

  const onDropAccepted = useCallback(
    (files: File[]) => {
      onFileLoaded(files[0])
      dispatchDatasetModalConfig({ type })
    },
    [dispatchDatasetModalConfig, type, onFileLoaded]
  )
  const onDropRejected = useCallback(() => {
    dispatchDatasetModalConfig({ fileRejected: true })
  }, [dispatchDatasetModalConfig])

  const fileTypes = getFileTypes(type)
  const fileAcceptedByMime = getFilesAcceptedByMime(fileTypes)

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: fileAcceptedByMime,
    onDropAccepted,
    onDropRejected,
  })

  const dragError = isDragActive && isDragReject

  return (
    <div
      className={cx(styles.geometryTypeContainer, styles[style], {
        [styles.current]: isDragActive && !dragError,
        [styles.error]: dragError,
      })}
      {...(getRootProps() as any)}
    >
      {icon}
      <input {...getInputProps()} data-testid={testId} />
      {isDragActive ? (
        dragError ? (
          <div className={styles.textContainer}>
            <p>{t((t) => t.dataset.dragNotAccepted)}</p>
          </div>
        ) : (
          <div className={styles.textContainer}>
            <p>{t((t) => t.dataset.dragActive)}</p>
          </div>
        )
      ) : (
        <div className={styles.textContainer}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>

          <div className={styles.textContainer}>
            {fileRejections.length > 0 ? (
              <p className={cx(styles.description, styles.errorMessage)}>
                {t((t) => t.dataset.dragNotAccepted)}
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
        testId="polygons-file-input"
        type="polygons"
        title={t((t) => t.dataset.typePolygons)}
        style={style}
        description={t((t) => t.dataset.typePolygonsDescription)}
        onFileLoaded={onFileLoaded}
        icon={<Polygons />}
      />
      <DatasetType
        testId="tracks-file-input"
        type="tracks"
        title={t((t) => t.dataset.typeTracks)}
        style={style}
        description={t((t) => t.dataset.typeTracksDescription)}
        icon={<Tracks />}
        onFileLoaded={onFileLoaded}
      />
      <DatasetType
        testId="points-file-input"
        type="points"
        title={t((t) => t.dataset.typePoints)}
        style={style}
        description={t((t) => t.dataset.typePointsDescription)}
        icon={<Points />}
        onFileLoaded={onFileLoaded}
      />
      <DatasetType
        testId="gridded-file-input"
        type="gridded"
        title={t((t) => t.dataset.typeGridded)}
        style={style}
        description={t((t) => t.dataset.typeGriddedDescription)}
        icon={<Gridded />}
        onFileLoaded={onFileLoaded}
      />
    </div>
  )
}

export default DatasetTypeSelect
