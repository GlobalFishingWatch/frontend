import { createFileRoute } from '@tanstack/react-router'

import ContentLayout from 'features/layouts/ContentLayout'

/**
 * Layout for platform pages with no map and no sidebar — /user, /vessel-search, /ports, /areas and
 * /help-and-resources.
 *
 * Pathless, so URLs are unchanged. Only routes that genuinely do not read data off the main map's
 * mounted deck.gl layers can live here — /ports and /areas render their own standalone DeckGL.
 */
export const Route = createFileRoute('/_platform/_content')({
  component: ContentLayout,
})
