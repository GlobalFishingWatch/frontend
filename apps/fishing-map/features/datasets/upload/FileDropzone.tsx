import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { ReactComponent as FilesCsvIcon } from 'assets/icons/file-csv.svg'
import { ReactComponent as FilesJsonIcon } from 'assets/icons/file-json.svg'
import { ReactComponent as FileZipIcon } from 'assets/icons/file-zip.svg'
import { joinTranslatedList } from 'features/i18n/utils'
import { FILE_TYPES_CONFIG, FileType, MimeExtention, getFilesAcceptedByMime } from 'utils/files'
import styles from './FileDropzone.module.css'

// t('dataset.formats.csv', 'csv')
// t('dataset.formats.geojson', 'geojson')
// t('dataset.formats.shapefile', 'compressed shapefile')

const IconsByType: Record<string, any> = {
  json: <FilesJsonIcon key="json" />,
  csv: <FilesCsvIcon key="csv" />,
  zip: <FileZipIcon key="zip" />,
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
  const filesAcceptedExtensions = fileTypesConfigs.flatMap(({ files }) => files as MimeExtention[])
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
      <div className={styles.icons}>{fileTypesConfigs.map(({ icon }) => IconsByType[icon])}</div>
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
