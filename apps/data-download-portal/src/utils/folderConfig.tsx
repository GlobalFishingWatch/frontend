import type { Row } from 'react-table'

import type { DatasetFile } from '@globalfishingwatch/api-types'

import type { TableData } from '../components/table/table'

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const insertIntoTree = (tree: TableData[], file: DatasetFile) => {
  let currentLevel = tree
  const cleanPath = file.name.endsWith('/') ? file.name.slice(0, -1) : file.name
  const parts = cleanPath.split('/')

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const isFolder = i < parts.length - 1 || file.name.endsWith('/')

    let existing = currentLevel.find((node) => node.name === part)

    if (!existing) {
      const node: TableData = {
        ...file,
        name: part,
        ...(isFolder && { size: '--' }),
        ...(isFolder ? { subRows: [] } : {}),
      }

      currentLevel.push(node)
      existing = node
    }

    if (existing.subRows) {
      currentLevel = existing.subRows!
    }
  }
}

export const buildFileTree = (files: DatasetFile[]): TableData[] => {
  const tree: TableData[] = []
  files.forEach((file) => {
    insertIntoTree(tree, file)
  })

  return tree
}

// Count the total number of selected files (not folders), including files in collapsed folders if the folder is selected
// Count selected files, but avoid double-counting files that are descendants of other selected rows
export function getFlattenedFiles(selectedFlatRows: Row<TableData>[]) {
  const flattenedFiles: TableData[] = []
  const processedPaths = new Set<string>()

  const processRow = (row: Row<TableData>) => {
    const original = row.original as TableData

    if (
      (!original.subRows || original.subRows.length === 0) &&
      !processedPaths.has(original.path)
    ) {
      processedPaths.add(original.path)
      flattenedFiles.push(original)
    } else if (original.subRows && original.subRows.length > 0) {
      original.subRows.forEach((subRow) => {
        if (!processedPaths.has(subRow.path)) {
          if (!subRow.subRows || subRow.subRows.length === 0) {
            processedPaths.add(subRow.path)
            flattenedFiles.push(subRow)
          } else {
            processRow({ original: subRow } as Row<TableData>)
          }
        }
      })
    }
  }

  selectedFlatRows.forEach(processRow)
  return flattenedFiles
}
