import type { HTMLProps } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import type { Row, Table } from '@tanstack/react-table'

import { IconButton } from '@globalfishingwatch/ui-components'

import styles from '../DynamicTable.module.css'

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
      })),
    ]
  }, [data])
}
