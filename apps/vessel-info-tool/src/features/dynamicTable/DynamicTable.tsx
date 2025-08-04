import { Fragment, useState } from 'react'
import type { ExpandedState, Row, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Icon } from '@globalfishingwatch/ui-components'

import ExpandableRow from './components/ExpandableRow'
import { useDynamicColumns } from './hooks/useDynamicColumns'
import { useRowExpansion } from './hooks/useRowExpansion'
import { useTableFilters } from './hooks/useTableFilters'

import styles from './DynamicTable.module.css'

export interface DynamicTableProps<T extends Record<string, any>> {
  data: T[]
  onExpandRow?: (row: T) => Promise<any>
  checkCanExpand?: (row: Row<T>) => boolean
}

export interface FilterState {
  [columnKey: string]: string[]
}

export interface ExpandedRowData {
  [key: string]: any
}

export function DynamicTable<T extends Record<string, any>>({
  data,
  onExpandRow,
  checkCanExpand,
}: DynamicTableProps<T>) {
  const { filterState, filteredData, updateFilter } = useTableFilters(data)
  const { expandedRows, loadingExpansions, toggleExpansion, canExpand } = useRowExpansion(
    checkCanExpand,
    onExpandRow
  )

  const columns = useDynamicColumns(data, filterState, updateFilter)

  //   const columnsWithExpansion = useMemo(
  //     () => [
  //       {
  //         id: 'expander',
  //         header: '',
  //         cell: ({ row }) => {
  //           const rowData = row.original
  //           const rowId = rowData.id
  //           const isExpanded = expandedRows[rowId]
  //           const isLoading = loadingExpansions.has(rowId)

  //           return (
  //             <button
  //               onClick={() => toggleExpansion(rowData)}
  //               disabled={isLoading}
  //               className="px-2 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
  //             >
  //               {isLoading ? '...' : isExpanded ? '−' : '+'}
  //             </button>
  //           )
  //         },
  //       },
  //       ...columns,
  //     ],
  //     [columns, expandedRows, loadingExpansions, toggleExpansion]
  //   )
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([(columns[1] as any)?.accessorKey])

  const columnPinning = {
    left: ['select', (columns[1] as any)?.accessorKey],
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      columnPinning,
      sorting,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: checkCanExpand,
  })

  return (
    <div className={`p-2 ${styles.container}`}>
      <div className="h-2" />
      <table className={styles.table}>
        <thead className={`sticky top-0 z-10 bg-white`}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.th}>
              {headerGroup.headers.map((header) => {
                const { column } = header
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`sticky top-0 z-10 cursor-pointer select-none bg-white ${styles.td}`}
                    style={{
                      left: column.getIsPinned() ? `${column.getStart('left')}px` : undefined,
                      position: column.getIsPinned() ? 'sticky' : 'relative',
                      width: column.getSize(),
                      zIndex: column.getIsPinned() ? 1 : 0,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center justify-between p-2"
                      >
                        <span className="block text-ellipsis overflow-hidden whitespace-nowrap max-w-[170px]">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {{
                          asc: <Icon icon="sort-asc" />,
                          desc: <Icon icon="sort-desc" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map((cell) => {
                    const { column } = cell
                    return (
                      <td
                        key={cell.id}
                        className={styles.td}
                        style={{
                          left: column.getIsPinned() ? `${column.getStart('left')}px` : undefined,
                          position: column.getIsPinned() ? 'sticky' : 'relative',
                          width: column.getSize(),
                          zIndex: column.getIsPinned() ? 1 : 0,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={columns.length} className="p-0">
                      <ExpandableRow data={expandedRows[row.original.id]} />
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
