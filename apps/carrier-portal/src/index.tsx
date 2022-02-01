import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { unregister } from './serviceWorker'
import App from './app'
import store from './store'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import './index.css'

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

if (isBrowserSupported()) {
  render(<Root />, document.getElementById('root'))
  // Uncomment when concurrent mode stable
  // const root = (ReactDOM as any).createRoot(document.getElementById('root'))
  // root.render(<Root />)
} else {
  render(<h1>Your browser is not supported in this app </h1>, document.getElementById('root'))
}

unregister()
