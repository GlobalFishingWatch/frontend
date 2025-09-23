import type { HTMLProps } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { filterFns, type Row, type Table } from '@tanstack/react-table'
import escapeRegExp from 'lodash/escapeRegExp'

import type { Vessel } from '@/types/vessel.types'
import { generateFilterConfigs } from '@/utils/filters'
import { normalizeKey } from '@/utils/source'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'

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
    if (!data.length) return { columns: [], filterConfigs: [] }

    const filterConfigs = generateFilterConfigs(data).filter(
      (k) => k !== undefined && k !== null && k.id !== 'id'
    )

    const columns = [
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
      ...filterConfigs.map((key, index) => ({
        id: key.id,
        accessorKey: key.label || `col_${index}`,
        header: key.label,
        filterFn: key.type === 'number' ? filterFns.inNumberRange : filterFns.includesString,
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

          const regex = new RegExp(`(${escapeRegExp(globalFilter)})`, 'gi')

          return (
            <div className="flex items-center justify-between p-2">
              <Tooltip content={value}>
                <span className="min-w-0 text-ellipsis overflow-hidden whitespace-nowrap">
                  {!globalFilter ? (
                    <span>{value}</span>
                  ) : (
                    value
                      .split(regex)
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
                      )
                  )}
                </span>
              </Tooltip>
              {index === 0 && (
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

    return { columns, filterConfigs }
  }, [data])
}
