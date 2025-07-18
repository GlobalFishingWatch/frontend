import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { getUserToken } from '@/utils/user'

import CustomApp from '../fishing-map/index'

type MapQueryParams = {
  latitude?: number
  longitude?: number
  zoom?: number
}

export const Route = createFileRoute('/map/$')({
  loader: async () => getUserToken(),
  component: FishingMapComponent,
  ssr: false,
  validateSearch: (search: Record<string, unknown>): MapQueryParams => {
    // validate and parse the search params into a typed state
    return {
      latitude: Number(search?.latitude ?? 0),
      longitude: Number(search?.longitude ?? 0),
      zoom: Number(search?.zoom ?? 0),
    }
  },
})

function FishingMapComponent() {
  const token = Route.useLoaderData()

  return <CustomApp token={token} />
}
