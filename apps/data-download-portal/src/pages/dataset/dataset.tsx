import { Fragment, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useParams } from '@tanstack/react-router'
import { isNumber } from 'lodash'
import { DateTime } from 'luxon'
import type { Heading, Root } from 'mdast'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset, DatasetFile } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'

import ApiBanner from '../../components/api-banner/api-banner'
import Loader from '../../components/loader/loader'
import Table, { type TableData } from '../../components/table/table'
import { MAX_DOWNLOAD_FILES_LIMIT } from '../../config.js'
import { getUTCString } from '../../utils/dates.js'

import styles from './dataset.module.scss'

const remarkCollapseH2: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const styleNode = {
      type: 'html' as const,
      value: `
        <style>
          details summary {
            list-style: none;
            cursor: pointer;
            display: inline-flex;
            justify-content: center;
            align-items: center;
          }
          
          details summary::-webkit-details-marker {
            display: none;
          }
          
          details .custom-arrow {
            transition: transform 0.3s ease;
            display: inline-flex;
            fill: var(--color-primary-blue);
            margin-bottom:1em;
            margin-left: 0.5em;
          }
          
          details[open] .custom-arrow {
            transform: rotate(180deg);
          }
        </style>
      `,
    }
    tree.children.unshift(styleNode)

    let processedUpTo = 0

    visit(tree, 'heading', (node, index, parent) => {
      if (
        !parent ||
        index === undefined ||
        node.type !== 'heading' ||
        node.depth !== 2 ||
        index < processedUpTo
      ) {
        return
      }
      const title = node.children.map((child) => ('value' in child ? child.value : '')).join('')

      parent.children.splice(index, 1, {
        type: 'html',
        value: `<details><summary><h2>${title} </h2><svg class="custom-arrow" width="20" height="20" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M14.54 7.54a.65.65 0 01.988.84l-.068.08-5 5a.65.65 0 01-.84.068l-.08-.068-5-5a.65.65 0 01.84-.988l.08.068L10 12.081l4.54-4.54z" fill-rule="nonzero"/></svg></summary>`,
      })

      let nextH2Index = index + 1
      while (
        nextH2Index < parent.children.length &&
        !(
          parent.children[nextH2Index].type === 'heading' &&
          'depth' in parent.children[nextH2Index] &&
          (parent.children[nextH2Index] as Heading).depth === 2
        )
      ) {
        nextH2Index++
      }

      parent.children.splice(nextH2Index, 0, {
        type: 'html',
        value: `</details>`,
      })

      processedUpTo = nextH2Index + 1

      return nextH2Index
    })
  }
}

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
                remarkPlugins={[remarkCollapseH2, [remarkGfm, { singleTilde: false }]]}
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
            {dataset && dataset.files && (
              <Table columns={columns} data={dataset.files as TableData[]} />
            )}
            <ApiBanner />
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default DatasetPage
