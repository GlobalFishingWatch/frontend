import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { DatasetGeometryType } from '@globalfishingwatch/api-types'

import FilesCsvIcon from 'assets/icons/file-csv.svg'
import FilesJsonIcon from 'assets/icons/file-json.svg'
import FileKMLIcon from 'assets/icons/file-kml.svg'
import FileZipIcon from 'assets/icons/file-zip.svg'
import { joinTranslatedList } from 'features/i18n/utils'
import type { FileType, MimeExtention } from 'utils/files'
import { FILE_TYPES_CONFIG, getFilesAcceptedByMime } from 'utils/files'

import styles from './FileDropzone.module.css'

// t('dataset.formats.csv', 'csv')
// t('dataset.formats.geojson', 'geojson')
// t('dataset.formats.shapefile', 'compressed shapefile')
// t('dataset.formats.kml', 'KML')

const IconsByType: Record<string, any> = {
  geojson: <FilesJsonIcon key="json" />,
  csv: <FilesCsvIcon key="csv" />,
  zip: <FileZipIcon key="zip" />,
  kml: <FileKMLIcon key="kml" />,
}

interface FileDropzoneProps {
  label?: string
  fileTypes: FileType[]
  className?: string
  onFileLoaded: (fileInfo: File, type?: DatasetGeometryType) => void
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileLoaded,
  fileTypes,
  className = '',
  label,
}) => {
  const fileTypesConfigs = fileTypes.map((fileType) => FILE_TYPES_CONFIG[fileType])
  const filesAcceptedExtensions = fileTypesConfigs.flatMap(
    (config) => config?.files as MimeExtention[]
  )
  const fileAcceptedByMime = getFilesAcceptedByMime(fileTypes)

  const { t } = useTranslation()
  const onDropAccepted = useCallback(
    (files: any) => {
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
      <div className={styles.icons}>
        {fileTypesConfigs.map((config) => IconsByType[config?.icon])}
      </div>
      <input {...getInputProps()} />
      {label ? (
        label
      ) : acceptedFiles.length ? (
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
              fileTypesConfigs.map(({ id }) => t(`dataset.formats.${id}` as any, id as string))
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
