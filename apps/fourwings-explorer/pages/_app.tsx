// import { appWithTranslation } from 'next-i18next'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import { MapProvider } from 'react-map-gl'
import store from '../store'
import './styles.css'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <Provider store={store}>
          <MapProvider>
            <Component {...pageProps} />
          </MapProvider>
        </Provider>
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default CustomApp
