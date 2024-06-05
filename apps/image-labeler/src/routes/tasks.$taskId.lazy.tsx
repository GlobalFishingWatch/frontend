import { createLazyFileRoute } from '@tanstack/react-router'
import TasksComponent from '../features/tasks/tasks'

export const Route = createLazyFileRoute('/tasks/$taskId')({
  component: TasksComponent,
})
