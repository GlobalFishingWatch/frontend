import type { AppProps } from 'next/app'
import { MapProvider } from 'react-map-gl'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import store from '../store'
import 'features/i18n/i18n'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import '../../../libs/timebar/src/timebar-settings.css'
import '../../../libs/ui-components/src/base.css'
import './styles.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <div className="app">
          <MapProvider>
            <Component {...pageProps} />
          </MapProvider>
        </div>
      </Provider>
    </RecoilRoot>
  )
}

export default CustomApp
