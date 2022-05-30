// import { appWithTranslation } from 'next-i18next'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { MapProvider } from 'react-map-gl'
import { RecoilRoot } from 'recoil'
import store from '../store'
import './styles.css'
import 'features/i18n/i18n'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <MapProvider>
          <Component {...pageProps} />
        </MapProvider>
      </Provider>
    </RecoilRoot>
  )
}

export default CustomApp
