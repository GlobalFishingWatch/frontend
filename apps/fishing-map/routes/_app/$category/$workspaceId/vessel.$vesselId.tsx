import { createFileRoute } from '@tanstack/react-router'

import Vessel from 'features/vessel/Vessel'
import { getRouteHead, getTFunction } from 'router/router.meta'
import { validateVesselProfileParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/$category/$workspaceId/vessel/$vesselId')({
  component: Vessel,
  validateSearch: validateVesselProfileParams,
  head: ({ matches }) => {
    const t = getTFunction(matches)
    return getRouteHead({ category: t('vessel.title'), t })
  },
})
