import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'
import { validateVesselProfileParams } from 'router/routes.search'

const VesselProfile = lazy(() => import('features/vessel/Vessel'))

export const Route = createFileRoute('/_app/$category/$workspaceId/vessel/$vesselId')({
  component: VesselProfile,
  validateSearch: validateVesselProfileParams,
  head: ({ matches }) => {
    const t = getTFuntion(matches)
    return getRouteHead({ category: t('vessel.title'), t })
  },
})
