import ReactDOM from 'react-dom/client'
import { MapProvider } from 'react-map-gl'
import { Provider } from 'react-redux'

import { ROOT_DOM_ELEMENT } from 'data/config'
import App from 'features/app/App'
import store from 'store'

import 'features/i18n/i18n'

import './styles.css'
import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'
import 'maplibre-gl/dist/maplibre-gl.css'

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
