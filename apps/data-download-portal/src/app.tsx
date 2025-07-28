import { StrictMode } from 'react'
import { createRouter, RouterProvider } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Import styles
import '../../../libs/ui-components/src/base.css'

export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/data-download' : ''

// Create a new router instance
const router = createRouter({
  routeTree,
  basepath: BASE_PATH,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

export default App
