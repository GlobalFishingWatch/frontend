import { createFileRoute } from '@tanstack/react-router'

import SidebarHeader from '@/features/header/SidebarHeader'
import { createColumns, VesselTable } from '@/features/table/VesselsTable'
import { fetchVessels } from '@/utils/vessels'

export type Vessel = Record<string, any>

export const Route = createFileRoute('/_auth/')({
  loader: async () => fetchVessels(),
  component: Home,
})

function Home() {
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
