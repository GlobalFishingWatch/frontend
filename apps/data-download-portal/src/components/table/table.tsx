import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsState,
  UseRowSelectInstanceProps,
  UseSortByColumnProps,
  UseSortByInstanceProps,
} from 'react-table'
import {
  useExpanded,
  useFlexLayout,
  useGlobalFilter,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'
import { FixedSizeList } from 'react-window'
import { useParams } from '@tanstack/react-router'
import escapeRegExp from 'lodash/escapeRegExp'

import { GFWAPI } from '@globalfishingwatch/api-client'

import IconArrowDown from '../../assets/icons/arrow-down.svg'
import IconArrowUp from '../../assets/icons/arrow-up.svg'
import IconClose from '../../assets/icons/close.svg'
import IconSearch from '../../assets/icons/search.svg'
import { countSelectedFiles, getFlattenedFiles } from '../../utils/folderConfig'

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
  UseExpandedState<TableData> &
  UseResizeColumnsState<TableData>

type TableInstanceWithHooks = TableInstance<TableData> &
  UseGlobalFiltersInstanceProps<TableData> &
  UseSortByInstanceProps<TableData> &
  UseExpandedInstanceProps<TableData> &
  UseRowSelectInstanceProps<TableData>

type ExtendedHeaderGroup = HeaderGroup<TableData> &
  UseSortByColumnProps<TableData> &
  UseResizeColumnsColumnProps<TableData>

type ExtendedRow = Row<TableData> & UseExpandedRowProps<TableData> & { isSelected: boolean }

type IndeterminateCheckboxProps = {
  indeterminate?: boolean
  title?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
  ({ indeterminate, ...rest }, ref) => {
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
        <label htmlFor={inputID}></label>
      </div>
    )
  }
)

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

function fuzzyTextFilterFn(rows: Row<TableData>[], id: string[], filterValue: string) {
  const allRows: Row<TableData>[] = []

  function collectAllRows(rows: Row<TableData>[]) {
    for (const row of rows) {
      allRows.push(row)
      if (row.subRows && row.subRows.length > 0) {
        collectAllRows(row.subRows)
      }
    }
  }

  collectAllRows(rows)

  if (!filterValue || !filterValue.trim()) {
    return rows
  }

  const normalizedFilterValue = filterValue.trim().toLowerCase()

  function rowMatches(row: Row<TableData>, parentRow?: Row<TableData>): boolean {
    return (
      Object.values(row.values).some(
        (cellValue) =>
          typeof cellValue === 'string' && cellValue.toLowerCase().includes(normalizedFilterValue)
      ) ||
      (row.subRows && row.subRows.some((subRow) => rowMatches(subRow, row))) ||
      (parentRow ? rowMatches(parentRow) : false)
    )
  }

  return rows.filter((row) => {
    const parentRow = allRows.find(({ subRows }) => subRows && subRows.includes(row))
    return rowMatches(row, parentRow)
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
  logged: boolean
}

function Table({ columns, data, logged }: TableProps) {
  const [searchInput, setSearchInput] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const { datasetId } = useParams({ from: '/datasets/$datasetId' })

  const initialState = {
    sortBy: [{ id: 'lastUpdated', desc: true }],
  }

  const defaultColumn = useMemo(
    () => ({
      width: 150,
      Cell: HighlightedCell,
    }),
    []
  )

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState,
      globalFilter: fuzzyTextFilterFn,
    } as TableOptions<TableData> &
      UseExpandedOptions<TableData> &
      UseResizeColumnsColumnOptions<TableData>,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    useFlexLayout,
    useRowSelect,
    useResizeColumns,
    (hooks: Hooks<TableData>) => {
      hooks.visibleColumns.push((columns: Column<TableData>[]) => [
        {
          id: 'selection',
          width: 20,
          Header: () => '',
          Cell: ({ row }: any) => {
            return <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          },
        },
        ...columns,
      ])
    }
  ) as TableInstanceWithHooks

  const {
    rows,
    flatRows,
    state,
    prepareRow,
    headerGroups,
    getTableProps,
    getTableBodyProps,
    setGlobalFilter,
  } = tableInstance

  const selectedRows = flatRows.filter((row: Row<TableData>) => (row as ExtendedRow).isSelected)

  const downloadSingleFile = useCallback(
    (path: string) => {
      if (path) {
        setDownloadLoading(true)
        GFWAPI.fetch<{ url: string }>(`/download/datasets/${datasetId}/download?file-path=${path}`)
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
    const selectedFlatRows = getFlattenedFiles(selectedRows)

    if (selectedFlatRows.length === 1) {
      const { path } = selectedFlatRows[0]
      if (path) {
        downloadSingleFile(path)
      }
    } else {
      const files = selectedFlatRows.map((row) => row.path)
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
  }, [datasetId, downloadSingleFile, flatRows])

  const rowSelectedCount = countSelectedFiles(selectedRows)

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
                    {column.id !== 'selection' && column.id !== 'name' && (
                      <div
                        {...extendedColumn.getResizerProps()}
                        className={`${styles.resizer} ${extendedColumn.isResizing ? styles.isResizing : ''}`}
                      />
                    )}

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
          height={500}
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
                        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                        <div
                          onClick={() =>
                            row.canExpand
                              ? row.toggleRowExpanded(!row.isExpanded)
                              : logged && downloadSingleFile(cell.row.original.path)
                          }
                          style={{ cursor: 'pointer' }}
                          className={row.canExpand ? styles.folder : undefined}
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
          {flatRows && (
            <span>{`${flatRows.filter((r) => !r.subRows.length).length} file${rows.length > 1 ? 's' : ''} available for download`}</span>
          )}
          <br />
          {selectedRows.length > 0 && (
            <span>{`${rowSelectedCount} file${rowSelectedCount > 1 ? 's' : ''} selected`}</span>
          )}
        </span>
        <button
          onClick={onDownloadClick}
          disabled={!rowSelectedCount || downloadLoading || !logged}
        >
          {logged ? 'Download' : 'Login to download'}
        </button>
      </div>
    </div>
  )
}

export default Table
