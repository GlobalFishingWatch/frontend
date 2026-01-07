import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import type { MissingFieldsTableType } from '@/utils/validations'
import { InputText } from '@globalfishingwatch/ui-components'

import styles from '../../styles/global.module.css'

const columnConfigs: {
  key: keyof MissingFieldsTableType
  header: string
}[] = [
  { key: 'field', header: 'Field' },
  { key: 'format', header: 'Format' },
  { key: 'emptyRows', header: 'Empty Rows' },
  { key: 'fallbackValue', header: 'Value to fill all empty rows' },
]

const defaultColumns: ColumnDef<MissingFieldsTableType>[] = columnConfigs.map(
  ({ key, header }, index) => {
    const column: ColumnDef<MissingFieldsTableType> = {
      header,
      accessorKey: key,
    }

    if (index === columnConfigs.length - 1) {
      column.cell = ({ getValue }) => <InputText defaultValue={(getValue() as string) || ''} />
    }

    return column
  }
)

export interface DynamicTableProps {
  fields: MissingFieldsTableType[]
}

export function FieldsTable({ fields }: DynamicTableProps) {
  const [data] = useState(() => fields)
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <table>
      <thead className="!bg-white">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan} className={styles.th}>
                {header.isPlaceholder ? null : (
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex items-center justify-between p-2"
                  >
                    <span className="block text-ellipsis overflow-hidden whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                  </div>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className={styles.tbody}>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={cell.column.id === 'fallbackValue' ? styles.inputTd : styles.td}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
