import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type {
  Column,
  HeaderGroup,
  Hooks,
  Row,
  TableInstance,
  TableOptions,
  TableState,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
  UseRowSelectInstanceProps,
  UseSortByColumnProps,
  UseSortByInstanceProps,
} from 'react-table'
import {
  useExpanded,
  useFlexLayout,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'
import { FixedSizeList } from 'react-window'
import { useParams } from '@tanstack/react-router'
import escapeRegExp from 'lodash/escapeRegExp'
import { matchSorter } from 'match-sorter'

import { GFWAPI } from '@globalfishingwatch/api-client'

import IconArrowDown from '../../assets/icons/arrow-down.svg'
import IconArrowUp from '../../assets/icons/arrow-up.svg'
import IconClose from '../../assets/icons/close.svg'
import IconSearch from '../../assets/icons/search.svg'
import { MAX_DOWNLOAD_FILES_LIMIT } from '../../config'

import styles from './table.module.scss'

export type TableData = {
  name: string
  path: string
  size: number | string
  lastUpdate: string
  subRows?: TableData[]
  [key: string]: any
}

type ExtendedTableState = TableState<TableData> &
  UseGlobalFiltersState<TableData> &
  UseExpandedState<TableData>

type TableInstanceWithHooks = TableInstance<TableData> &
  UseGlobalFiltersInstanceProps<TableData> &
  UseSortByInstanceProps<TableData> &
  UseExpandedInstanceProps<TableData> &
  UseRowSelectInstanceProps<TableData>

type ExtendedHeaderGroup = HeaderGroup<TableData> & UseSortByColumnProps<TableData>

type ExtendedRow = Row<TableData> & UseExpandedRowProps<TableData>

type IndeterminateCheckboxProps = {
  indeterminate?: boolean
  title?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
  ({ indeterminate, title, ...rest }, ref) => {
    const defaultRef = useRef<HTMLInputElement>(null)
    const resolvedRef = (ref || defaultRef) as React.RefObject<HTMLInputElement>
    const inputID = Math.random().toString()

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate || false
      }
    }, [resolvedRef, indeterminate])

    return (
      <div className={styles.checkbox}>
        <input id={inputID} type="checkbox" ref={resolvedRef} {...rest} />
        <label htmlFor={inputID} title={title}>
          {title}
        </label>
      </div>
    )
  }
)

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

function fuzzyTextFilterFn(rows: Row<TableData>[], id: string[], filterValue: string) {
  return matchSorter(rows, filterValue, {
    keys: id.map((i) => `values.${i}`),
    threshold: matchSorter.rankings.CONTAINS,
  })
}

fuzzyTextFilterFn.autoRemove = (val: string | undefined) => !val

type HighlightedCellProps = {
  cell: {
    value: string
  }
  state: ExtendedTableState
}

function HighlightedCell({ cell, state }: HighlightedCellProps) {
  if (!state.globalFilter || !state.globalFilter.trim()) {
    return <span>{cell.value}</span>
  }
  const regex = new RegExp(`(${escapeRegExp(state.globalFilter)})`, 'gi')
  const parts = cell.value.split(regex)
  return (
    <span>
      {parts
        .filter((part) => part)
        .map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
        )}
    </span>
  )
}

type TableProps = {
  columns: Column<TableData>[]
  data: TableData[]
}

