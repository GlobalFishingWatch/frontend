import { createFileRoute } from '@tanstack/react-router'
import TasksComponent from '../features/project/Project'

type ProjectSearchState = {
  activeTaskId?: string
}

export const Route = createFileRoute('/project/$projectId')({
  component: TasksComponent,
  validateSearch: (search: Record<string, unknown>): ProjectSearchState => {
    // validate and parse the search params into a typed state
    return {
      activeTaskId: search.activeTaskId as string,
    }
  },
})
