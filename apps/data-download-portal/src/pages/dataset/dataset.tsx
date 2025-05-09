import { Fragment, useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { isNumber } from 'lodash'
import { DateTime } from 'luxon'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset, DatasetFile } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import ApiBanner from '../../components/api-banner/api-banner'
import Loader from '../../components/loader/loader'
import EnhancedMarkdown from '../../components/markdown/markdown'
import Table, { type TableData } from '../../components/table/table'
import TopBar from '../../components/topBar/topBar'
import { MAX_DOWNLOAD_FILES_LIMIT } from '../../config.js'
import { getUTCString } from '../../utils/dates.js'

import styles from './dataset.module.scss'

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const insertIntoTree = (
  tree: TableData[],
  parts: string[],
  fullPath: string,
  size: number,
  lastUpdate: string
) => {
  let currentLevel = tree

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const isFolder = i < parts.length - 1 || fullPath.endsWith('/')

    let existing = currentLevel.find((node) => node.name === part)

    if (!existing) {
      const node: TableData = {
        name: part,
        path: parts.slice(0, i + 1).join('/'),
        lastUpdate: lastUpdate ? DateTime.fromISO(lastUpdate).toFormat('M/dd/yyyy') : '---',
        size: size || '-',
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

const buildFileTree = (files: DatasetFile[]): TableData[] => {
  const tree: TableData[] = []

  files.forEach((file) => {
    const cleanPath = file.name.endsWith('/') ? file.name.slice(0, -1) : file.name
    const parts = cleanPath.split('/')

    insertIntoTree(tree, parts, file.name, Number(file.size), file.lastUpdate)
  })

  return tree
}

const columns = [
  {
    id: 'name',
    Header: 'Name',
    accessor: (row: any) => `${row.name}${isNumber(row.size) ? ` (${formatBytes(row.size)})` : ''}`,
    Cell: ({ row }: { row: any }) => (
      <span
        style={{
          paddingLeft: `${row.depth * 1}rem`,
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {`${row.values.name}`}
        {row.canExpand &&
          (row.isExpanded ? (
            <IconButton icon="arrow-top" size="small" type="invert" />
          ) : (
            <IconButton icon="arrow-down" size="small" type="invert" />
          ))}
      </span>
    ),
  },
  {
    id: 'date',
    Header: 'Date',
    accessor: (row: any) => row.lastUpdate,
  },
]

function DatasetPage() {
  const { datasetId } = useParams({ from: '/datasets/$datasetId' })
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const formatDataset = (dataset: Dataset) => {
      const formatedDataset = {
        ...dataset,
        files: buildFileTree(dataset.files || []),
      }
      return formatedDataset
    }

    GFWAPI.fetch<Dataset>(`/download/datasets/${datasetId}`)
      .then((data) => {
        setDataset(formatDataset(data))
        setLoading(false)
      })
      .catch((e) => {
        console.warn(e)
      })
  }, [datasetId])

  return (
    <Fragment>
      {loading && <Loader />}
      {dataset && (
        <>
          <TopBar>
            <div>
              <label>Dataset</label>
              <h2 className={styles.title}>{dataset.name}</h2>
            </div>
          </TopBar>
          <div className={styles.twoColumns}>
            <div className={styles.info}>
              <label>Last Update</label>
              <span>{dataset.lastUpdated ? getUTCString(dataset.lastUpdated) : '---'}</span>
              <label>description</label>
              <div className={styles.description}>
                {dataset.readme && <EnhancedMarkdown content={dataset.readme} />}
              </div>
            </div>
            <div className={styles.files}>
              {/* UNCOMMENT WHEN ALL FILES DOWNLOAD READY */}
              {/* <label>Entire dataset</label>
              <a
                className="btn"
                href={`${API_GATEWAY}/download/datasets/${datasetId}/download-single/all`}
              >
                Download dataset
              </a>
              <br /> */}

              <label>Individual Files (Select up to {MAX_DOWNLOAD_FILES_LIMIT})</label>
              {dataset && dataset.files && (
                <Table columns={columns} data={dataset.files as TableData[]} />
              )}
              <ApiBanner />
            </div>
          </div>
        </>
      )}
    </Fragment>
  )
}

export default DatasetPage
