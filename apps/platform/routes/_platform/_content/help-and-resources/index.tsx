import { createFileRoute } from '@tanstack/react-router'

import { getHelpHubLocale, loadHelpHubSections } from 'features/help/helpHub.loaders'
import HelpHubLandingPage from 'features/help/HelpHubLandingPage'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_content/help-and-resources/')({
  component: HelpHubLandingPage,
  loader: () => loadHelpHubSections(getHelpHubLocale()),
  head: () => getRouteHead({ category: t((s) => s.helpHub.title) }),
})
