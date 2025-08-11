import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

import type { AppDispatch,RootState } from 'store'

import { useDynamicColumns } from '../../hooks/useDynamicColumns'
import { useRowExpansion } from '../../hooks/useRowExpansion'
import ExpandableRow from '../expandableRow/ExpandableRow'

import { setSelectedRows } from './table.slice'

import styles from './DynamicTable.module.css'

export interface DynamicTableProps<T extends Record<string, any>> {
  data: T[]
  onExpandRow?: (row: T) => Promise<any>
}

export function DynamicTable<T extends Record<string, any>>({
  data,
  onExpandRow,
}: DynamicTableProps<T>) {
  const { expandedRows } = useRowExpansion(onExpandRow)
  const columns = useDynamicColumns(data)
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([(columns[1] as any)?.accessorKey])

  const dispatch = useDispatch<AppDispatch>()
  const filters = useSelector((state: RootState) => state.filter)
  const selectedRowIds = useSelector((state: RootState) => state.table.selectedRowIds)
  console.log('🚀 ~ DynamicTable ~ selectedRowIds:', selectedRowIds)

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
      rowSelection: Object.fromEntries(selectedRowIds.map((id) => [id, true])),
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) => true,
    onRowSelectionChange: (updater) => {
      const selection = typeof updater === 'function' ? updater({}) : updater
      dispatch(setSelectedRows(Object.keys(selection)))
    },
  })

  return (
    <table className={styles.table}>
      <thead className={`sticky z-3 top-0 bg-white`}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className={styles.th}>
            {headerGroup.headers.map((header) => {
              const { column } = header
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={`sticky top-0 cursor-pointer select-none bg-white ${styles.td}`}
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
  )
}
