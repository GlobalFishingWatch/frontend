import React, { Fragment, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { GFWAPI } from '@globalfishingwatch/api-client'

import ApiBanner from '../../components/api-banner/api-banner'
import Loader from '../../components/loader/loader'
import Table from '../../components/table/table'
import { MAX_DOWNLOAD_FILES_LIMIT } from '../../config.js'
import { getUTCString } from '../../utils/dates.js'

import styles from './dataset.module.scss'

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const columns = [
  {
    id: 'name',
    Header: 'Name',
    accessor: (row) => `${row.name} (${formatBytes(row.size)})`,
  },
  {
    id: 'date',
    Header: 'Date',
    accessor: (row) => row.lastUpdate,
  },
]

function DatasetPage() {
  const { datasetId } = useParams()
  const [dataset, setDataset] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const formatDataset = (dataset) => {
      const formatedDataset = {
        ...dataset,
        files: dataset.files.map((file) => ({
          ...file,
          lastUpdate: DateTime.fromISO(file.lastUpdate).toFormat('M/dd/yyyy'),
        })),
      }
      return formatedDataset
    }

    GFWAPI.fetch(`/download/datasets/${datasetId}`)
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
        <div className={styles.twoColumns}>
          <div className={styles.info}>
            <label>Dataset</label>
            <h2 className={styles.title}>{dataset.name}</h2>
            <label>Last Update</label>
            <span>{dataset.lastUpdated ? getUTCString(dataset.lastUpdated) : '---'}</span>
            <label>description</label>
            <div className={styles.description}>
              <Markdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                urlTransform={(value) => value}
              >
                {dataset.readme}
              </Markdown>
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
            {dataset && dataset.files && <Table columns={columns} data={dataset.files} />}
            <ApiBanner />
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default DatasetPage
