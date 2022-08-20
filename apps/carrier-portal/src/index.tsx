import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { unregister } from './serviceWorker'
import App from './app'
import store from './store'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import './index.css'

declare global {
  interface Window {
    Buffer: any
  }
}
window.Buffer = window.Buffer || require('buffer').Buffer

const Root: React.FC = (): React.ReactElement => (
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

const vh = window.innerHeight * 0.01
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`)
window.addEventListener('resize', () => {
  // We execute the same script as before
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})

function isBrowserSupported() {
  return (
    navigator.appName !== 'Microsoft Internet Explorer' &&
    !navigator.userAgent.match(/Trident/) &&
    !navigator.userAgent.match(/rv:11/) &&
    !navigator.userAgent.match(/MSIE/g)
  )
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

if (isBrowserSupported()) {
  root.render(<Root />)
  // Uncomment when concurrent mode stable
  // const root = (ReactDOM as any).createRoot(document.getElementById('root'))
  // root.render(<Root />)
} else {
  root.render(<h1>Your browser is not supported in this app </h1>)
}

unregister()
