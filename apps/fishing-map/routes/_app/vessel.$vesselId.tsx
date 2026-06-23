import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import Vessel from 'features/vessel/Vessel'
import { ssrLoadVessel } from 'features/vessel/vessel.ssr'
import { getRouteHead } from 'router/router.meta'
import { validateVesselProfileParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/vessel/$vesselId')({
  component: Vessel,
  validateSearch: validateVesselProfileParams,
  loader: ({ context, params, location }) => ssrLoadVessel({ context, params, location }),
  head: () => getRouteHead({ category: t((s) => s.vessel.title) }),
})
