import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { ReactComponent as FilesSupportedPolygonsIcon } from 'assets/icons/files-supported-polygons.svg'
import { ReactComponent as FilesSupportedTracksIcon } from 'assets/icons/files-supported-tracks.svg'
import styles from './NewDataset.module.css'

interface DatasetFileProps {
  type?: DatasetGeometryType
  className?: string
  onFileLoaded: (fileInfo: File, type?: DatasetGeometryType) => void
}

type DatasetGeometryTypesSupported = Extract<DatasetGeometryType, 'polygons' | 'tracks' | 'points'>

const POLYGONS_ACCEPT = '.zip, .json, .geojson'
const TRACKS_ACCEPT = '.csv'
const ACCEPT_FILES_BY_TYPE: Record<DatasetGeometryTypesSupported, string> = {
  polygons: POLYGONS_ACCEPT,
  tracks: TRACKS_ACCEPT,
  points: POLYGONS_ACCEPT,
}
const TRANSLATIONS_BY_TYPE: Record<DatasetGeometryTypesSupported, string> = {
  polygons: 'dataset.dragFilePlaceholder',
  tracks: 'dataset.dragFilePlaceholderCSV',
  points: '',
}
const ERRORS_BY_TYPE: Record<DatasetGeometryTypesSupported, string> = {
  polygons: 'dataset.onlyZipAndJsonAllowed',
  tracks: 'dataset.onlyCsvAllowed',
  points: '',
}

const DatasetFile: React.FC<DatasetFileProps> = ({ onFileLoaded, type, className = '' }) => {
  const supportedType = type as DatasetGeometryTypesSupported
  const accept = supportedType ? ACCEPT_FILES_BY_TYPE[supportedType] : ACCEPT_FILES_BY_TYPE.polygons
  const translationKey = supportedType
    ? TRANSLATIONS_BY_TYPE[supportedType]
    : TRANSLATIONS_BY_TYPE.polygons
  const filesSupportedIcon =
    accept === POLYGONS_ACCEPT ? <FilesSupportedPolygonsIcon /> : <FilesSupportedTracksIcon />
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
      {filesSupportedIcon}
      <input {...getInputProps()} />
      {acceptedFiles.length ? (
        <p className={styles.fileText}>
          {t('dataset.file', 'File')}: {acceptedFiles[0].name}
        </p>
      ) : isDragActive ? (
        <p className={styles.fileText}>{t('dataset.dragActive', 'Drop the file here ...')}</p>
      ) : (
        <p className={styles.fileText}>
          {t(translationKey as any, {
            defaultValue:
              'Drag and drop a compressed shapefile or geojson here or click to select it',
            interpolation: { escapeValue: false, useRawValueToEscape: true },
          })}
        </p>
      )}
      {fileRejections.length > 0 && (
        <p className={cx(styles.fileText, styles.warning)}>
          {t(
            (ERRORS_BY_TYPE[type as DatasetGeometryTypesSupported] as any) ||
              'dataset.onlyZipAndJsonAllowed',
            '(Only .zip or .json files are allowed)'
          )}
        </p>
      )}
    </div>
  )
}

export default DatasetFile
