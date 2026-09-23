import ReactDOM from 'react-dom/client'
import { MapProvider } from 'react-map-gl/maplibre'
import { Provider } from 'react-redux'
import { setWorkerUrl } from 'maplibre-gl'
// maplibre v6 resolves its worker with a computed `new URL(..., import.meta.url)`, which no
// bundler can statically analyse: Vite never emits the asset, so every worker-backed source
// (vector tiles, geojson, glyphs) 404s. Point it at a worker Vite does bundle.
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

import { ROOT_DOM_ELEMENT } from 'data/config'
import App from 'features/app/App'
import store from 'store'

import 'features/i18n/i18n'

import './styles.css'
import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'
import 'maplibre-gl/dist/maplibre-gl.css'

setWorkerUrl(maplibreWorkerUrl)

const rootElement = document.getElementById(ROOT_DOM_ELEMENT)
if (!rootElement) {
  throw new Error('Root element not found')
}
const root = ReactDOM.createRoot(rootElement)
root.render(
  <Provider store={store}>
    <MapProvider>
      <App />
    </MapProvider>
  </Provider>
)
