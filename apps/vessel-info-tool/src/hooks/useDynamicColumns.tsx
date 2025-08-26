import type { HTMLProps } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import type { Row, Table } from '@tanstack/react-table'
import escapeRegExp from 'lodash/escapeRegExp'

import type { Vessel } from '@/types/vessel.types'
import { IconButton } from '@globalfishingwatch/ui-components'

import styles from '../styles/global.module.css'

function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <div className="flex">
      <input
        id="indeterminate-checkbox"
        type="checkbox"
        ref={ref}
        className={styles.checkbox}
        {...rest}
      />
      <label htmlFor="indeterminate-checkbox" className="h-0"></label>
    </div>
  )
}

export function useDynamicColumns<T extends Record<string, any>>(data: T[]) {
  return useMemo(() => {
    if (!data.length) return []

    const keys = Object.keys(data[0]).filter((key) => Boolean(key))

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
        size: 50,
      },
      ...keys.map((key, index) => ({
        accessorKey: key || `col_${index}`,
        header: key,
        size: 200,
        cell: ({
          table,
          row,
          getValue,
        }: {
          table: Table<T>
          row: Row<Vessel>
          getValue: () => any
        }) => {
          const globalFilter = (table.getState().globalFilter as string | undefined)?.trim()
          const value = String(getValue() || '-')

          if (!globalFilter) {
            return <span>{value}</span>
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
              {key === 'name' && (
                <IconButton
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: 'pointer' },
                  }}
                  icon={row.getIsExpanded() ? 'arrow-top' : 'arrow-down'}
                  size="small"
                />
              )}
            </div>
          )
        },
      })),
    ]
  }, [data])
}
