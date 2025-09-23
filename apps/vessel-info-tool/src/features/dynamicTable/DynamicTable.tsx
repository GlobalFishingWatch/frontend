import { useEffect, useState } from 'react'
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

import { Route } from '@/routes/_auth/index'
import { type Vessel } from '@/types/vessel.types'
import { Icon } from '@globalfishingwatch/ui-components'

import { useDynamicColumns } from '../../hooks/useDynamicColumns'
import { renderExpandedRow } from '../expandableRow/ExpandableRow'

import styles from '../../styles/global.module.css'

export interface DynamicTableProps {
  data: Vessel[]
  tableContainerRef: HTMLDivElement
}

export function DynamicTable({ data, tableContainerRef }: DynamicTableProps) {
  const { selectedRows, rfmo, globalSearch, columnFilters } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { columns } = useDynamicColumns(data)
  const columnPinning = {
    left: ['select', (columns[1] as any)?.id],
  }
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([(columns[1] as any)?.id])
  const [selected, setSelected] = useState<RowSelectionState>(
    selectedRows
      ? Array.isArray(selectedRows)
        ? Object.fromEntries(selectedRows.map((id) => [id, true]))
        : { [selectedRows]: true }
      : {}
  )

  useEffect(() => {
    navigate({
      search: (prev) => {
        if (Object.keys(selected).length === 0) {
          const { selectedRows, ...rest } = prev
          return rest
        }
        return {
          ...prev,
          selectedRows: Object.keys(selected).join(','),
        }
      },
    })
  }, [selected, navigate])

  const table = useReactTable({
    data: data,
    columns,
    state: {
      expanded,
      columnPinning,
      sorting,
      globalFilter: globalSearch,
      columnFilters,
      rowSelection: selected,
    },
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
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: (index) => {
      const row = rows[index]
      if (row.getIsExpanded()) {
        return 46 + 210
      }
      return 46
    },
    getScrollElement: () => tableContainerRef,
  })

  return (
    <table className="w-full grid">
      <thead className="sticky z-3 top-0 grid !bg-white">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
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
      <tbody
        style={{
          display: 'grid',
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
          boxShadow: 'inset 0 1px 8px 0 rgba(22, 63, 137, 0.1)',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index] as Row<Vessel>
          return (
            <tr
              data-index={virtualRow.index}
              ref={(node) => rowVirtualizer.measureElement(node)}
              key={row.id}
              style={{
                display: 'flex',
                position: 'absolute',
                transform: `translateY(${virtualRow.start}px)`,
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <td colSpan={row.getVisibleCells().length}>
                <div className="row-content">
                  <div className="cells flex">
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell
                      return (
                        <div
                          key={cell.id}
                          className={styles.td}
                          style={{
                            left: column.getIsPinned() ? `${column.getStart('left')}px` : undefined,
                            position: column.getIsPinned() ? 'sticky' : 'relative',
                            width: column.getSize(),
                            zIndex: column.getIsPinned() ? 1 : 0,
                            backgroundColor: column.getIsPinned()
                              ? 'rgba(229, 240, 242, 0.95)'
                              : undefined,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      )
                    })}
                  </div>

                  {row.getIsExpanded() && (
                    <div className="!bg-[var(--color-brand)]">{renderExpandedRow({ row })}</div>
                  )}
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
