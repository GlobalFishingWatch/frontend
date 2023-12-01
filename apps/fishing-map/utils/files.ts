import type { Feature, FeatureCollection } from 'geojson'
import { capitalize, lowerCase } from 'lodash'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'

export function getFileName(file: File): string {
  const name =
    file.name.lastIndexOf('.') > 0 ? file.name.substr(0, file.name.lastIndexOf('.')) : file.name
  return capitalize(lowerCase(name))
}

export type FileType = 'geojson' | 'shapefile' | 'csv' | 'kml'
export type MimeExtention =
  | '.json'
  | '.geojson'
  | '.zip'
  | '.csv'
  | '.dsv'
  | '.tsv'
  | '.kml'
  | '.kmz'
export type MimeType =
  | 'application/json'
  | 'application/zip'
  | 'text/csv'
  | 'text/dsv'
  | 'text/tsv'
  | 'application/vnd'

export type DatasetGeometryTypesSupported = Extract<
  DatasetGeometryType,
  'polygons' | 'tracks' | 'points'
>

export const FILES_TYPES_BY_GEOMETRY_TYPE: Record<DatasetGeometryTypesSupported, FileType[]> = {
  polygons: ['geojson', 'kml', 'shapefile'],
  tracks: ['csv', 'geojson', 'kml', 'shapefile'],
  points: ['csv', 'geojson', 'kml', 'shapefile'],
}

export const getFileTypes = (datasetGeometryType: DatasetGeometryTypesSupported) =>
  FILES_TYPES_BY_GEOMETRY_TYPE[datasetGeometryType || ('polygons' as DatasetGeometryTypesSupported)]

export const MIME_TYPES_BY_EXTENSION: Record<MimeExtention, MimeType> = {
  '.json': 'application/json',
  '.geojson': 'application/json',
  '.zip': 'application/zip',
  '.csv': 'text/csv',
  '.dsv': 'text/dsv',
  '.tsv': 'text/tsv',
  '.kml': 'application/vnd',
  '.kmz': 'application/vnd',
}

type FileConfig = { id: FileType; files: string[]; icon: string }

export const FILE_TYPES_CONFIG: Record<FileType, FileConfig> = {
  geojson: {
    id: 'geojson',
    files: ['.json', '.geojson'],
    icon: 'geojson',
  },
  shapefile: { id: 'shapefile', files: ['.zip'], icon: 'zip' },
  csv: { id: 'csv', files: ['.csv', '.tsv', '.dsv'], icon: 'csv' },
  kml: { id: 'kml', files: ['.kml', '.kmz'], icon: 'kml' },
}

export function getFileType(file?: File) {
  if (!file) {
    return undefined
  }
  return Object.values(FILE_TYPES_CONFIG).find(({ files }) => {
    return files.some((ext) => file.name.endsWith(ext))
  })?.id
}

export function getFilesAcceptedByMime(fileTypes: FileType[]) {
  const fileTypesConfigs = fileTypes.map((fileType) => FILE_TYPES_CONFIG[fileType])
  const filesAcceptedExtensions = fileTypesConfigs.flatMap(
    (config) => config?.files as MimeExtention[]
  )
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
