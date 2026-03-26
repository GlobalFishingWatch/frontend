import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { DateTime } from 'luxon'

import type { ResponseError } from '@globalfishingwatch/api-client'
import { GFWAPI, isForbidden } from '@globalfishingwatch/api-client'
import type { DownloadDataset } from '@globalfishingwatch/api-types'
import { useGFWLogin } from '@globalfishingwatch/react-hooks'
import { IconButton } from '@globalfishingwatch/ui-components'

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
  const [dataset, setDataset] = useState<(DownloadDataset & { files: TableData[] }) | null>(null)
  const [error, setError] = useState<ResponseError | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const { logged } = useGFWLogin(GFWAPI)

  useEffect(() => {
    setLoading(true)

    const formatDataset = (dataset: DownloadDataset) => {
      const formatedDataset = {
        ...dataset,
        files: buildFileTree(dataset.files || []),
      }
      return formatedDataset
    }

    GFWAPI.fetch<DownloadDataset>(`/download/datasets/${datasetId}`)
      .then((data) => {
        setDataset(formatDataset(data))
      })
      .catch((e) => {
        setError(e)
        console.warn(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [datasetId])

  const readme = dataset?.readme

  if (isForbidden(error)) {
    return (
      <div className={styles.permissions}>
        <Link to={'/'}>
          <IconButton icon="arrow-left" type="border" tooltip="Return to all datasets" />
        </Link>

        <b>
          You don’t have permissions to see this dataset. If you have any questions, please contact
          us at <u>support@globalfishingwatch.org</u>
        </b>
      </div>
    )
  }

  return (
    <Fragment>
      <TopBar>
        <div>
          <label>Dataset</label>
          <h2 className={styles.title}>{dataset?.name || ''}</h2>
        </div>
      </TopBar>
      {loading ? (
        <Loader />
      ) : (
        dataset && (
          <div className={styles.twoColumns}>
            <div className={styles.info}>
              <label>Last Update</label>
              <span>{dataset.lastUpdated ? getUTCString(dataset.lastUpdated) : '---'}</span>
              <label>description</label>
              <div className={styles.description}>
                {readme && <EnhancedMarkdown content={readme} />}
              </div>
            </div>
            <div className={styles.files}>
              {dataset && dataset.files?.length > 0 && (
                <Table columns={columns} data={dataset.files} logged={logged} />
              )}
              <ApiBanner />
            </div>
          </div>
        )
      )}
    </Fragment>
  )
}

export default DatasetPage
