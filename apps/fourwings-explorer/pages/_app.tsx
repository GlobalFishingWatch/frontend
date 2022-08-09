import { AppProps } from 'next/app'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import { MapProvider } from 'react-map-gl'
import { QueryClient, QueryClientProvider } from 'react-query'

import './styles.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import './base.css'
import './timebar-settings.css'

const queryClient = new QueryClient()

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <QueryClientProvider client={queryClient}>
          <MapProvider>
            <Component {...pageProps} />
          </MapProvider>
        </QueryClientProvider>
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default CustomApp
