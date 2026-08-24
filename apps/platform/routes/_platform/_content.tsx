import { createFileRoute } from '@tanstack/react-router'

import ContentLayout from 'features/layouts/ContentLayout'

/**
 * Layout for platform pages with no map and no sidebar — /user and /vessel-search.
 *
 * Pathless, so URLs are unchanged. Only routes that genuinely do not read data off mounted deck.gl
 * layers can live here.
 */
export const Route = createFileRoute('/_platform/_content')({
  component: ContentLayout,
})
