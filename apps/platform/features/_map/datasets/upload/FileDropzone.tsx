import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { uniq } from 'es-toolkit'

import type { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import FilesCsvIcon from 'assets/icons/file-csv.svg?react'
import FilesJsonIcon from 'assets/icons/file-json.svg?react'
import FileKMLIcon from 'assets/icons/file-kml.svg?react'
import FileZipIcon from 'assets/icons/file-zip.svg?react'
import { joinTranslatedList } from 'features/i18n/utils'
import type { FileType, MimeExtention } from 'utils/files'
import { FILE_TYPES_CONFIG, getFilesAcceptedByMime } from 'utils/files'

import styles from './FileDropzone.module.css'

// t('dataset.formats.csv')
// t('dataset.formats.geojson')
// t('dataset.formats.shapefile')
// t('dataset.formats.kml')

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
  error?: string
  onFileLoaded: (fileInfo: File, type?: DatasetGeometryType) => void
  onFileCleared?: () => void
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileLoaded,
  fileTypes,
  className = '',
  label,
  error,
  onFileCleared,
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

  const onClearClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      onFileCleared?.()
    },
    [onFileCleared]
  )

  return (
    <div className={cx(styles.dropFiles, className)} {...(getRootProps() as any)}>
      <div className={styles.icons}>
        {uniq(fileTypesConfigs.map((config) => config?.icon)).map((icon) => IconsByType[icon])}
      </div>
      <input {...getInputProps()} />
      {label ? (
        label
      ) : acceptedFiles.length ? (
        <p className={styles.fileText}>
          {t((t) => t.dataset.file)}: {acceptedFiles[0].name}
        </p>
      ) : isDragActive ? (
        <p className={styles.fileText}>{t((t) => t.dataset.dragActive)}</p>
      ) : (
        <p className={styles.fileText}>
          {t((t) => t.dataset.dragFileFormatsPlaceholder, {
            formats: joinTranslatedList(
              fileTypesConfigs.map(({ id }) =>
                t((t) => t.dataset.formats[id.toLowerCase() as keyof typeof t.dataset.formats], {
                  defaultValue: id as string,
                })
              )
            ),
          })}
        </p>
      )}
      {fileRejections.length > 0 && (
        <p className={cx(styles.fileText, styles.warning)}>
          {t((t) => t.dataset.onlyFileFormatAllowed, {
            formats: joinTranslatedList(filesAcceptedExtensions),
          })}
        </p>
      )}
      {error && <p className={cx(styles.fileText, styles.warning)}>{error}</p>}
      {onFileCleared && (
        <IconButton
          icon="delete"
          size="medium"
          type="warning-border"
          className={styles.clearButton}
          tooltip={t((t) => t.vesselGroup.clearFile)}
          onClick={onClearClick}
        />
      )}
    </div>
  )
}

export default FileDropzone
