/* eslint import/no-unresolved: 0 */

import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import { MapProvider as OrigMapProvider } from 'react-map-gl'
// import Head from 'next/head'
import store from '../store'
import 'features/i18n/i18n'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import './styles.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

export const MapProvider: React.FC<{ children: React.ReactNode }> = OrigMapProvider

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
