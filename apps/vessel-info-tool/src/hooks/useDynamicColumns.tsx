import type { HTMLProps } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import type { Row, Table } from '@tanstack/react-table'
import escapeRegExp from 'lodash/escapeRegExp'

import { IconButton } from '@globalfishingwatch/ui-components'

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
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        ref={ref}
        aria-checked={indeterminate ? 'mixed' : undefined}
        className="
    appearance-none w-8 h-8 rounded-full border-2 border-gray-300
    cursor-pointer relative
    checked:bg-[rgba(22,63,137,0.8)]
    checked:border-[rgba(22,63,137,0.1)]
    before:content-['✓'] before:absolute before:text-white before:text-[12px]
    before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
    before:opacity-0 checked:before:opacity-100
    transition-colors
  "
        {...rest}
      />
      <span
        className="
      relative w-8 h-8 border-2 border-gray-300 rounded-full
      peer-checked:bg-[rgba(22,63,137,0.8)]
      peer-checked:border-[rgba(22,63,137,0.1)]
      transition-colors
    "
      >
        <span
          className="
        absolute inset-0 flex items-center justify-center text-white text-[12px]
        opacity-0 peer-checked:opacity-100
      "
        >
          ✓
        </span>
      </span>
    </label>
  )
}

export function useDynamicColumns<T extends Record<string, any>>(data: T[]) {
  return useMemo(() => {
    if (!data.length) return []

    const keys = Object.keys(data[0])
    const nameKey = keys.filter((key) => key.toLowerCase().includes('name'))
    const otherKeys = keys.filter((key) => !key.toLowerCase().includes('name'))

    return [
      {
        id: 'select',
        header: ({ table }: { table: Table<T> }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }: { row: Row<T> }) => (
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
        cell: ({ row, getValue }: { row: Row<T>; getValue: () => any }) => (
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
        cell: ({ table, getValue }: { table: Table<T>; getValue: () => any }) => {
          const globalFilter = (table.getState().globalFilter as string | undefined)?.trim()
          const value = String(getValue())

          if (!globalFilter) {
            return (
              <div className="flex items-center justify-between p-2">
                <span>{value}</span>
              </div>
            )
          }

          const regex = new RegExp(`(${escapeRegExp(globalFilter)})`, 'gi')
          const parts = value.split(regex)

          return (
            <div className="flex items-center justify-between p-2">
              <span>
                {parts
                  .filter((part) => part)
                  .map((part, i) =>
                    regex.test(part) ? (
                      <mark
                        style={{ backgroundColor: 'var(--color-highlight-blue)' }}
                        className="inline-block"
                        key={i}
                      >
                        {part}
                      </mark>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
              </span>
            </div>
          )
        },
      })),
    ]
  }, [data])
}
