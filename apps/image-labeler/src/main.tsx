import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// Import the generated route tree
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { projectsListApi } from './api/projects-list'
import { routeTree } from './routeTree.gen'
import { projectApi } from './api/project'
import styles from './main.module.css'
import { taskApi } from './api/task'
import '../../../libs/ui-components/src/base.css'

// Create a new router instance
export const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')!
if (!rootElement?.innerHTML) {
  const store = configureStore({
    reducer: {
      [projectsListApi.reducerPath]: projectsListApi.reducer,
      [projectApi.reducerPath]: projectApi.reducer,
      [taskApi.reducerPath]: taskApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        projectsListApi.middleware,
        projectApi.middleware,
        taskApi.middleware,
      ]),
  })
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Provider store={store}>
        <div className={styles.app}>
          <RouterProvider router={router} />
        </div>
      </Provider>
    </StrictMode>
  )
}
