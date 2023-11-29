import type { Feature, FeatureCollection } from 'geojson'

export const CSV_EXTENSIONS = ['csv', 'tsv', 'dsv']
export const KML_EXTENSIONS = ['kml', 'kmz']
export const ZIP_FILE_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
  'multipart/x-zip',
]

export type FileType = 'geojson' | 'shapefile' | 'csv' | 'kml'
export type MimeExtention = '.json' | '.geojson' | '.zip' | '.csv' | '.kml'
export type MimeType = 'application/json' | 'application/zip' | 'text/csv' | 'application/vnd'

export const MIME_TYPES_BY_EXTENSION: Record<MimeExtention, MimeType> = {
  '.json': 'application/json',
  '.geojson': 'application/json',
  '.zip': 'application/zip',
  '.csv': 'text/csv',
  '.kml': 'application/vnd',
}

type FileConfig = { id: string; files: string[]; icon: string }

export const FILE_TYPES_CONFIG: Record<FileType, FileConfig> = {
  geojson: {
    id: 'geojson',
    files: ['.json', '.geojson'],
    icon: 'geojson',
  },
  shapefile: { id: 'shapefile', files: ['.zip'], icon: 'zip' },
  csv: { id: 'csv', files: ['.csv'], icon: 'csv' },
  kml: { id: 'kml', files: ['.kml'], icon: 'kml' },
}

export function getFileType(file: File): FileType {
  const isZip = ZIP_FILE_TYPES.some((type) => file.type === type)
  const isCSV = CSV_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`))
  const isKML = KML_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`))
  if (isZip) return 'shapefile'
  if (isCSV) return 'csv'
  if (isKML) return 'kml'
  return 'geojson'
}

export function getFilesAcceptedByMime(fileTypes: FileType[]) {
  const fileTypesConfigs = fileTypes.map((fileType) => FILE_TYPES_CONFIG[fileType])
  const filesAcceptedExtensions = fileTypesConfigs.flatMap(({ files }) => files as MimeExtention[])
  const fileAcceptedByMime = filesAcceptedExtensions.reduce(
    (acc, extension) => {
      const mime = MIME_TYPES_BY_EXTENSION[extension]
      if (!acc[mime]) {
        acc[mime] = [extension]
      } else {
        acc[mime].push(extension)
      }
      return acc
    },
    {} as Record<MimeType, MimeExtention[]>
  )
  return fileAcceptedByMime
}

export function readBlobAs(blob: Blob, format: 'text' | 'arrayBuffer'): Promise<string>
export function readBlobAs(blob: Blob, format: 'text' | 'arrayBuffer'): Promise<ArrayBuffer>
export function readBlobAs(blob: Blob, format: 'text' | 'arrayBuffer'): any {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        if (format === 'text') {
          resolve(reader.result as string)
        } else {
          resolve(reader.result as ArrayBuffer)
        }
      } else {
        reject('no reader result')
      }
    }
    if (format === 'text') {
      reader.readAsText(blob)
    } else {
      reader.readAsArrayBuffer(blob)
    }
  })
}

export function getFileFromGeojson(geojson: Feature | FeatureCollection) {
  return new File([JSON.stringify(geojson)], 'file.json', {
    type: 'application/json',
  })
}
