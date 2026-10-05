import { createFileRoute } from '@tanstack/react-router'

import PlacesLayout from 'features/layouts/PlacesLayout'

/** Pathless layout shared by /ports and /areas, so URLs are unchanged. */
export const Route = createFileRoute('/_platform/_places')({
  component: PlacesLayout,
})
