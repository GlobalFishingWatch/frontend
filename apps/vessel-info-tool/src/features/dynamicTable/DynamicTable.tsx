import { Fragment, useEffect, useState } from 'react'
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

import type { useTableFilters } from '@/hooks/useTableFilters'
import { type Vessel } from '@/types/vessel.types'
import { Icon } from '@globalfishingwatch/ui-components'

import type { AppDispatch, RootState } from 'store'

import { useDynamicColumns } from '../../hooks/useDynamicColumns'
import { renderExpandedRow } from '../expandableRow/ExpandableRow'

import { setSelectedRows } from './table.slice'

import styles from '../../styles/global.module.css'

export interface DynamicTableProps {
  data: Vessel[]
  tableFilters: ReturnType<typeof useTableFilters>
}

export function DynamicTable({ data, tableFilters }: DynamicTableProps) {
  const columns = useDynamicColumns(data)
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([(columns[1] as any)?.accessorKey])
  const [selected, setSelected] = useState<RowSelectionState>({})

  const columnPinning = {
    left: ['select', (columns[1] as any)?.accessorKey],
  }

  const dispatch = useDispatch<AppDispatch>()
  const rowSelection = useSelector(
    (state: RootState) => state.table.selectedRows
  ) as RowSelectionState

  useEffect(() => {
    dispatch(setSelectedRows(selected))
  }, [selected])

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
    onRowSelectionChange: setSelected,
    getRowId: (row: any) => row.id,
  })

  return (
    <table className="w-full">
      <thead className="sticky z-3 top-0 !bg-white">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const { column } = header
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={styles.th}
                  style={{
                    backgroundColor: column.getIsPinned() ? '#fff' : undefined,
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
            <Fragment key={row.index}>
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
                        backgroundColor: column.getIsPinned()
                          ? row.getIsExpanded() && column.id !== 'select'
                            ? 'var(--color-brand)'
                            : 'rgba(229, 240, 242, 0.95)'
                          : undefined,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
              {row.getIsExpanded() && (
                <tr>
                  <td colSpan={row.getVisibleCells().length} className="!bg-[var(--color-brand)]">
                    {renderExpandedRow({ row })}
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
