import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validateVesselProfileParams } from 'router/routes.search'

const VesselProfile = lazy(() => import('features/vessel/Vessel'))

export const Route = createFileRoute('/_app/$category/$workspaceId/vessel/$vesselId')({
  component: VesselProfile,
  validateSearch: validateVesselProfileParams,
  head: () => getRouteHead({ category: t((tr) => tr.vessel.title) }),
})
