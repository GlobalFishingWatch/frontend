import { createFileRoute } from '@tanstack/react-router'

import ApiTokens from 'features/api-tokens/ApiTokens'

export const Route = createFileRoute('/_platform/_content/datasets-and-api/api-tokens/')({
  component: ApiTokens,
})
