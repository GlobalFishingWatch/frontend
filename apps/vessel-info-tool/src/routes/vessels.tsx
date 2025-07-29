import { createFileRoute, Outlet } from '@tanstack/react-router'

import { createColumns, VesselTable } from '@/features/table/VesselsTable'

import { fetchVessels } from '../utils/vessels'

export const Route = createFileRoute('/vessels')({
  loader: async () => fetchVessels(),
  component: PostsComponent,
})

export type Vessel = Record<string, any>

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