function Table({ columns, data }: TableProps) {
  const [searchInput, setSearchInput] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const { datasetId } = useParams({ from: '/datasets/$datasetId' })

  const initialState = {
    sortBy: [{ id: 'lastUpdated', desc: true }],
  }

  const defaultColumn = {
    Cell: HighlightedCell,
  }

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState,
      globalFilter: fuzzyTextFilterFn,
    } as TableOptions<TableData> & UseExpandedOptions<TableData>,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    useFlexLayout,
    useRowSelect,
    (hooks: Hooks<TableData>) => {
      hooks.visibleColumns.push((columns: Column<TableData>[]) => [
        {
          id: 'selection',
          width: 25,
          Header: () => '',
          Cell: ({ row, selectedFlatRows }: any) => {
            const disabled = selectedFlatRows.length >= MAX_DOWNLOAD_FILES_LIMIT && !row.isSelected
            return (
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                disabled={disabled}
                title={disabled ? 'Maximum file download limit reached' : ''}
              />
            )
          },
        },
        ...columns,
      ])
    }
  ) as TableInstanceWithHooks

  const {
    rows,
    state,
    prepareRow,
    headerGroups,
    getTableProps,
    getTableBodyProps,
    selectedFlatRows,
    setGlobalFilter,
  } = tableInstance

  const downloadSingleFile = useCallback(
    (path: string) => {
      if (path) {
        setDownloadLoading(true)
        GFWAPI.fetch<{ url: string }>(`/download/datasets/${datasetId}/download/${path}`)
          .then(({ url }) => {
            const downloadWindow = window.open(url, '_blank')
            if (downloadWindow) {
              downloadWindow.focus()
            }
            setDownloadLoading(false)
          })
          .catch((e) => {
            console.error(e)
            setDownloadLoading(false)
          })
      }
    },
    [datasetId]
  )

  const onDownloadClick = useCallback(() => {
    if (selectedFlatRows.length === 1) {
      const { path } = selectedFlatRows[0].original
      if (path) {
        downloadSingleFile(path)
      }
    } else {
      const files = selectedFlatRows.map((row) => row.original.path)
      setDownloadLoading(true)
      const params = {
        method: 'POST' as const,
        responseType: 'text' as const,
        headers: { 'Content-Type': 'application/json' },
        body: { files },
      }
      GFWAPI.fetch(`/download/datasets/${datasetId}/download-multiple`, params)
        .then(() => {
          setDownloadLoading(false)
        })
        .catch((e) => {
          console.error(e)
          setDownloadLoading(false)
        })
      alert(
        'We are preparing the files you requested, you will receive an email when they are ready'
      )
    }
  }, [datasetId, downloadSingleFile, selectedFlatRows])

  return (
    <div>
      <div {...getTableProps()} className={styles.table}>
        <div className={styles.search}>
          {searchInput ? (
            <Fragment>
              <input
                autoFocus
                className={styles.input}
                value={(state as ExtendedTableState).globalFilter || ''}
                placeholder="Type to filter files"
                onBlur={() => setSearchInput(false)}
                onChange={(e) => {
                  setGlobalFilter(e.target.value || undefined)
                }}
              />
              <button className={styles.button} onClick={() => setSearchInput(false)}>
                <IconClose />
              </button>
            </Fragment>
          ) : (
            <button className={styles.button} onClick={() => setSearchInput(true)}>
              <IconSearch />
            </button>
          )}
        </div>

        <div>
          {headerGroups.map((headerGroup, index) => (
            <div
              {...(headerGroup as ExtendedHeaderGroup).getHeaderGroupProps()}
              key={`${headerGroup.id}-${index}`}
            >
              {headerGroup.headers.map((column) => {
                const extendedColumn = column as ExtendedHeaderGroup
                const sortByProps = extendedColumn.getSortByToggleProps?.() || {}
                return (
                  <div
                    {...column.getHeaderProps(sortByProps)}
                    key={column.id}
                    className={styles.th}
                  >
                    {column.render('Header')}
                    {column.id !== 'selection' && (
                      <span className={styles.sort}>
                        {extendedColumn.isSorted ? (
                          extendedColumn.isSortedDesc ? (
                            <IconArrowDown />
                          ) : (
                            <IconArrowUp />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <FixedSizeList
          height={420}
          width="100%"
          itemSize={40}
          itemCount={rows.length}
          {...getTableBodyProps()}
        >
          {({ index, style }) => {
            const row = rows[index] as ExtendedRow
            prepareRow(row)
            return (
              <div {...row.getRowProps({ style })} key={row.id} className={styles.tr}>
                {row.cells.map((cell) => {
                  return (
                    <div
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className={styles.td}
                      title={cell.value}
                    >
                      {cell.column.id === 'name' ? (
                        <div
                          onClick={() =>
                            row.canExpand
                              ? row.toggleRowExpanded(!row.isExpanded)
                              : downloadSingleFile(cell.row.original.path)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          {cell.render('Cell')}
                        </div>
                      ) : (
                        cell.render('Cell')
                      )}
                    </div>
                  )
                })}
              </div>
            )
          }}
        </FixedSizeList>
      </div>
      <div className={styles.actionFooter}>
        <span className={styles.filesInfo}>
          {rows && <span>{`${rows.length} file${rows.length > 1 ? 's' : ''} shown`}</span>}
          <br />
          {selectedFlatRows.length > 0 && (
            <span>{`${selectedFlatRows.length} file${
              selectedFlatRows.length > 1 ? 's' : ''
            } selected`}</span>
          )}
        </span>
        <button onClick={onDownloadClick} disabled={!selectedFlatRows.length || downloadLoading}>
          Download
        </button>
      </div>
    </div>
  )
}

export default Table
