import { Fragment, useEffect, useMemo, useState } from 'react'
import type { ExpandedState, RowSelectionState, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Route } from '@/routes/_auth/index'
import { type Vessel } from '@/types/vessel.types'
import { Icon } from '@globalfishingwatch/ui-components'

import { useDynamicColumns } from '../../hooks/useDynamicColumns'
import { renderExpandedRow } from '../expandableRow/ExpandableRow'

import styles from '../../styles/global.module.css'

export interface DynamicTableProps {
  data: Vessel[]
}

export function DynamicTable({ data }: DynamicTableProps) {
  const { selectedRows, rfmo, globalSearch, columnFilters } = Route.useSearch()
  const navigate = Route.useNavigate()

  const columns = useDynamicColumns(data)
  const columnPinning = {
    left: ['select', (columns[1] as any)?.accessorKey],
  }
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([(columns[1] as any)?.accessorKey])
  const [selected, setSelected] = useState<RowSelectionState>(
    selectedRows
      ? Array.isArray(selectedRows)
        ? Object.fromEntries(selectedRows.map((id) => [id, true]))
        : { [selectedRows]: true }
      : {}
  )

  // useEffect(() => {
  //   if (Object.keys(selected).length > 0) {
  //     navigate({
  //       search: (prev) => ({
  //         ...prev,
  //         selectedRows: Object.keys(selected).join(','),
  //       }),
  //     })
  //   }
  // }, [selected])

  const table = useReactTable({
    data: data,
    columns,
    state: {
      expanded,
      columnPinning,
      sorting,
      globalFilter: globalSearch,
      columnFilters,
      // rowSelection: selected,
    },
    // manualFiltering: true,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    onRowSelectionChange: setSelected,
    getRowId: (row: Vessel) => row.id,
  })
  console.log('🚀 ~ DynamicTable ~ columnFilters:', table.getState().columnFilters)

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
                      <span className="block text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
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
      <tbody className={styles.tbody}>
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
