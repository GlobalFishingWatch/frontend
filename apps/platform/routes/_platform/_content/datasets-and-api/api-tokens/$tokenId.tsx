import { createFileRoute } from '@tanstack/react-router'

import ApiTokenDetail from 'features/api-tokens/ApiTokenDetail'

export const Route = createFileRoute('/_platform/_content/datasets-and-api/api-tokens/$tokenId')({
  component: ApiTokenDetail,
})
