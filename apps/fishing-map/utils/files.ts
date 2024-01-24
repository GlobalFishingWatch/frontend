import type { Feature, FeatureCollection } from 'geojson'
import { capitalize, lowerCase } from 'lodash'
import {
  DatasetConfigurationSourceFormat,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'

export function getFileName(file: File): string {
  const name =
    file.name.lastIndexOf('.') > 0 ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name
  return capitalize(lowerCase(name))
}

export type FileType = DatasetConfigurationSourceFormat
export type MimeExtention = '.json' | '.geojson' | '.zip' | '.csv' | '.tsv' | '.kml' | '.kmz'
export type MimeType =
  | 'application/json'
  | 'application/geo+json'
  | 'application/zip'
  | 'text/csv'
  | 'text/comma-separated-values'
  | 'text/tsv'
  | 'text/tab-separated-values'
  | 'application/vnd.google-earth.kml+xml'
  | 'application/vnd.google-earth.kmz'
export const MIME_TYPES_BY_EXTENSION: Record<MimeExtention, MimeType[]> = {
  '.json': ['application/json'],
  '.geojson': ['application/geo+json'],
  '.zip': ['application/zip'],
  '.csv': ['text/csv', 'text/comma-separated-values'],
  '.tsv': ['text/tsv', 'text/tab-separated-values'],
  '.kml': ['application/vnd.google-earth.kml+xml'],
  '.kmz': ['application/vnd.google-earth.kmz'],
}

export type DatasetGeometryTypesSupported = Extract<
  DatasetGeometryType,
  'polygons' | 'tracks' | 'points'
>

export const FILES_TYPES_BY_GEOMETRY_TYPE: Record<DatasetGeometryTypesSupported, FileType[]> = {
  polygons: ['GeoJSON', 'KML', 'Shapefile'],
  tracks: ['CSV', 'GeoJSON', 'KML', 'Shapefile'],
  points: ['CSV', 'GeoJSON', 'KML', 'Shapefile'],
}

export const getFileTypes = (datasetGeometryType: DatasetGeometryTypesSupported) =>
  FILES_TYPES_BY_GEOMETRY_TYPE[datasetGeometryType]

type FileConfig = { id: FileType; files: string[]; icon: string }

export const FILE_TYPES_CONFIG: Record<FileType, FileConfig> = {
  GeoJSON: {
    id: 'GeoJSON',
    files: ['.json', '.geojson'],
    icon: 'geojson',
  },
  Shapefile: { id: 'Shapefile', files: ['.zip'], icon: 'zip' },
  CSV: { id: 'CSV', files: ['.csv', '.tsv'], icon: 'csv' },
  KML: { id: 'KML', files: ['.kml', '.kmz'], icon: 'kml' },
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
      mime.forEach((m) => {
        if (!acc[m]) {
          acc[m] = [extension]
        } else {
          acc[m].push(extension)
        }
      })
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
