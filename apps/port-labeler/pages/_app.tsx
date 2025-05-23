// import { appWithTranslation } from 'next-i18next'
import { MapProvider } from 'react-map-gl'
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'

import 'features/i18n/i18n'

import store from '../store'

import './styles.css'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import 'maplibre-gl/dist/maplibre-gl.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MapProvider>
        <Component {...pageProps} />
      </MapProvider>
    </Provider>
  )
}

export default CustomApp
