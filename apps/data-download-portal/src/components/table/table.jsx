import React, { Fragment,useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFlexLayout, useGlobalFilter,useRowSelect, useSortBy, useTable } from 'react-table'
import { FixedSizeList } from 'react-window'
import escapeRegExp from 'lodash/escapeRegExp'
import { matchSorter } from 'match-sorter'

import { GFWAPI } from '@globalfishingwatch/api-client'

import IconArrowDown from '../../assets/icons/arrow-down.svg'
import IconArrowUp from '../../assets/icons/arrow-up.svg'
import IconClose from '../../assets/icons/close.svg'
import IconSearch from '../../assets/icons/search.svg'
import { MAX_DOWNLOAD_FILES_LIMIT } from '../../config.js'

import styles from './table.module.scss'

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, title, ...rest }, ref) => {
  const defaultRef = React.useRef()
  const resolvedRef = ref || defaultRef
  const inputID = Math.random()

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <div className={styles.checkbox}>
      <input id={inputID} type="checkbox" ref={resolvedRef} {...rest} />
      <label htmlFor={inputID} title={title}>
        {title}
      </label>
    </div>
  )
})

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, {
    keys: id.map((i) => `values.${i}`),
    threshold: matchSorter.rankings.CONTAINS,
  })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val

function HighlightedCell({ cell, state }) {
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

// TODO: migrate to typescript and remove this deprected prop-types
// Table.propTypes = {
//   columns: PropTypes.arrayOf(
//     PropTypes.shape({
//       Header: PropTypes.string.isRequired,
//       accessor: PropTypes.func.isRequired,
//     }).isRequired
//   ).isRequired,
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       lastUpdate: PropTypes.string.isRequired,
//     }).isRequired
//   ).isRequired,
// }
function Table({ columns, data }) {
  const [searchInput, setSearchInput] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const { datasetId } = useParams()
  const initialState = React.useMemo(
    () => ({
      sortBy: [{ id: 'date', desc: true }],
    }),
    []
  )
  const defaultColumn = React.useMemo(
    () => ({
      // And also our default editable cell
      Cell: HighlightedCell,
    }),
    []
  )

  const {
    rows,
    state,
    prepareRow,
    headerGroups,
    getTableProps,
    getTableBodyProps,
    selectedFlatRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState,
      globalFilter: fuzzyTextFilterFn,
    },
    useGlobalFilter,
    useSortBy,
    useFlexLayout,
    useRowSelect,
    (hooks) => {
      if (hooks.visibleColumns) {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            width: 25,
            Header: () => '',
            Cell: ({ row, selectedFlatRows }) => {
              const disabled =
                selectedFlatRows.length >= MAX_DOWNLOAD_FILES_LIMIT && !row.isSelected
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
    }
  )

  const downloadSingleFile = useCallback(
    (path) => {
      if (path) {
        setDownloadLoading(true)
        GFWAPI.fetch(`/download/datasets/${datasetId}/download/${path}`)
          .then(({ url }) => {
            const downloadWindow = window.open(url, '_blank')
            downloadWindow.focus()
            setDownloadLoading(false)
          })
          .catch((e) => {
            console.log(e)
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
        method: 'POST',
        responseType: 'text',
        headers: { 'Content-Type': 'application/json' },
        body: { files },
      }
      GFWAPI.fetch(`/download/datasets/${datasetId}/download-multiple`, params)
        .then(() => {
          setDownloadLoading(false)
        })
        .catch((e) => {
          console.log(e)
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
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className={styles.input}
                value={state.globalFilter || ''}
                placeholder={`Type to filter files`}
                onBlur={() => setSearchInput(false)}
                onChange={(e) => {
                  setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
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
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(
                (column) =>
                  console.log(column) || (
                    <div
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={styles.th}
                    >
                      {column.render('Header')}{' '}
                      {column.id !== 'selection' && (
                        <span className={styles.sort}>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
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
              )}
            </div>
          ))}
        </div>
        <FixedSizeList height={420} itemSize={40} itemCount={rows.length} {...getTableBodyProps()}>
          {({ index, style }) => {
            const row = rows[index]
            prepareRow(row)
            return (
              <div {...row.getRowProps({ style })} className={styles.tr}>
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps()} className={styles.td} title={cell.value}>
                      {cell.column.id === 'name' ? (
                        <button onClick={() => downloadSingleFile(cell.row.original.path)}>
                          {cell.render('Cell')}
                        </button>
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
