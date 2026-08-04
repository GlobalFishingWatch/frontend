import { createFileRoute } from '@tanstack/react-router'

/**
 * Contributes the `/map` URL segment, nothing else.
 *
 * No `component` — TanStack Router defaults to rendering an `<Outlet />`. The chrome already comes
 * from the `_shell` layout above, so this exists purely so the map's routes sit under `/map` while
 * its siblings (`/report/$reportId`, `/vessel/$vesselId`) stay at the platform root and still get
 * the same shell. A pathless `_map` group could not do this — pathless layouts contribute no path.
 */
export const Route = createFileRoute('/_platform/_map/map')({})
