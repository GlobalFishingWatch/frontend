import { Fragment, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { ExpandedState, Row, RowSelectionState, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import type { useTableFilters } from '@/hooks/useTableFilters'
import type { Vessel } from '@/types/vessel.types'
import { Icon } from '@globalfishingwatch/ui-components'

import type { AppDispatch, RootState } from 'store'

import { useDynamicColumns } from '../../hooks/useDynamicColumns'
import { useRowExpansion } from '../../hooks/useRowExpansion'
import ExpandableRow from '../expandableRow/ExpandableRow'

import { setSelectedRows } from './table.slice'

import styles from '../../styles/global.module.css'

export interface DynamicTableProps<T extends Record<string, any>> {
  data: T[]
  tableFilters: ReturnType<typeof useTableFilters>
  onExpandRow?: (row: T) => Promise<any>
}

export function DynamicTable<T extends Record<string, any>>({
  data,
  tableFilters,
  onExpandRow,
}: DynamicTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { expandedRows } = useRowExpansion(onExpandRow)
  const columns = useDynamicColumns(data)
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([(columns[1] as any)?.accessorKey])

  const columnPinning = {
    left: ['select', (columns[1] as any)?.accessorKey],
  }

  const dispatch = useDispatch<AppDispatch>()
  const rowSelection = useSelector(
    (state: RootState) => state.table.selectedRows
  ) as RowSelectionState

  const { filteredData, globalFilter } = tableFilters

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      expanded,
      columnPinning,
      sorting,
      globalFilter,
      rowSelection,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    onRowSelectionChange: (newSelection) => {
      if (typeof newSelection === 'function') {
        dispatch(setSelectedRows(newSelection(rowSelection)))
      } else {
        dispatch(setSelectedRows(newSelection))
      }
    },
    getRowId: (row: any, index) => {
      const idKey = Object.keys(row).find((k) => k.toLowerCase().includes('imo'))
      const val = idKey ? row[idKey] : undefined
      return (typeof val === 'string' && val.trim()) || String(index)
    },
  })

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: table.getRowModel().rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <div
      ref={tableContainerRef}
      style={{
        overflow: 'auto', //our scrollable table container
        position: 'relative', //needed for sticky header
        height: '90vh', //should be a fixed height
      }}
    >
      <table className="table-fixed w-full">
        <thead className="sticky z-3 top-0 !bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
        <tbody
          style={{
            display: 'block',
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = table.getRowModel().rows[virtualRow.index] as Row<Vessel>
            return (
              <tr
                data-index={virtualRow.index}
                ref={(node) => rowVirtualizer.measureElement(node)}
                key={row.id}
                style={{
                  display: 'table',
                  tableLayout: 'fixed',
                  width: '100%',
                  position: 'absolute',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
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
                {/* {row.getIsExpanded() && (
          <td colSpan={columns.length} className="p-0">
            <ExpandableRow data={expandedRows[row.original.id]} />
          </td>
            )} */}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
