import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { PATH_BASENAME } from 'components/data/config'

import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  basepath: PATH_BASENAME,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  )
}

export default App
