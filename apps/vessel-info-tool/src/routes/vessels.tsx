import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

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
        {vessels.map((vessel) => {
          return (
            <li key={vessel.IMO} className="whitespace-nowrap">
              {vessel.IMO}
            </li>
          )
        })}
      </ul>
      <hr />
      <Outlet />
    </div>
  )
}
