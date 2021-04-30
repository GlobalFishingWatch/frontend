import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { ReactComponent as FilesSupportedPolygonsIcon } from 'assets/icons/files-supported-polygons.svg'
import { ReactComponent as FilesSupportedTracksIcon } from 'assets/icons/files-supported-tracks.svg'
import styles from './NewDataset.module.css'

interface DatasetFileProps {
  type: DatasetGeometryType
  className?: string
  onFileLoaded: (fileInfo: File, type: DatasetGeometryType) => void
}

const ACCEPT_FILES_BY_TYPE: Record<DatasetGeometryType, string> = {
  polygons: '.zip, .json, .geojson',
  tracks: '.csv',
  points: '',
}

const DatasetFile: React.FC<DatasetFileProps> = ({ onFileLoaded, type, className = '' }) => {
  const accept = ACCEPT_FILES_BY_TYPE[type]
  const { t } = useTranslation()
  const onDropAccepted = useCallback(
    (files) => {
      onFileLoaded(files[0], type)
    },
    [onFileLoaded, type]
  )
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    accept,
    onDropAccepted,
  })
  return (
    <div className={cx(styles.dropFiles, className)} {...(getRootProps() as any)}>
      {type === 'polygons' ? <FilesSupportedPolygonsIcon /> : <FilesSupportedTracksIcon />}
      <input {...getInputProps()} />
      {acceptedFiles.length ? (
        <p className={styles.fileText}>
          {t('dataset.file', 'File')}: {acceptedFiles[0].name}
        </p>
      ) : isDragActive ? (
        <p className={styles.fileText}>{t('dataset.dragActive', 'Drop the file here ...')}</p>
      ) : (
        <p className={styles.fileText}>
          {t('dataset.dragFilePlaceholder', {
            defaultValue:
              'Drag and drop a compressed shapefile or geojson here or click to select it',
            interpolation: { escapeValue: false, useRawValueToEscape: true },
          })}
        </p>
      )}
      {fileRejections.length > 0 && (
        <p className={cx(styles.fileText, styles.warning)}>
          {t('dataset.fileNotAllowed', '(Only .zip or .json files are allowed)')}
        </p>
      )}
    </div>
  )
}

export default DatasetFile
