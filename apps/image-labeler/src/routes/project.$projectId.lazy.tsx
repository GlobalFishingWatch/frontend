import { createLazyFileRoute } from '@tanstack/react-router'

import TasksComponent from '../features/project/Project'

export const Route = createLazyFileRoute('/project/$projectId')({
  component: TasksComponent,
})
