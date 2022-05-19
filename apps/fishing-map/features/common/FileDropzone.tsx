import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { ReactComponent as FilesCsvIcon } from 'assets/icons/file-csv.svg'
import { ReactComponent as FilesJsonIcon } from 'assets/icons/file-json.svg'
import { ReactComponent as FileZipIcon } from 'assets/icons/file-zip.svg'
import { joinTranslatedList } from 'features/i18n/utils'
import styles from './FileDropzone.module.css'

// t('dataset.formats.csv', 'csv')
// t('dataset.formats.geojson', 'geojson')
// t('dataset.formats.shapefile', 'compressed shapefile')

export type FileType = 'geojson' | 'shapefile' | 'csv'

interface FileDropzoneProps {
  fileTypes: FileType[]
  className?: string
  onFileLoaded: (fileInfo: File, type?: DatasetGeometryType) => void
}

type FileConfig = { id: string; files: string[]; icon: JSX.Element }

const MIME_TYPES_BY_EXTENSION = {
  '.json': 'application/json',
  '.geojson': 'application/json',
  '.zip': 'application/zip',
  '.csv': 'text/csv',
}

const FILE_TYPES_CONFIG: Record<FileType, FileConfig> = {
  geojson: {
    id: 'geojson',
    files: ['.json', '.geojson'],
    icon: <FilesJsonIcon key="geojson" />,
  },
  shapefile: { id: 'shapefile', files: ['.zip'], icon: <FileZipIcon key="zip" /> },
  csv: { id: 'csv', files: ['.csv'], icon: <FilesCsvIcon key="csv" /> },
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileLoaded, fileTypes, className = '' }) => {
  const fileTypesConfigs = fileTypes.map((fileType) => FILE_TYPES_CONFIG[fileType])
  console.log(fileTypesConfigs)
  const filesAcceptedExtensions = fileTypesConfigs.flatMap(({ files }) => files)
  const fileAcceptedByMime = filesAcceptedExtensions.reduce((acc, extension) => {
    const mime = MIME_TYPES_BY_EXTENSION[extension]
    if (!acc[mime]) {
      acc[mime] = [extension]
    } else {
      acc[mime].push(extension)
    }
    return acc
  }, {})

  const { t } = useTranslation()
  const onDropAccepted = useCallback(
    (files) => {
      onFileLoaded(files[0])
    },
    [onFileLoaded]
  )
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    accept: fileAcceptedByMime,
    onDropAccepted,
  })

  return (
    <div className={cx(styles.dropFiles, className)} {...(getRootProps() as any)}>
      <div className={styles.icons}>{fileTypesConfigs.map(({ icon }) => icon)}</div>
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
              fileTypesConfigs.map(({ id }) => t(`dataset.formats.${id}` as any, id))
            ),
          })}
        </p>
      )}
      {fileRejections.length > 0 && (
        <p className={cx(styles.fileText, styles.warning)}>
          {t('dataset.onlyFileFormatAllowed', {
            formats: joinTranslatedList(filesAcceptedExtensions),
            defaultValue: '(Only {{formats}} files are allowed)',
          })}
        </p>
      )}
    </div>
  )
}

export default FileDropzone
