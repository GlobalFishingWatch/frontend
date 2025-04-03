import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const Home = lazy(() => import('../pages/home/home'))

export const Route = createFileRoute('/')({
  component: Home,
})
