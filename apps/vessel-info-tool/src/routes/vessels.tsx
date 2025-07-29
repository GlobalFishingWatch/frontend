import { createFileRoute, Outlet } from '@tanstack/react-router'

import SidebarHeader from '@/features/header/SidebarHeader'
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
    <>
      <SidebarHeader>
        <h1>Vessels</h1>
      </SidebarHeader>
      <VesselTable data={vessels} columns={columns} />
    </>
  )
}
