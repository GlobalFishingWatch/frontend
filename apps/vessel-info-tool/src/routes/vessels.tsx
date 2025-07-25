import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { VesselTable } from '@/features/table/VesselsTable'

import { fetchVessels } from '../utils/vessels'

export const Route = createFileRoute('/vessels')({
  loader: async () => fetchVessels(),
  component: PostsComponent,
})

function PostsComponent() {
  const vessels = Route.useLoaderData()

  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        <VesselTable
          data={vessels}
          columns={Object.keys(vessels[0] || {}).map((key) => ({
            accessorKey: key,
            header: key,
          }))}
        />
      </ul>
      <hr />
      <Outlet />
    </div>
  )
}
