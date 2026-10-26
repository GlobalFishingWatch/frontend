import { createFileRoute } from '@tanstack/react-router'

import { loadApiTokens } from 'features/api-tokens/api-tokens.loaders'
import ApiTokensGate from 'features/api-tokens/ApiTokensGate'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_content/datasets-and-api/api-tokens')({
  component: ApiTokensGate,
  loader: ({ context }) => loadApiTokens(context),
  head: () => getRouteHead({ category: t((s) => s.apiTokens.title) }),
  // The rendered HTML carries the user's API tokens
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
})
