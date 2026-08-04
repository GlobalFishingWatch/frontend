import { createFileRoute } from '@tanstack/react-router'

import MapLayout from 'features/layouts/MapLayout'

/**
 * The map shell: SplitView + Sidebar + Main (map, timebar, content panel).
 *
 * Pathless. Everything whose data is read off mounted deck.gl layers belongs here — the map routes
 * under `map/`, plus the vessel profile and the standalone area report, which sit at the platform
 * root but still need the map.
 */
export const Route = createFileRoute('/_platform/_map')({
  component: MapLayout,
})
