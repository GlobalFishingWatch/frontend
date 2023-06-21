import { AppProps } from 'next/app'
import Script from 'next/script'
import { MapProvider } from 'react-map-gl'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GOOGLE_TAG_MANAGER_ID } from 'data/config'
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
        {/* Google Tag Manager - Global base code */}
        <Script
          id="gtag-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${GOOGLE_TAG_MANAGER_ID}');
            `,
          }}
        />
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
