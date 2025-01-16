import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'

import App from './app/App'
import { Layout } from './components/layout/Layout'

import '@globalfishingwatch/ui-components/base.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>
)
