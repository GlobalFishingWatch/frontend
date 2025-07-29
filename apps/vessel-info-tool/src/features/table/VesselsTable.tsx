import type { HTMLProps } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'
import type { ColumnDef, ExpandedState, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Table,
  useReactTable,
} from '@tanstack/react-table'

import type { Vessel } from '@/routes/vessels'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import ExpandedRow from '../expandedRow/ExpandedRow'

import styles from './VesselsTable.module.css'

type VesselTableProps = {
  data: Vessel[]
  columns: ColumnDef<Vessel, any>[]
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <div>
      <input
        id="indeterminate-checkbox"
        type="checkbox"
        ref={ref}
        className={`${styles.checkbox} ${className}`}
        {...rest}
      />
      <label htmlFor="indeterminate-checkbox" className="h-0"></label>
    </div>
  )
}
export const createColumns = (vessels: Vessel): ColumnDef<Vessel>[] => {
  if (!vessels?.length) return []

  const keys = Object.keys(vessels[0])
  const nameKey = keys.filter((key) => key.toLowerCase().includes('name'))
  const otherKeys = keys.filter((key) => !key.toLowerCase().includes('name'))

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: false,
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 40,
    },
    {
      accessorKey: nameKey[0],
      header: nameKey[0] || 'Name',
      cell: ({ row, getValue }) => (
        <div className="flex items-center justify-between p-2">
          <span>{String(getValue())}</span>
          <IconButton
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
            icon={row.getIsExpanded() ? 'arrow-top' : 'arrow-down'}
            size="small"
          />
        </div>
      ),
    },
    ...otherKeys.map((key) => ({
      accessorKey: key,
      header: key,
    })),
  ]
}

export function VesselTable({ data, columns }: VesselTableProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([
    columns[1]?.id || (columns[1] as any)?.accessorKey,
  ])

  const columnPinning = {
    left: ['select', columns[1]?.id || (columns[1] as any)?.accessorKey],
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
    getRowCanExpand: () => true,
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
                    <td colSpan={row.getVisibleCells().length}>
                      <ExpandedRow vessel={row.original} />
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
