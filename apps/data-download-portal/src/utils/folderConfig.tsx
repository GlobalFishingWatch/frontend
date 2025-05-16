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
        size: isFolder ? 0 : file.size,
        ...(isFolder ? { subRows: [], updateSize: (size: number) => (node.size = size) } : {}),
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
export function countSelectedFiles(selectedFlatRows: Row<TableData>[]) {
  const countedRowIds = new Set<string>()
  const rowSelectedCount = selectedFlatRows.reduce((count, row) => {
    const original = row.original as TableData
    const countFiles = (rows: TableData[]): number =>
      rows.reduce((acc, r) => {
        if (countedRowIds.has(r.path)) return acc
        countedRowIds.add(r.path)
        if (!r.subRows || r.subRows.length === 0) return acc + 1
        return acc + countFiles(r.subRows)
      }, 0)

    if ((!original.subRows || original.subRows.length === 0) && !countedRowIds.has(original.path)) {
      countedRowIds.add(original.path)
      return count + 1
    }
    if (!original.isExpanded && original.subRows && original.subRows.length > 0) {
      return count + countFiles(original.subRows)
    }
    return count
  }, 0)
  return rowSelectedCount
}

export function prepareTableData(files: DatasetFile[]) {
  return files.map((file) => {
    const parts = file.name.split('/')
    const hasFolder = parts.length > 1

    return {
      ...file,
      folder: hasFolder ? parts[0] : undefined,
    }
  })
}
