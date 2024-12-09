import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import type { DatasetGeometryType } from '@globalfishingwatch/api-types'
import FilesCsvIcon from 'assets/icons/file-csv.svg'
import FilesJsonIcon from 'assets/icons/file-json.svg'
import FileZipIcon from 'assets/icons/file-zip.svg'
import styles from './FileDropzone.module.css'

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
  const filesAcceptedExtensions = fileTypesConfigs.flatMap((config) => config?.files)
  const fileAcceptedByMime = filesAcceptedExtensions.reduce((acc, extension) => {
    const mime = MIME_TYPES_BY_EXTENSION[extension]
    if (!acc[mime]) {
      acc[mime] = [extension]
    } else {
      acc[mime].push(extension)
    }
    return acc
  }, {})

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
    <div className={cx(styles.container)}>
      <label>New dataset</label>
      <div className={cx(styles.dropFiles, className)} {...(getRootProps() as any)}>
        <div className={styles.icons}>{fileTypesConfigs.map(({ icon }) => icon)}</div>
        <input {...getInputProps()} />
        {acceptedFiles.length ? (
          <p className={styles.fileText}>{`File: ${acceptedFiles[0].name}`}</p>
        ) : isDragActive ? (
          <p className={styles.fileText}>Drop the file here ...</p>
        ) : (
          <p className={styles.fileText}>
            {`Drag and drop a ${fileTypesConfigs
              .map(({ id }) => id)
              .join(', ')} here or click to select it`}
          </p>
        )}
        {fileRejections.length > 0 && (
          <p className={cx(styles.fileText, styles.warning)}>
            {`(Only ${filesAcceptedExtensions.join(', ')} files are allowed)`}
          </p>
        )}
      </div>
    </div>
  )
}

export default FileDropzone
