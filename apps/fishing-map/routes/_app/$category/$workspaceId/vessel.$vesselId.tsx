import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'
import { validateVesselProfileParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/$category/$workspaceId/vessel/$vesselId')({
  component: lazyRouteComponent(() => import('features/vessel/Vessel')),
  validateSearch: validateVesselProfileParams,
  head: ({ matches }) => {
    const t = getTFuntion(matches)
    return getRouteHead({ category: t('vessel.title'), t })
  },
})
