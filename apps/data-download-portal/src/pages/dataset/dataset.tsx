import { Fragment, useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { DateTime } from 'luxon'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'

import ApiBanner from '../../components/api-banner/api-banner'
import Loader from '../../components/loader/loader'
import EnhancedMarkdown from '../../components/markdown/markdown'
import Table, { type TableData } from '../../components/table/table'
import TopBar from '../../components/topBar/topBar'
import { getUTCString } from '../../utils/dates.js'
import { buildFileTree, formatBytes } from '../../utils/folderConfig'

import styles from './dataset.module.scss'

const columns = [
  {
    id: 'name',
    Header: 'Name',
    accessor: (row: any) => row.name,
    Cell: ({ row }: { row: any }) => (
      <span
        style={{
          paddingLeft: `${row.depth * 1.5}rem`,
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        {row.values.name}
        {row.canExpand && (
          <IconButton
            icon={row.isExpanded ? 'arrow-top' : 'arrow-down'}
            size="small"
            type="invert"
          />
        )}
      </span>
    ),
  },
  {
    id: 'size',
    width: 55,
    Header: 'Size',
    accessor: (row: any) => (Number(row.size) ? formatBytes(row.size) : '--'),
  },
  {
    id: 'date',
    width: 80,
    Header: 'Date',
    accessor: (row: any) =>
      row.lastUpdate ? DateTime.fromISO(row.lastUpdate).toFormat('M/dd/yyyy') : '---',
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
