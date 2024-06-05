import { createLazyFileRoute } from '@tanstack/react-router'
import Projects from '../features/projects/projects'

export const Route = createLazyFileRoute('/')({
  component: Projects,
})
