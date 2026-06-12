import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFunction } from 'router/router.meta'
import { validateVesselProfileParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/vessel/$vesselId')({
  component: lazyRouteComponent(() => import('features/vessel/Vessel')),
  validateSearch: validateVesselProfileParams,
  head: ({ matches }) => {
    const t = getTFunction(matches)
    return getRouteHead({ category: t('vessel.title'), t })
  },
})
