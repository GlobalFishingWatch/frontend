import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './index.css'
import App from './app.jsx'
// Create a new router instance
// export const router = createRouter({ routeTree })
const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement)
// root.render(
//   <StrictMode>
//     <App>
//       <RouterProvider router={router} />
//     </App>
//   </StrictMode>
// )
root.render(<App />)
// ReactDOM.render(<App />, document.getElementById('root'))
