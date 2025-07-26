import type { HTMLProps} from 'react';
import { useEffect, useMemo, useRef } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { VesselTable } from '@/features/table/VesselsTable'
import { IconButton } from '@globalfishingwatch/ui-components'

import { fetchVessels } from '../utils/vessels'

export const Route = createFileRoute('/vessels')({
  loader: async () => fetchVessels(),
  component: PostsComponent,
})

export type Vessel = Record<string, any>

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

  return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />
}
const createColumns = (vessels: Vessel): ColumnDef<Vessel>[] => {
  if (!vessels?.length) return []

  const keys = Object.keys(vessels[0])
  const nameKey = keys.filter((key) => key.toLowerCase().includes('name'))
  const otherKeys = keys.filter((key) => !key.toLowerCase().includes('name'))

  return [
    {
      id: 'select',
      header: '',
      cell: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
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
      cell: ({ table, getValue }) => (
        <div>
          <span>{getValue()}</span>
          <IconButton
            icon={table.getIsAllRowsExpanded() ? 'arrow-top' : 'arrow-down'}
            size="small"
            type="invert"
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
function PostsComponent() {
  const vessels: Vessel[] = Route.useLoaderData()
  const columns = createColumns(vessels)
  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        <VesselTable data={vessels} columns={columns} />
      </ul>
      <hr />
      <Outlet />
    </div>
  )
}
