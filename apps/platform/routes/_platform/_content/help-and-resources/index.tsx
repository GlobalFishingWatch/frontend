import { createFileRoute } from '@tanstack/react-router'

import HelpHubLandingPage from 'features/help/HelpHubLandingPage'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_content/help-and-resources/')({
  component: HelpHubLandingPage,
  head: () => getRouteHead({ category: t((s) => s.helpHub.title) }),
})
