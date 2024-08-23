import { createFileRoute } from '@tanstack/react-router'

type ProjectSearchState = {
  activeTaskId?: string
}

export const Route = createFileRoute('/project/$projectId')({
  validateSearch: (search: Record<string, unknown>): ProjectSearchState => {
    // validate and parse the search params into a typed state
    return {
      activeTaskId: search.activeTaskId as string,
    }
  },
})
