import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { ReactComponent as FilesSupportedPolygonsIcon } from 'assets/icons/files-supported-polygons.svg'
import { ReactComponent as FilesSupportedTracksIcon } from 'assets/icons/files-supported-tracks.svg'
import { joinTranslatedList } from 'features/i18n/utils'
import styles from './NewDataset.module.css'

// t('dataset.formats.csv', 'csv')
// t('dataset.formats.geojson', 'geojson')
// t('dataset.formats.shapefile', 'compressed shapefile')

interface DatasetFileProps {
  type?: DatasetGeometryType
  className?: string
  onFileLoaded: (fileInfo: File, type?: DatasetGeometryType) => void
}

type DatasetGeometryTypesSupported = Extract<DatasetGeometryType, 'polygons' | 'tracks' | 'points'>

const CSV_TYPES = { id: 'csv', files: ['.csv'] }
const GEOJSON_TYPES = { id: 'geojson', files: ['.json', '.geojson'] }
const SHAPEFILE_TYPE = { id: 'shapefile', files: ['.zip'] }

const ACCEPT_FILES_BY_TYPE: Record<DatasetGeometryTypesSupported, string> = {
  polygons: [...SHAPEFILE_TYPE.files, ...GEOJSON_TYPES.files].join(', '),
  tracks: CSV_TYPES.files.join(','),
  points: [...SHAPEFILE_TYPE.files, ...GEOJSON_TYPES.files, ...CSV_TYPES.files].join(', '),
}
const ACCEPT_LABELS_BY_TYPE: Record<DatasetGeometryTypesSupported, string[]> = {
  polygons: [SHAPEFILE_TYPE.id, GEOJSON_TYPES.id],
  tracks: [CSV_TYPES.id],
  points: [SHAPEFILE_TYPE.id, GEOJSON_TYPES.id, CSV_TYPES.id],
}

const ACCEPT_ICON_BY_TYPE: Record<DatasetGeometryTypesSupported, JSX.Element> = {
  polygons: <FilesSupportedPolygonsIcon />,
  tracks: <FilesSupportedTracksIcon />,
  points: (
    <div className={styles.icons}>
      <FilesSupportedPolygonsIcon />
      <FilesSupportedTracksIcon />
    </div>
  ),
}
const DatasetFile: React.FC<DatasetFileProps> = ({ onFileLoaded, type, className = '' }) => {
  const supportedType = type as DatasetGeometryTypesSupported
  const formatsAccepted = supportedType
    ? ACCEPT_FILES_BY_TYPE[supportedType]
    : ACCEPT_FILES_BY_TYPE.polygons
  const formatsAcceptedLabels = supportedType
    ? ACCEPT_LABELS_BY_TYPE[supportedType]
    : ACCEPT_LABELS_BY_TYPE.polygons
  const formatsAcceptedIcons = supportedType
    ? ACCEPT_ICON_BY_TYPE[supportedType]
    : ACCEPT_FILES_BY_TYPE.polygons
  const { t } = useTranslation()
  const onDropAccepted = useCallback(
    (files) => {
      onFileLoaded(files[0], type)
    },
    [onFileLoaded, type]
  )
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    accept: formatsAccepted,
    onDropAccepted,
  })

  return (
    <div className={cx(styles.dropFiles, className)} {...(getRootProps() as any)}>
      {formatsAcceptedIcons}
      <input {...getInputProps()} />
      {acceptedFiles.length ? (
        <p className={styles.fileText}>
          {t('dataset.file', 'File')}: {acceptedFiles[0].name}
        </p>
      ) : isDragActive ? (
        <p className={styles.fileText}>{t('dataset.dragActive', 'Drop the file here ...')}</p>
      ) : (
        <p className={styles.fileText}>
          {t('dataset.dragFileFormatsPlaceholder', {
            defaultValue: 'Drag and drop a {{formats}} here or click to select it',
            formats: joinTranslatedList(
              formatsAcceptedLabels.map((f) => t(`dataset.formats.${f}` as any, f))
            ),
          })}
        </p>
      )}
      {fileRejections.length > 0 && (
        <p className={cx(styles.fileText, styles.warning)}>
          {t('dataset.onlyFileFormatAllowed', {
            formats: formatsAccepted,
            defaultValue: '(Only {{formats}} files are allowed)',
          })}
        </p>
      )}
    </div>
  )
}

export default DatasetFile
