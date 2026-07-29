import { createFileRoute } from '@tanstack/react-router'

import Vessel from 'features/vessels/vessel/Vessel'
import { ssrLoadVessel } from 'features/vessels/vessel/vessel.ssr'
import { getVesselHead } from 'router/router.meta'
import { validateVesselProfileParams } from 'router/routes.search'

export const Route = createFileRoute('/_platform/_map/map/$category/$workspaceId/vessel/$vesselId')({
  component: Vessel,
  validateSearch: validateVesselProfileParams,
  loader: ({ context, params, location }) => ssrLoadVessel({ context, params, location }),
  head: ({ loaderData }) => getVesselHead(loaderData),
})
