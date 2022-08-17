import { AppProps } from 'next/app'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import { MapProvider } from 'react-map-gl'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import './styles.css'
import './base.css'
import './timebar-settings.css'

const queryClient = new QueryClient()

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
