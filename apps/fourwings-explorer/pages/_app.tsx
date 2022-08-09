import { AppProps } from 'next/app'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import { MapProvider } from 'react-map-gl'
import './styles.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import './base.css'
import './timebar-settings.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <MapProvider>
          <Component {...pageProps} />
        </MapProvider>
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default CustomApp
