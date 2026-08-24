import ReactDOM from 'react-dom/client'

import { ROOT_DOM_ELEMENT } from 'components/data/config'

import App from './app'

import './styles/globals.css'
import '@globalfishingwatch/ui-components/base.css'

const rootElement = document.getElementById(ROOT_DOM_ELEMENT)
if (!rootElement) {
  throw new Error('Root element not found')
}
const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
